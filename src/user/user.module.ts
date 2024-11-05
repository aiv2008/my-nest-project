import { Module } from '@nestjs/common';
import { UserController} from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
@Module({
    controllers: [UserController],
    providers: [UserService,
        {
            provide: 'jwt',
            useClass: JwtStrategy
        }
    ],
    exports: [UserService],
    imports: [PrismaModule]
})
export class UserModule {}
