import { User } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { Decimal, JsonValue } from "@prisma/client/runtime/library";
import { Exclude } from "class-transformer";
export class UserEntity implements User{
    @ApiProperty()
    id: number

    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    realName: string;

    @ApiProperty()
    birthday: number;

    @ApiProperty()
    idCard: string;

    @ApiProperty()
    mark: string;

    @ApiProperty()
    partnerId: number;

    @ApiProperty()
    addIp: string;

    @ApiProperty()
    addres: string;

    @ApiProperty()
    adminid: number;

    @ApiProperty()
    avatar: string;

    @ApiProperty()
    brokeragePrice: Decimal;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    endTime: Date;

    @ApiProperty()
    gradeId: string;

    @ApiProperty()
    groupId: number;

    @ApiProperty()
    integral: Decimal;

    @ApiProperty()
    isPromoter: boolean;

    @ApiProperty()
    lastIp: string;

    @ApiProperty()
    level: number;

    @ApiProperty()
    loginType: string;

    @ApiProperty()
    nickname: string;

    @ApiProperty()
    nowMoney: Decimal;

    @ApiProperty()
    payCount: number;

    @ApiProperty()
    signNum: number;

    @ApiProperty()
    spreadCount: number;

    @ApiProperty()
    spreadTime: Date;

    @ApiProperty()
    spreadUid: bigint;

    @ApiProperty()
    startTime: Date;

    @ApiProperty()
    status: boolean;

    @ApiProperty()
    updateAt: Date;

    @ApiProperty()
    userType: string;

    @ApiProperty()
    wxProfile: JsonValue;

    @ApiProperty()
    @Exclude()
    isDel: boolean;

    @ApiProperty()
    @Exclude()
    password: string;

    @ApiProperty()
    @Exclude()
    salt: string;
}