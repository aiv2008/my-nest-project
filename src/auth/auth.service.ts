import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { ApiResult } from 'src/common/result';
import { UserService } from 'src/user/user.service';
import { makeSalt,encryptPassword } from 'src/utils/cryptogram';
import { Prisma } from '@prisma/client';
import {JwtService} from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisClientType } from 'redis';
import * as StringUtil from 'lodash';
import * as svgCaptcha from 'svg-captcha';
import {v4 as uuid} from 'uuid';
// import crypto from 'crypto';
import {createCipheriv,createDecipheriv} from 'crypto';
import {cryptConstants} from '../config/constants';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService, 
        private readonly jwtService: JwtService,private prisma : PrismaService,
        @Inject('REDIS_CLIENT') private redisClient: RedisClientType
    ){}

    // @Inject('REDIS_CLIENT')
    // private redisClient: RedisClientType;


    async generateCaptcha(){
        const captcha = svgCaptcha.create({
            size: 4,// 验证码长度
            ignoreChars: '0o1i', // 排除 0o1i
            noise: 2, // 噪声线条数量
            color: true, // 验证码的字符有颜色，而不是黑白
            // background: '#cc9966' // 背景颜色
            background: '#fff' // 背景颜色
        });
        const uniqueId = uuid();
        const result = await this.redisClient.setEx(uniqueId, 300, captcha.text);
        // const svgData = captcha.data;
        const svgData = Buffer.from(captcha.data).toString('base64');
        const redisResult = await this.redisClient.get(uniqueId);
        if(result === 'OK'){
            return {
                // data: {
                    key: uniqueId,
                    value: `data:image/svg+xml;base64,${svgData}`
                    // value: svgData
                    // value: captcha.data
                // }
            }
        }
    }

    /**
     * admin endpoint registration
     * @param registerDto 
     * @returns 
     */
    async register(registerDto: RegisterDto): Promise<any|null>{
        const {accountName, realName, password, repassword, mobile, email} = registerDto;
        if(password !== repassword){
            return ApiResult.fail(400, '两次密码输入不一致！');
        }
        const user = await this.userService.findUniqueByPhone(accountName, true);
        if(user){
            return ApiResult.fail(400, '用户已存在!');
        }
        // 制作盐
        const salt = makeSalt();
        // 加密
        const hashPwd = encryptPassword(password, salt);
        const param: Prisma.UserCreateInput = {
            name: realName,
            phone: mobile,
            password: hashPwd,
            salt: salt,
            realName: realName,
            nickname: accountName,
            email: email
        }
        return await this.userService.create(param);
    }

    // 验证用户有效性，这个在local策略里用到
    async validateUser(username: string, password: string): Promise<any|null|undefined>{
        // console.dir(`loginDto: ${JSON.stringify(loginDto) }`)
        if(StringUtil.isEmpty(username) || StringUtil.isEmpty(password)){
            throw new BadRequestException('user is required');
        }
        // if(StringUtil.isEmpty(key)){
        //     throw new BadRequestException('key is required');
        // }
        // if(StringUtil.isEmpty(captcha)){
        //     throw new BadRequestException('captcha is required');
        // }
        // const captchaText = await this.redisClient.get(key);
        // if(captchaText !== captcha){
        //     throw new BadRequestException('captcha is  not correct');
        // }
        // const user = await this.userService.findUniqueByPhone(username, false);

        console.log(`local validate aes 解密前 ${username} ${password} `);
        username = this.desEncrypt(cryptConstants.key, cryptConstants.iv, username);
        password = this.desEncrypt(cryptConstants.key, cryptConstants.iv, password);
        console.log(`local validate aes 解密后 ${username} ${password} `);

        const user = await this.userService.findUniqueByEmail(username, false);
        if(StringUtil.isEmpty(user)){
            throw new BadRequestException('user not found');
        }
        password = encryptPassword(password, user.salt);
        console.log(`${user.password} 通过盐最终解密的密码： ${password} `);
        if(password !== user.password){
            throw new BadRequestException('password is not valid');
        }
        return {
            id: user.id,
            username: user.phone,
        }
    }

    async createToken(username: string, id: number){
        const token = await this.jwtService.sign({username, id});
        const expires = process.env.expiresTime;
        return {
            token,
            expires
        }
    }

    // 登录接口服务层
    async login(id: number, username:string){
        const token = await this.createToken(username, id);
        return{
            userInfo:{id, username},
            ...token,
        }
    }

    // 定义aes加密方法
    aesEncrypt(key: string, iv: string, data: string): string{
        //创建加密对象：三个参数（加密算法，加密的key和iv）
        const cipher = createCipheriv('aes-128-cbc', key ,iv);
        let crypted = cipher.update(data , 'binary', 'hex');
        //加密结束：结尾加上cipher.final('hex')表示结束
        crypted += cipher.final('hex');
        return crypted;
    }

    //定义aes解密方法
    desEncrypt(key: string, iv: string, data: string): string{
        //转换解密数据：把需要解密的数据，转化成buffer格式，再转换成二进制
        const crypted = Buffer.from(data, 'hex').toString('binary');
        const decipher = createDecipheriv('aes-128-cbc', key, iv);
        let decrypted = decipher.update(crypted, 'binary', 'utf8');
        //解密结束
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
