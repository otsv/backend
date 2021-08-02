import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppConfigService } from 'src/common/config/config.service';
import { CreateUserDto } from './user.dto';
import { UserDocument } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userDoc: Model<UserDocument>,
    private readonly config: AppConfigService,
  ) {}

  async createUser(user: CreateUserDto): Promise<any> {
    if (await this.isEmailTaken(user.email)) {
      throw new BadRequestException('Email already taken');
    }
    const createUser = await this.userDoc.create(user);
    return await createUser.save();
  }

  async isEmailTaken(email: string, excludeEmail?: string): Promise<boolean> {
    const user = await this.userDoc.findOne({
      email,
      _id: { $ne: excludeEmail },
    });
    return !!user;
  }

  async seedAccounts() {
    try {
      if (this.config.seederAccount) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const accounts = require('../../../json/seed_accounts.json');

        accounts.forEach(async (account) => {
          const isExisted = await this.userDoc.findOne({
            email: account.email,
          });
          if (!isExisted) {
            await this.userDoc.create(account);
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  }
}
