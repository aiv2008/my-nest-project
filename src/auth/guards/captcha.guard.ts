import { BadRequestException, CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import * as StringUtil from 'lodash';
import { RedisClientType } from "redis";

export class CaptchaGuard implements CanActivate{

    @Inject('REDIS_CLIENT') 
    private redisClient: RedisClientType;

    /**
     * 校验验证码
     * @param context 
     * @returns 
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const body = request.body;
        const key = body.key;
        const captcha = body.captcha;
        if(StringUtil.isEmpty(key)){
            throw new BadRequestException('key is required');
        }
        if(StringUtil.isEmpty(captcha)){
            throw new BadRequestException('captcha is required');
        }
        const captchaText = await this.redisClient.get(key);
        if(captcha.toUpperCase() !== captchaText.toUpperCase()){
            throw new BadRequestException('captcha is not correct');
        }
        return true;
    }
}