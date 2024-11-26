import { Body, Controller , Get, Param, Post, Query, ParseIntPipe, Res, HttpStatus, UseInterceptors, UseGuards, Req} from '@nestjs/common';
import { UserService } from './user.service';
import {  Prisma } from '@prisma/client';
import { TransformInterceptor } from 'src/interceptor/transform.interceptor'; 
import { ApiResult } from 'src/common/result';
import { AuthGuard } from '@nestjs/passport';
import { TokenGuard } from 'src/auth/guards/token.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController  {
    constructor(private readonly userService: UserService){
    }

    @UseInterceptors(TransformInterceptor)
    @UseGuards(JwtAuthGuard)
    @Post('findfilter')
    async findMany(@Body() param: Prisma.UserWhereInput) : Promise<any | undefined>{
        return await this.userService.findFilter(param).then(async(o)=>{
            return ApiResult.success(o,'query filter successfully' );
        }).catch(async(e)=>{
            return ApiResult.fail(501, 'query filter failed'+e);
        });
    }

    @UseInterceptors(TransformInterceptor)
    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Body() param: Prisma.UserCreateInput) {
        return await this.userService.create(param).then(async(o)=>{
            return ApiResult.success(o, 'created successfully');
        }).catch(async(e)=>{
            return ApiResult.fail(501, 'created failed'+e);
        });
    }

    @UseInterceptors(TransformInterceptor)
    @UseGuards(JwtAuthGuard)
    @Get('findbyid/:id')
    async findUniqueById(@Param('id', ParseIntPipe) id : number, @Req() request: Request){
        console.dir(`用户信息: ${JSON.stringify(request['user'])}`);
        return await this.userService.findUniqueById(id).then(async(o)=>{
            return ApiResult.success(o,'sucess');
        }).catch(async(e)=>{
            return ApiResult.fail(501, 'query by id failed'+e);
        });
    }

    @UseInterceptors(TransformInterceptor)
    @UseGuards(JwtAuthGuard)
    @Get('findbyemail')
    async findUniqueByEmail(@Query() query: any){
        return await this.userService.findUniqueByEmail(query.email,true).then(async(o)=>{
            return ApiResult.success(o, 'success');
        }).catch(async(e)=>{
            return ApiResult.fail(501, 'query failed');
        })
    }

    @UseInterceptors(TransformInterceptor)
    @UseGuards(JwtAuthGuard)
    @Get('findbyphone')
    async findUniqueByPhone(@Query() query: any ){
        return await this.userService.findUniqueByPhone(query.phone, true).then(async(o)=>{
            return ApiResult.success(o, 'success');
        }).catch(async(e)=>{
            return ApiResult.fail(501, 'query failed');
        })
    }

}
