import { Injectable } from '@nestjs/common';
import {  User,Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Omit } from '@prisma/client/runtime/library';
@Injectable()
export class UserService {
    constructor(private prisma : PrismaService){
        
    }

    async create(param: Prisma.UserCreateInput): Promise<any | undefined>{
        // const data = param;
        return await  this.prisma.user.create({
            data: param
        });
    }

    async update(param: User): Promise<any|undefined>{

    }
  
    async findUniqueById(id: number): Promise<any|undefined>{
        return await this.prisma.user.findUnique({
            omit: {
                password: true
            },
            where : {id : id}
        });
    }

    async findUniqueByEmail(email: string): Promise<any|null>{
        console.log('email: '+email);
        return await this.prisma.user.findUnique({
            where : {email : email}
        });
    }

    async findUniqueByPhone(phone: string): Promise<any | undefined>{
        const data =  await this.prisma.user.findUnique({
            where : { phone : phone }
        });
        return data;
    }

    async findFilter(param: Prisma.UserWhereInput): Promise<any | undefined>{
        let where = {};
        if(param.email){
            where['email'] = {equals : param.email}
        }
        if(param.name){
            where['name'] = {lte : param.name}
        }
        if(param.phone){
            where['phone'] = {equals: param.phone}
        }
        return await this.prisma.user.findMany({
            where : where
        });
    }

    
}
