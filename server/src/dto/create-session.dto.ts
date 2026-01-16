import { IsNotEmpty, IsString, IsOptional, IsDate, IsBoolean } from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsString()
  userId: string; // MongoDB ObjectId as string

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsDate()
  expireAt: Date;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
