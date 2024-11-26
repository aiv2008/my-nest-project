import { HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from 'passport-local';
import { AuthService } from "../auth.service";
import { ApiResult } from "src/common/result";
// import { LoginDto } from "../dto/login.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor (private readonly authService: AuthService){
        // super({
        //     usernameField: 'username',
        //     passwordField: 'password',
        // });
        super();
    }

    async validate(username: string, password: string): Promise<any|null|undefined>{
        const user = await this.authService.validateUser(username, password);
        if(!user){
            throw new UnauthorizedException('password is not correct');
            // return ApiResult.fail(HttpStatus.UNAUTHORIZED, 'password is not correct');
        }
        return user;
    }
}