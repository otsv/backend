import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { pick } from 'lodash';
import { PaginationResult } from 'src/common/constant/pagination.dto';
import { Role } from 'src/common/constant/roles';
import { Acl } from 'src/decorator/acl.decorator';
import { AclGuard } from 'src/guards/acl.guard';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { QueryOrderDto } from 'src/module/order/dto/query-order.dto';
import { User } from 'src/module/user/entities/user.entity';
import { UserService } from 'src/module/user/user.service';
import { CreateOrderDto } from '../module/order/dto/create-order.dto';
import { UpdateOrderDto } from '../module/order/dto/update-order.dto';
import { Order } from '../module/order/entities/order.entity';
import { OrderService } from '../module/order/order.service';

@Controller('orders')
@UseGuards(JwtAuthGuard, AclGuard)
@ApiTags('Order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @Acl(Role.Employee)
  @ApiResponse({ type: Order })
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request: Request,
  ): Promise<Order> {
    const user = request.user as User;
    return this.orderService.create(createOrderDto, user);
  }

  @Get('/me')
  @ApiBearerAuth()
  @Acl(Role.Employee)
  @ApiResponse({ type: PaginationResult })
  async getMyOrder(@Query() query: QueryOrderDto, @Req() request: Request) {
    const filter = pick(query, ['status']);
    const options = pick(query, ['sortBy', 'limit', 'page']);
    const user = request.user as any;
    return await this.orderService.queryOrders(
      { ...filter, userId: user.id },
      options,
    );
  }

  @Get()
  @ApiBearerAuth()
  @Acl(Role.VendorStaff)
  @ApiResponse({ type: PaginationResult })
  async getOrder(@Query() query: QueryOrderDto) {
    const filter = pick(query, ['status', 'email']);
    const options = pick(query, ['sortBy', 'limit', 'page']);
    let userId;
    if (filter.email) {
      userId = await this.userService.findUserByEmail(filter.email);
      delete filter.email;
      Object.assign(filter, { userId });
    }
    return await this.orderService.queryOrders(filter, options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
