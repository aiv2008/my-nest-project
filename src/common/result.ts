import { HttpStatus } from "@nestjs/common";

export class ApiResult<T>{
    constructor(
        public code = HttpStatus.OK,
        public msg?:string,
        public data?: T
    ){
        this.code = code;
        this.data = data;
        this.msg = msg;
    }

    static success(data?: any, msg?: string){
        return new ApiResult(HttpStatus.OK, msg, data);
    }

    // static fail(msg?: string){
    //     return new ApiResult(HttpStatus.BAD_REQUEST, msg);
    // }

    static fail(code = HttpStatus.BAD_REQUEST, msg?: string, data? : any){
        return new ApiResult(code, msg, data);
    }
}