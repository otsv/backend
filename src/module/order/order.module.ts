import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemManager } from './entities/order-item-management';

@Module({
  imports: [
    UserModule,
    ProductModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: OrderItem,
        schemaOptions: {
          timestamps: true,
        },
      },
      {
        typegooseClass: OrderItemManager,
        schemaOptions: {
          timestamps: true,
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
