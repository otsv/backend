import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { OrderService } from '../module/order/order.service';
import { CreateOrderDto } from '../module/order/dto/create-order.dto';
import { UpdateOrderDto } from '../module/order/dto/update-order.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { PermissionsGuard } from 'src/guards/permission.guard';
import { RequiredPermissions } from 'src/decorator/roles.decorator';
import { RolePermission } from 'src/common/constant/roles';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Order } from '../module/order/entities/order.entity';
import { User } from 'src/module/user/entities/user.entity';
import { PaginationResult } from 'src/common/constant/pagination.dto';
import { QueryOrderDto } from 'src/module/order/dto/query-order.dto';
import { pick } from 'lodash';
import { UserService } from 'src/module/user/user.service';

@Controller('order')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @RequiredPermissions(RolePermission.placeOrder)
  @ApiResponse({ type: Order })
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request: Request,
  ): Promise<Order> {
    const user = request.user as User;
    return this.orderService.create(createOrderDto, user);
  }

  @Get('/my-orders')
  @ApiBearerAuth()
  @RequiredPermissions(RolePermission.placeOrder)
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
  @RequiredPermissions(RolePermission.manageOrders)
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
