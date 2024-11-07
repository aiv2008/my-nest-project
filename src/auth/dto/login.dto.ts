import { IsNotEmpty, IsString, isString } from "class-validator";

export class LoginDto{

    @IsNotEmpty({message: '账号不能为空'})
    @IsString({message: '账号必须为字符串'})
    username: string;

    @IsNotEmpty({message: '密码不能为空'})
    @IsString({message: '账号必须为字符串'})
    password: string;

    @IsNotEmpty({message : 'key不能为空'})
    @IsString({message : 'key必须为字符串'})
    key: string;

    @IsNotEmpty({message : '验证码不能为空'})
    @IsString({message : '验证码必须为字符串'})
    captcha: string;
}