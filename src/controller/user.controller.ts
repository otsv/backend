import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { ResponseInterceptor } from 'src/Interceptors/response.interceptor';
import { UserService } from 'src/module/user/user.service';
import { ParseObjectId } from 'src/pipes/object-id.pipe';

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UsePipes(ParseObjectId)
  @UseInterceptors(ResponseInterceptor)
  @ApiBearerAuth()
  async getUserById(@Param('id') id: string) {
    return await this.userService.findUserById(id);
  }
}
