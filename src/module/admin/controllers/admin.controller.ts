import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { pick } from 'lodash';
import { Request } from 'express';
import { PaginationResult } from 'src/module/shared/dtos/pagination.dto';
import { RoleType } from 'src/module/roles/constants';
import { multerOptions } from 'src/common/options/upload-file.option';
import { Acl } from 'src/decorators/acl.decorator';
import { AclGuard } from 'src/guards/acl.guard';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { AdminService } from 'src/module/admin/services/admin.service';
import { CreateUserDto } from 'src/module/user/dto/create-user.dto';
import { QueryUsersDto } from 'src/module/user/dto/query-users.dto';
import { ResponseUserDto } from 'src/module/user/dto/response-user.dto';
import { UserService } from 'src/module/user/services/user.service';
import { unlink } from 'fs/promises';
import * as path from 'path';
import { UpdateAccountDto } from 'src/module/admin/dto/update-account.dto';
import { v4 as uuidv4 } from 'uuid';

@Controller('admin/accounts')
@UseGuards(JwtAuthGuard, AclGuard)
@ApiTags('Admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @Acl(RoleType.admin)
  @ApiBearerAuth()
  @ApiResponse({ type: ResponseUserDto })
  @UseInterceptors(
    FileInterceptor(
      'avatar',
      multerOptions('avatar', (req: Request, file, cb) => {
        ///put body in client in order as first
        const user = req.body;
        cb(null, user.email + path.extname(file.originalname));
      }),
    ),
  )
  async createAccount(
    @Body() createAccount: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseUserDto> {
    try {
      if (file) {
        Object.assign(createAccount, {
          avatar: file.filename,
        });
      }
      const user = await this.userService.createUser(createAccount);
      return user;
    } catch (e) {
      if (file) {
        await unlink(file.path);
      }

      throw e;
    }
  }

  @Put('/:userId')
  @Acl(RoleType.admin)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor(
      'avatar',
      multerOptions('avatar', async (req: Request, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
      }),
    ),
  )
  async updateUser(
    @Body() updateAccountDto: UpdateAccountDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') id: string,
  ) {
    try {
      if (file) {
        Object.assign(updateAccountDto, {
          avatar: file.filename,
        });
      }
      const user = await this.userService.findUserById(id);

      const updatedUser = await this.userService.updateProfile(
        user,
        updateAccountDto,
      );
      return updatedUser;
    } catch (err) {
      if (file) {
        await unlink(file.path);
      }
      throw err;
    }
  }

  @Get()
  @Acl(RoleType.admin)
  @ApiBearerAuth()
  @ApiResponse({ type: PaginationResult })
  async getUsers(@Query() query: QueryUsersDto) {
    const filter = pick(query, ['role', 'name', 'status', 'email']);
    const options = pick(query, ['sortBy', 'limit', 'page']);
    return await this.userService.getUsers(filter, options);
  }
}
