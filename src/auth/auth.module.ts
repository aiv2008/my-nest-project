import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtConstants } from 'src/config/constants';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { createClient } from 'redis';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';


@Module({
    imports: [
        PassportModule.register({defaultStrategy: 'jwt'}),
        // JwtModule.register({
        //     secret: JwtConstants.SECRET,
        //     signOptions: {expiresIn: JwtConstants.EXPIRES}, //token过期
        // }),
        UserModule, PrismaModule
    ],
    providers: [AuthService
        // , JwtStrategy ,
        // redis配置
        ,{
            provide: 'REDIS_CLIENT',
            async useFactory() {
                const client = createClient({
                    socket: {
                        host: 'localhost',
                        port: 6379
                    }
                });
                await client.connect();
                return client;
            }
        },
        {
            provide: 'local',
            useClass: LocalStrategy
        }
    ],
    exports: [AuthService]
})
export class AuthModule {}
