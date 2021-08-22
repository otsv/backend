import { Injectable } from '@nestjs/common';
import { mongoose, ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { OrderState } from 'src/common/constant/order-status';
import { PaginationOption } from 'src/common/constant/pagination.dto';
import { ProductService } from '../product/product.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemDto } from './dto/order-item.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private readonly orderDoc: ReturnModelType<typeof Order>,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const items = await Promise.all(
      createOrderDto.items.map(async (item: OrderItemDto) => {
        const product = await this.productService.findOne(item.productId);
        return {
          quantity: item.quantity,
          product: mongoose.Types.ObjectId(product.id),
        };
      }),
    );
    const createdOrder = await this.orderDoc.create({
      items,
      userId: user.id,
      notes: createOrderDto.notes,
      status: OrderState.open,
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
    const orders = await this.orderDoc.paginate(filter, options);
    return orders;
  }

  findOne(id: string) {
    return `This action returns a #${id} order`;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
