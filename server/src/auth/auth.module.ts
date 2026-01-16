import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MailService } from 'src/mail/mail.service';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user.schema';
import { MailModule } from 'src/mail/mail.module';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports:[
    MongooseModule.forFeature([{name : User.name, schema: UserSchema }]),
    MailModule, SessionModule,
  ],
  controllers: [AuthController],
  providers:[MailService, AuthService],
  exports: [AuthService]
})
export class AuthModule {}
