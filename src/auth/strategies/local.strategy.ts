import { HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from 'passport-local';
import { AuthService } from "../auth.service";

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
        console.log(`local validate ${username} ${password}`);
        // return await this.authService.validateUser(username, password);
        const user = await this.authService.validateUser(username, password);
        if(!user){
            throw new UnauthorizedException();
        }
        return user;
    }
}