import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userDoc: Model<UserDocument>,
  ) {}

  async authenticateWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserDocument> {
    const user = await this.userDoc.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    return user;
  }

  async findUserById(id: string): Promise<UserDocument> {
    return this.userDoc.findById(id);
  }
}
