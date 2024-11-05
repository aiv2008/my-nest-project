import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
    constructor(){
        super();
        console.log('---enter jwtAuthGuard constructor 卫兵guard -----');
    }
}