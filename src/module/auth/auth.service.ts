import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userDoc: ReturnModelType<typeof User>,
  ) {}

  async authenticateWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.userDoc.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    return user;
  }

  async findUserById(id: string): Promise<User> {
    return this.userDoc.findById(id);
  }
}
