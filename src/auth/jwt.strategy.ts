import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt,Strategy} from 'passport-jwt';
import {jwtConstants} from '../config/constants'
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:jwtConstants.secret
        });
    }
    // JWT验证-step 4：被守卫调用
    async validate(payload: any){
        return {
            userId: payload.sub,
            username: payload.username,
            realName: payload.realName,
            role: payload.role
        }
    }
}