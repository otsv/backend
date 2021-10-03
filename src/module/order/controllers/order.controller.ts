import {
  BadRequestException,
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
import { assign, pick } from 'lodash';
import { PaginationResult } from 'src/module/shared/dtos/pagination.dto';
import { RoleType } from 'src/module/roles/constants';
import { Acl } from 'src/decorators/acl.decorator';
import { AclGuard } from 'src/guards/acl.guard';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { CreateOrderItemDto } from 'src/module/order/dto/order-item/create-order-item.dto';
import { QueryOrderItem } from 'src/module/order/dto/order-item/query-order-item.dto';
import { UpdateOrderItemDto } from 'src/module/order/dto/order-item/update-order-item.dto';
import { OrderItem } from 'src/module/order/entities/order-item.entity';

import { User, UserDoc } from 'src/module/user/entities/user.entity';
import { UserService } from 'src/module/user/services/user.service';
import { OrderService } from '../services/order.service';

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
  @Acl(RoleType.employee)
  @ApiResponse({ type: OrderItem })
  create(
    @Body() createOrderDto: CreateOrderItemDto,
    @Req() request: Request,
  ): Promise<OrderItem> {
    const user = request.user as User;
    return this.orderService.create(createOrderDto, user);
  }

  @Get('/me')
  @ApiBearerAuth()
  @Acl(RoleType.employee)
  @ApiResponse({ type: PaginationResult })
  async getMyOrder(@Query() query: QueryOrderItem, @Req() request: Request) {
    const filter = pick(query, ['status']) as { [k: string]: any };
    const options = pick(query, ['sortBy', 'limit', 'page']);
    const user = request.user as UserDoc;
    if (query.fromDate) {
      filter.createdAt = { $gte: new Date(query.fromDate) };
    }
    if (query.toDate) {
      filter.createdAt = assign(filter.createdAt || {}, {
        $lte: new Date(query.toDate),
      });
    }

    return await this.orderService.queryOrders(
      { ...filter, accountEmail: user.email },
      options,
    );
  }

  @Get()
  @ApiBearerAuth()
  @Acl(RoleType.vendor, RoleType.admin)
  @ApiResponse({ type: PaginationResult })
  async getOrder(@Query() query: QueryOrderItem) {
    const filter = pick(query, ['status', 'accountEmail']) as {
      [k: string]: any;
    };
    const options = pick(query, ['sortBy', 'limit', 'page']);
    if (query.fromDate) {
      filter.createdAt = { $gte: new Date(query.fromDate) };
    }
    if (query.toDate) {
      filter.createdAt = assign(filter.createdAt || {}, {
        $lte: new Date(query.toDate),
      });
    }

    return await this.orderService.queryOrders(filter, options);
  }

  @Get(':id')
  @ApiBearerAuth()
  @Acl(RoleType.vendor, RoleType.admin)
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(id);
  }

  @Patch('/status/:id')
  @ApiBearerAuth()
  @Acl(RoleType.vendor, RoleType.admin)
  updateStatusOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderItemDto,
  ) {
    const newstatus = updateOrderDto.status;
    if (!newstatus) {
      throw new BadRequestException();
    }
    return this.orderService.updateStatus(id, newstatus);
  }

  @Patch('/me/:id')
  @ApiBearerAuth()
  @Acl(RoleType.employee)
  updateOrderMe(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderItemDto,
    @Req() request: Request,
  ) {
    const body = pick(updateOrderDto, ['quantity', 'note']);
    const user = request.user as UserDoc;
    return this.orderService.updateOrderMe(id, body, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
