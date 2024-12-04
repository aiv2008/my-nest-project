import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt,Strategy} from 'passport-jwt';
import {JwtConstants} from '../../config/constants'
import { Injectable } from "@nestjs/common";

// 1. Given a JWT token `XXX`, access */profile* with header `Authorization:Bearer XXX`.
// 2. `JwtAuthGuard` will trigger `JwtStrategy`, and calls `validate` method, and store the result back to `request.user`.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            // The `jwtFromRequest` specifies the approach to extract token,  it can be from HTTP cookie or request header `Authorization` .
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // If `ignoreExpiration` is false, when decoding the JWT token, it will check expiration date.
            ignoreExpiration:false,
            //The `secretOrKey` is used to sign the JWT token or decode token.
            secretOrKey:JwtConstants.SECRET
        });
    }
    // JWT验证-step 4：被守卫调用
    async validate(payload: any){
        console.dir(`payload : ${JSON.stringify(payload)}`);
        return payload;
        // return { 
        //     userId: payload.sub,
        //     username: payload.realName,
        //     realName: payload.realName,
        //     role: payload.role
        // }
    }
}