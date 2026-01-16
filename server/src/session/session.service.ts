import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import { Session } from 'src/schema/session.schema';
import { ISession } from 'src/interface/session.interface';
import { UpdateSessionDto } from 'src/dto/update-session.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<ISession>,
  ) {}

  async createSession(userId: Types.ObjectId) {
    const token = crypto.randomBytes(40).toString('hex');

    const expireAt = new Date();
    expireAt.setDate(expireAt.getDate() + 7); 

    const session = await this.sessionModel.create({
      userId,
      token,
      expireAt,
    });

    return {
      token: session.token,
      expireAt: session.expireAt,
    };
  }

  async getSessionDetail(token: string): Promise<any> {
  return this.sessionModel
    .findOne({ token })
    .populate('userId')
    .exec();
}

   async updateSessionToken(token: string, updateSession: UpdateSessionDto): Promise<void> {
        const newExpireAt = new Date();
        newExpireAt.setDate(newExpireAt.getDate() + 7);

        await this.sessionModel.updateOne({ token },updateSession);
      }
}
