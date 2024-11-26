import { Injectable } from '@nestjs/common';
// import {  Prisma } from '@prisma/client';
import {Prisma, User} from '@prisma/client/default'
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma : PrismaService){
        
    }

    async create(param: Prisma.UserCreateInput): Promise<any | undefined>{
        // const data = param;
        return await  this.prisma.user.create({
            omit: {
                password: true,
                salt: true,
            },
            data: param
        });
    }

    async update(param: User): Promise<any|undefined>{

    }
  
    async findUniqueById(id: number): Promise<any|undefined>{
        return await this.prisma.user.findUnique({
            omit: {
                password: true,
                salt: true
            },
            where : {id : id}
        });
    }

    async findUniqueByEmail(email: string, isOmit: boolean): Promise<any|null>{
        return await this.prisma.user.findUnique({
            omit: {
                password: isOmit,
                salt: isOmit
            },
            where : {email : email}
        });
    }

    async findUniqueByPhone(phone: string, isOmit: boolean): Promise<any | undefined>{
        return await this.prisma.user.findUnique({
            omit: {
                password: isOmit,
                salt: isOmit
            },
            where : { phone : phone }
        });
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
            omit: {
                password: true,
                salt: true
            },
            where : where
        });
    }

    
}
