import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  BadRequestException,
  NotFoundException,
  Res,
  Param,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { LoginDto } from 'src/dto/login.dto';
import { SessionService } from 'src/session/session.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.findByEmail(loginDto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // if (!user.isEmailVerified) {
    //   throw new BadRequestException('Please verify your email');
    // }

    const isMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isMatch) {
      throw new BadRequestException('Invalid password');
    }

    const session = await this.sessionService.createSession(user._id);

  return {
    success: true,
    message: 'Login successful',
    userDetail: {
      userId: user._id,
      name: user.name,
      token: session.token,
      expireAt: session.expireAt,
    },
  };
}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.authService.findByEmail(
      createUserDto.email,
    );

    // if (existingUser) {
    //   throw new BadRequestException('Email already exists');
    // }

    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      10,
    );

    await this.authService.signup(createUserDto);

    return {
      message:
        'User created successfully. Please verify your email.',
    };
  }

   @Post('google')
  async googleLogin(@Body() profile: any) {
    return this.authService.oauthLogin(profile, 'google');
  }

  @Post('facebook')
  async facebookLogin(@Body() profile: any) {
    return this.authService.oauthLogin(profile, 'facebook');
  }

  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    console.log('Backend: Received token:', token); // For debugging
    const user = await this.authService.verifyUserByToken(token);
    console.log('Backend: User found:', user); // For debugging

    if (!user) {
      throw new BadRequestException('User is not verified');
    }

    return { message: 'Email verified successfully' };
  }
}
