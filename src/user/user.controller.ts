import { Body, Controller , Get, Param, Post, Query, ParseIntPipe, Res, HttpStatus, UseInterceptors} from '@nestjs/common';
import { UserService } from './user.service';
import {  Prisma } from '@prisma/client';
import { TransformInterceptor } from 'src/interceptor/transform.interceptor'; 
import { ApiResult } from 'src/common/result';

@Controller('user')
export class UserController  {
    constructor(private readonly userService: UserService){
    }

    @UseInterceptors(TransformInterceptor)
    @Post('findfilter')
    async findMany(@Body() param: Prisma.UserWhereInput) : Promise<any | undefined>{
        return await this.userService.findFilter(param).then(async(o)=>{
            return ApiResult.success(o,'query filter successfully' );
        }).catch(async(e)=>{
            return ApiResult.fail(501, 'query filter failed'+e);
        });
    }

    @Post('create')
    @UseInterceptors(TransformInterceptor)
    async create(@Body() param: Prisma.UserCreateInput) {
        return await this.userService.create(param).then(async(o)=>{
            return ApiResult.success(o, 'created successfully');
        }).catch(async(e)=>{
            return ApiResult.fail(501, 'created failed'+e);
        });
    }

    @Get('findbyid/:id')
    @UseInterceptors(TransformInterceptor)
    async findUniqueById(@Param('id', ParseIntPipe) id : number){
        console.log('唯一值:' + id);
        return await this.userService.findUniqueById(id).then(async(o)=>{
            console.log('进入这里-----'+JSON.stringify(o));
            return ApiResult.success(o,'sucess');
        }).catch(async(e)=>{
            console.log('enter here-----');
            return ApiResult.fail(501, 'query by id failed'+e);
        });
    }

    @Get('findbyemail')
    @UseInterceptors(TransformInterceptor)
    async findUniqueByEmail(@Query() query: any){
        return await this.userService.findUniqueByEmail(query.email).then(async(o)=>{
            return ApiResult.success(o, 'success');
        }).catch(async(e)=>{
            console.log('异常:'+e);
            return ApiResult.fail(501, 'query failed');
        })
    }

    
    @Get('findbyphone')
    @UseInterceptors(TransformInterceptor)
    async findUniqueByPhone(@Query() query: any ){
        return await this.userService.findUniqueByPhone(query.phone).then(async(o)=>{
            return ApiResult.success(o, 'success');
        }).catch(async(e)=>{
            console.log('异常:'+e);
            return ApiResult.fail(501, 'query failed');
        })
    }

}
