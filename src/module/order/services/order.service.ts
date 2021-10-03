import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { PaginationOption } from 'src/module/shared/dtos/pagination.dto';
import { ProductService } from '../../product/services/product.service';
import { User, UserDoc } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { CreateOrderItemDto } from '../dto/order-item/create-order-item.dto';
import { OrderItem } from '../entities/order-item.entity';
import { OrderItemManager } from '../entities/order-item-management';
import {
  OrderItemStatus,
  ProductStatus,
} from 'src/module/product/constants/product.constant';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(OrderItem)
    private readonly orderItemDoc: ReturnModelType<typeof OrderItem>,
    @InjectModel(OrderItemManager)
    private readonly orderManagerDoc: ReturnModelType<typeof OrderItemManager>,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  async create(
    createOrderDto: CreateOrderItemDto,
    user: User,
  ): Promise<OrderItem> {
    const product = await this.productService.findOne(createOrderDto.productId);
    if (product.status == ProductStatus.outOfStock) {
      throw new BadRequestException('product is out of stock');
    }
    const createdOrder = await this.orderItemDoc.create({
      product,
      accountEmail: user.email,
      createdBy: user.id,
      note: createOrderDto.note,
      quantity: createOrderDto.quantity,
    });

    return await createdOrder.save();
  }

  /**
   * Query for product
   * @param {Object} filter - Mongo filter
   * @param {Object} options - Query options
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  async queryOrders(filter, options: PaginationOption) {
    const orders = await this.orderItemDoc.paginate(filter, options);
    return orders;
  }

  async findOne(id: string) {
    try {
      const order = await this.orderItemDoc.findById(id);
      if (!order) {
        throw new NotFoundException('order not found');
      }
      return order;
    } catch (err) {
      throw new NotFoundException('order not found');
    }
  }

  async updateStatus(id: string, newState: OrderItemStatus) {
    const order = await this.orderItemDoc.findById(id);
    if (!order) {
      throw new NotFoundException('order not found');
    }
    if (
      order.status === OrderItemStatus.cancelled ||
      order.status === OrderItemStatus.pickedUp
    ) {
      throw new BadRequestException('Order has been cancelled or completed');
    }
    Object.assign(order, { status: newState });

    //once order done, save/update to manage collections
    if (newState === OrderItemStatus.pickedUp) {
      //yyyy-mm-dd
      const dateCreated = new Date().toISOString().slice(0, 10);
      await this.orderManagerDoc.findOneAndUpdate(
        {
          accountEmail: order.accountEmail,
          date: new Date(dateCreated),
        },
        {
          accountEmail: order.accountEmail,
          date: new Date(dateCreated),
          $push: { items: order },
          $inc: {
            totalItems: order.quantity,
            totalPrice: order.quantity * order.product.price,
          },
        },
        { upsert: true },
      );
    }

    return await order.save();
  }

  async updateOrderMe(id: string, body, user: UserDoc) {
    const order = await this.orderItemDoc.findById(id);
    if (!order || order.accountEmail != user.email) {
      throw new NotFoundException('order not found');
    }
    if (order.status != OrderItemStatus.new) {
      throw new BadRequestException('Order is not available to update');
    }

    Object.assign(order, body);

    return await order.save();
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
