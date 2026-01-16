import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { SessionModule } from './session/session.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { PaymentService } from './payment/payment.service';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    AuthModule,
    MailModule,
    UserModule,
    SessionModule,
    ProductModule,
    OrderModule,
    //  ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
  ],
  controllers: [AppController],
  providers: [AppService, PaymentService],
})
export class AppModule {}
