import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { ApiResult } from 'src/common/result';
import { UserService } from 'src/user/user.service';
import { makeSalt,encryptPassword } from 'src/utils/cryptogram';
import { Prisma } from '@prisma/client';
// import { JwtStrategy } from './jwt.strategy';
import {JwtService} from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisClientType } from 'redis';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService, 
        private readonly jwtService: JwtService,private prisma : PrismaService,
        @Inject('REDIS_CLIENT') private redisClient: RedisClientType
    ){}

    async validateUser(username: string, password: string): Promise<any|null>{
        console.log('Jwt验证 - Step 2：校验用户信息');
        // const user = await this.userService.findUniqueByPhone(username);
        return await this.userService.findUniqueByPhone(username,false).then(async(user)=>{
            console.log(`----序列化user：${JSON.stringify(user)}----`);
            console.log(`${user != null}`);
            if(user != null){
                const salt = user.salt;
                const userPwd = user.password;
                console.log(`----密码等于${userPwd}----`);
                //通过密码盐加密传参，再和数据库的比较，判断是否相等
                const hashPwd = encryptPassword(password, salt);
                if(hashPwd === userPwd){
                    return {
                        code: 1,
                        user: user,
                        msg : '密码正确'
                    }
                }else{
                    return {
                        code: 2,
                        msg:'密码错误'
                    }
                }
            }
            return {
                code: 3,
                msg: '查无此人'
            }
        }).catch(async(e)=>{
            console.log(`系统错误:${e}`);
            return {
                code: 4,
                msg: `系统错误:${e}`
            }
        });
        
    }

    // jwt验证-step 3：处理jwt签证
    certificate(user: any): string{
        const payload = {
            username: user.username,
            sub: user.id,
            realName: user.realName,
            role: user.role
        }
        console.log('JWT验证 - Step 3: 处理 jwt 签证');
        return this.jwtService.sign(payload);
        // try{
        //     const token = this.jwtService.sign(payload);
        //     return ApiResult.success(token, '登录成功');
        // }catch(e){
        //     return ApiResult.fail(HttpStatus.EXPECTATION_FAILED, '账号或密码错误');
        // }
        
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

    /**
     * 
     * @param username 
     * @param password 
     * @returns 
     */
    async login(username: string, password: string): Promise<any|undefined>{
        console.log('JWT验证 - Step 1: 用户请求登录');
        // const authResult = this.authService.validateUser(param.username, param.password);
        return await this.validateUser(username, password).then(async(authResult)=>{
            switch(authResult['code']){
                case 1:
                    try{
                        const token = this.certificate(authResult['user']);
                        // const token = this.jwtService.sign(payload);
                        this.redisClient.set('token', `Bearer ${token}`);
                        return ApiResult.success(`Bearer ${token}`, '登录成功');
                    }catch(e){
                        return ApiResult.fail(HttpStatus.EXPECTATION_FAILED, '账号或密码错误');
                    }
                case 2:
                    return ApiResult.fail(HttpStatus.BAD_REQUEST, '账号或密码错误');
                case 3:
                    return ApiResult.fail(HttpStatus.BAD_REQUEST, '用户不存在');
                default:
                    return ApiResult.fail(HttpStatus.BAD_REQUEST, '系统错误');
            }
        }).catch(async(e)=>{
            return ApiResult.fail(HttpStatus.BAD_REQUEST, `系统错误:${e}`);
        });
    }
}
