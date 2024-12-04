import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from './config/constants';
import { createClient } from 'redis';

@Module({
  imports: [UserModule, PrismaModule, AuthModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    // JwtModule.register({
    //     secret: JwtConstants.SECRET,
    //     signOptions: {expiresIn: JwtConstants.EXPIRES}, //token过期
    // }),
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, UserService, AuthService,
    {
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
}],
})
export class AppModule {}
