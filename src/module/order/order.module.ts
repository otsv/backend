import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from '../../controller/order.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Order } from './entities/order.entity';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    UserModule,
    ProductModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: Order,
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
