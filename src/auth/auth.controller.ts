import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { TransformInterceptor } from 'src/interceptor/transform.interceptor';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('register')
    @UseInterceptors(TransformInterceptor)
    async register(@Body() param: RegisterDto){
        return await this.authService.register(param);
    }
}
