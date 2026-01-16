import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { IUser } from 'src/interface/user.interface';
import { MailService } from 'src/mail/mail.service';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    private readonly mailService: MailService,
    private readonly sessionService: SessionService
  ) {}

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userModel.findOne({
      email,
      isDeleted: false,
    });
  }

  async signup(createUserDto: CreateUserDto) {
    const token = crypto.randomBytes(32).toString('hex');

    const newUser = new this.userModel({
      ...createUserDto,
      isEmailVerified: false,
      emailVerificationToken: token || crypto.randomBytes(32).toString('hex') ,
      emailVerificationExpires: new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ),
    });
    await newUser.save();

    await this.mailService.sendVerificationEmail(
      newUser.email,
      token,
    );
  }

  async verifyEmail(token: string) {
    const user = await this.userModel.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException(
        'Invalid or expired token',
      );
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
console.log("user where saving and signup", user)
    await user.save();

    return { message: 'Email verified successfully' };
  }

   async oauthLogin(profile: any, provider: string) {
  const idField = provider === 'google' ? 'googleId' : 'facebookId';
  let user = await this.userModel.findOne({ [idField]: profile.id });
  if (!user) {
    user = new this.userModel({
      name: profile.displayName,
      email: profile.emails[0].value,
      [idField]: profile.id,
      isEmailVerified: true, 
    });
    await user.save();
  }
  const session = await this.sessionService.createSession(user._id);
  return { token: session.token, user };
}

async verifyUserByToken(token: string) {
const user =  await this.userModel.findOne({
      emailVerificationToken: token,
    });
    user.isEmailVerified = true;
    await user.save();
  return user;
  }

}
