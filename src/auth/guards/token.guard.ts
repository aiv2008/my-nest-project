import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { RedisInstance } from "src/utils/redis";


/**
 * redis 存取 token
 */
@Injectable()
export class TokenGuard implements CanActivate{

    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        // 获取请求头里的token
        const authorization = request.headers.authorization || void 0;
        const token = authorization.split(' ')[1]; // authorization: Bearer xxx
        // 获取redis里缓存的token
        const redis = await RedisInstance.initRedis('TokenGuard.canActivate', 0);
        const key = `token-${user.sub}-${user.username}`;
        const cache = await redis.get(key);
        if(token !== cache){
            // 如果token不匹配， 禁止访问
            throw new UnauthorizedException('您的账号在其他地方登录，请重新登录');
        }
        return true;
    }
}