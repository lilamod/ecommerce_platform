import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){};

   @Post()
async createUser(@Res() response, @Body() createUserDto: CreateUserDto) {
  try {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    const user = await this.userService.createUser(createUserDto);
    return response.status(HttpStatus.CREATED).json(user);
  } catch (error) {
    return response.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
}
}
