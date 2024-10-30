import { Injectable, Param } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(){
        super({ log: ['query', 'info', 'warn', 'error']});
        //利用中间件对查询数据库结果的bugint类型进行序列化
        super.$use(async (params, next)=>{
            const before = Date.now();
            const result = await next(params);
            const after = Date.now();
            console.log(
                `Query ${params.model}.${params.action} took ${after - before}ms`,
            );
            return this.serialize(result);
        });
    }

    // serilize the object type including the bigint
    serialize(obj){
        if(typeof obj === 'bigint'){
            return parseInt(`${obj}`);
        }else if(typeof obj === 'object' && obj !== null){
            return JSON.parse(
                JSON.stringify(obj, (key, value)=>{
                    if(typeof value === 'bigint'){
                        return parseInt(`${value}`);
                    }
                    return value;
                }),
            );
        }
        return obj; // return directly which is not an object type
    }
}
