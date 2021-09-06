import { ResponseUserDto } from './dto/response-user.dto';
import { User } from './entities/user.entity';

export type UserWithoutPassword = Omit<User, 'password'>;
export type ResponseUserWithoutPassword = Omit<ResponseUserDto, 'password'>;
