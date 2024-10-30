import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, IsEmail , isMobilePhone, IsMobilePhone} from "class-validator";

export class UserDto{

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    accountName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    realName: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(32)
    @ApiProperty()
    password: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(32)
    @ApiProperty()
    repassword: string;
    
    @IsString()
    @IsNotEmpty()
    @IsMobilePhone()
    @ApiProperty()
    mobile: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;
}

