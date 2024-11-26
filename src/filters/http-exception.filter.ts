import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { response } from "express";
import { timestamp } from "rxjs";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter{

    /**
     * 
     * @param exception 当前正在处理的异常对象
     * @param host 传递给原始处理程序的参数的一个包装（Response/Request）的引用
     */
    catch(exception: any, host: ArgumentsHost) {
        console.log('---进入全局异常处理器----');
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        //HttpException 属于基础异常类，可自定义内容
        //如果是自定义的异常类则抛出自定义的status
        //否则就是内置http异常类，然后抛出其对应的内置status的内容
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception.message || exception.message.message || exception.message.error || null || undefined;
        let msgLog = {
            code: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: '请求失败',
            data: message
        }
        //打印日志
        Logger.error('错误信息', JSON.stringify(msgLog), 'HttpExceptionFilter');
        response.status(status).json(msgLog);
    }
}