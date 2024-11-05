import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { ApiResult } from 'src/common/result';
import { UserService } from 'src/user/user.service';
import { makeSalt,encryptPassword } from 'src/utils/cryptogram';
import { Prisma } from '@prisma/client';
import {JwtService} from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisClientType } from 'redis';
import * as _ from 'lodash';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService, 
        private readonly jwtService: JwtService,private prisma : PrismaService,
        @Inject('REDIS_CLIENT') private redisClient: RedisClientType
    ){}

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
        if(_.isEmpty(username) || _.isEmpty(password)){
            throw new BadRequestException('user is required');
        }
        const user = await this.userService.findUniqueByPhone(username, false);
        if(_.isEmpty(user)){
            throw new BadRequestException('user not found');
        }
        // console.log(`password=${password}, user.password=${user.password}`);
        // 制作盐
        // const salt = makeSalt();
        // 加密
        // const hashPwd = encryptPassword(password, salt);
        // const isValidPwd = await bcrypt.compare(password, user.password);
        // console.log(`hashPwd=${hashPwd}, user.password=${user.password}`);
        // if(!isValidPwd){
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

    // /**
    //  * 
    //  * @param username 
    //  * @param password 
    //  * @returns 
    //  */
    // async validateUser(username: string, password: string): Promise<any|undefined>{
    //     console.log('JWT验证 - Step 1: 用户请求登录');
    //     // const authResult = this.authService.validateUser(param.username, param.password);
    //     console.log('Jwt验证 - Step 2：校验用户信息');
    //     // const user = await this.userService.findUniqueByPhone(username);
    //     return await this.userService.findUniqueByPhone(username,false).then(async(user)=>{
    //         console.log(`----序列化user：${JSON.stringify(user)}----`);
    //         console.log(`${user != null}`);
    //         if(user != null){
    //             const salt = user.salt;
    //             const userPwd = user.password;
    //             console.log(`----密码等于${userPwd}----`);
    //             //通过密码盐加密传参，再和数据库的比较，判断是否相等
    //             const hashPwd = encryptPassword(password, salt);
    //             if(hashPwd === userPwd){
    //                 try{
    //                     // const user = authResult.user;
    //                     const payload = {
    //                         username: user.username,
    //                         sub: user.id,
    //                         realName: user.realName,
    //                         role: user.role
    //                     }
    //                     console.log('JWT验证 - Step 3: 处理 jwt 签证');
    //                     const token = this.jwtService.sign(payload);
    //                     // const token = this.certificate(user);
    //                     return ApiResult.success(`Bearer ${token}`, '登录成功');
    //                 }catch(e){
    //                     return ApiResult.fail( HttpStatus.EXPECTATION_FAILED, '账号或密码错误');
    //                 }
    //             }else{
    //                 return ApiResult.fail(HttpStatus.BAD_REQUEST, '账号或密码错误');
                    
    //             }
    //         }
    //         return ApiResult.fail(HttpStatus.BAD_REQUEST, '用户不存在');
    //     }).catch(async(e)=>{
    //         console.log(`系统错误:${e}`);
    //         return ApiResult.fail(HttpStatus.BAD_REQUEST, `系统错误:${e}`);
    //     });
    // }

}
