import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local'){
    constructor(){
        super();
        console.log('---enter LocalAuthGuard constructor 卫兵guard -----');
    }
}