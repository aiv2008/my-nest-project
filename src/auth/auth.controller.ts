import { Body, Controller, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import { TransformInterceptor } from 'src/interceptor/transform.interceptor';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { ApiResult } from 'src/common/result';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

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
    @Post('login')
    @UseInterceptors(TransformInterceptor)
    async login(@Body() param: any){
        return await this.authService.login(param.username, param.password);
    }
}
