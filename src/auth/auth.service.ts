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
import * as bcrypt from 'bcryptjs';
import * as svgCaptcha from 'svg-captcha';
import {v4 as uuid} from 'uuid';
import { LoginDto } from './dto/login.dto';


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
            size: 6,// 验证码长度
            ignoreChars: '0o1i', // 排除 0o1i
            noise: 2, // 噪声线条数量
            color: true, // 验证码的字符有颜色，而不是黑白
            background: '#cc9966' // 背景颜色
        });
        const uniqueId = uuid();
        const result = await this.redisClient.setEx(uniqueId, 60, captcha.text);
        const svgData = Buffer.from(captcha.data).toString('base64');
        const redisResult = await this.redisClient.get(uniqueId);
        console.log(`${captcha.text}`);
        console.log(`result = ${result}`);
        console.log(`redis = ${redisResult}`);
        if(result === 'OK'){
            return {
                data: {
                    key: uniqueId,
                    value: svgData
                }
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
        const user = await this.userService.findUniqueByPhone(username, false);
        if(StringUtil.isEmpty(user)){
            throw new BadRequestException('user not found');
        }
        if(password !== user.password){
            throw new BadRequestException('password is not valid');
        }
        console.log(`user=${JSON.stringify(user)}`);
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
        console.log(`id=${id}, username=${username}`);
        const token = await this.createToken(username, id);
        return{
            userInfo:{id, username},
            ...token,
        }
    }

}
