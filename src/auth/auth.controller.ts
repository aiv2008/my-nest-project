import { Body, Controller, HttpStatus, Post, UseInterceptors, UseGuards, Req, Get, Res, UseFilters } from '@nestjs/common';
import { TransformInterceptor } from 'src/interceptor/transform.interceptor';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { ApiResult } from 'src/common/result';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CaptchaGuard } from './guards/captcha.guard';
// import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Get('captcha')
    generateCaptcha(){
        // res.type('svg');
        return this.authService.generateCaptcha();
        // const data = this.authService.generateCaptcha();
        // return res.send(data['value']);
    }

    @Post('register')
    @UseInterceptors(TransformInterceptor)
    async register(@Body() param: RegisterDto){
        return await this.authService.register(param).then(async(o)=>{
            return ApiResult.success(o, 'created successfully');
        }).catch(async(e)=>{
            return ApiResult.fail(501, 'created failed'+e);
        });
    }

    // JWT验证 - Step 1: 用户请求登录
    // @Post('login')
    // @UseGuards(LocalAuthGuard)
    // @UseInterceptors(TransformInterceptor)
    // // async login(@Body() param: any, @Req() request: Request){
    // login(  @Req() request: Request){
    //     console.dir(`request 请求：${JSON.stringify( request['user'])}`)
    //     // return await this.authService.login(param.username, param.password);
    //     return request['user'];
    // }
    @UseInterceptors(TransformInterceptor)
    @UseGuards(CaptchaGuard)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: Request){
        const user = req['user'];
        return  await this.authService.login(user.id, user.username).then(async(o)=>{
            return ApiResult.success(o,'登录成功');
        }).catch(async(e)=>{
            return ApiResult.fail(HttpStatus.BAD_REQUEST, `登录失败：${e}`);
        });
    }

    @UseInterceptors(TransformInterceptor)
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    me(@Req() req: Request){
        return ApiResult.success(req['user'], '获取当前用户成功');
    }
}
