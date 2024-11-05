import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpStatus
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { map } from 'rxjs';
import { ApiResult } from 'src/common/result';

// export interface ResponseType<T>{
//     data: T;
//     code: number;
//     message: string;
// }

/**
 * 统一返回格式，用拦截器
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResult<T>>{
    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<ApiResult<T>>{
        console.log('--进入TransformInterceptor拦截器---');
        // 因为nestjs使用restful api风格，对于post请求默认返回201，所以需要手动处理成200
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();
        if (request.method === 'POST' &&
            response.statusCode === HttpStatus.CREATED
        ){
            response.status(HttpStatus.OK);
        }
        return next.handle().pipe(map((data: ApiResult<T>) => {
                return data
        }));
    }
}