import { Body, Controller , Get, Param, Post, Query, ParseIntPipe, Res, HttpStatus, UseInterceptors} from '@nestjs/common';
import { UserService } from './user.service';
import {  Prisma, User } from '@prisma/client';
import { TransformInterceptor } from 'src/interceptor/transform.interceptor'; 
import { ApiResult } from 'src/common/result';

@Controller('user')
export class UserController  {
    constructor(private readonly userService: UserService){
    }

    @UseInterceptors(TransformInterceptor)
    @Post('findfilter')
    async findMany(@Body() param: Prisma.UserWhereInput) : Promise<any | undefined>{
        return ApiResult.success(await  this.userService.findFilter(param), 'query filter successfully');
    }

    @Post('create')
    @UseInterceptors(TransformInterceptor)
    async create(@Body() param: Prisma.UserCreateInput) {
        return ApiResult.success(await  this.userService.create(param), 'created successfully');
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
        // return ApiResult.success( await this.userService.findUniqueByEmail(query.email), 'query by email sucessfully') ;
        try{
            return ApiResult.success(await this.userService.findUniqueByEmail(query.email), 'query sucessfully');
        }catch(e){
            console.log('异常:'+e);
            return ApiResult.fail(500, 'query failed');
        }
        // const data = await this.userService.findUniqueByEmail(query.email).catch(async(e)=>{
        //     // return ApiResult.fail(HttpStatus.BAD_REQUEST, 'query failed');
        //     console.log('异常:'+e);
        //     return ApiResult.fail(500, 'query failed');
        // });
        // console.log("data: ===="+data);
        // return ApiResult.success(data, 'query sucessfully');
    }

    
    @Get('findbyphone')
    @UseInterceptors(TransformInterceptor)
    async findUniqueByPhone(@Query() query: any ){
        return ApiResult.success(await this.userService.findUniqueByPhone(query.phone), 'query by phone sucessfully');
    }

}
