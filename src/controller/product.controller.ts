import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from '../module/product/product.service';
import { CreateProductDto } from '../module/product/dto/create-product.dto';
import { UpdateProductDto } from '../module/product/dto/update-product.dto';
import { pick } from 'lodash';
import { QueryProductsDto } from '../module/product/dto/query-product.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { PermissionsGuard } from 'src/guards/permission.guard';
import { RequiredPermissions } from 'src/decorator/roles.decorator';
import { RolePermission } from 'src/common/constant/roles';
import { Public } from 'src/decorator/public.decorator';

@Controller('product')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @RequiredPermissions(RolePermission.manageOrders)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @Public()
  async findAll(@Query() query: QueryProductsDto) {
    const filter = pick(query, ['name', 'price']);
    const options = pick(query, ['sortBy', 'limit', 'page']);

    return await this.productService.queryProducts(filter, options);
  }

  @Get(':id')
  @RequiredPermissions(RolePermission.manageOrders)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @RequiredPermissions(RolePermission.manageOrders)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @RequiredPermissions(RolePermission.manageOrders)
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
