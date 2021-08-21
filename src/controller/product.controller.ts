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
import { Product } from 'src/module/product/entities/product.entity';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationResult } from 'src/common/constant/pagination.dto';

@Controller('product')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @RequiredPermissions(RolePermission.manageOrders)
  @ApiBearerAuth()
  @ApiResponse({ type: Product })
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get()
  @Public()
  @ApiResponse({ type: PaginationResult })
  async findAll(@Query() query: QueryProductsDto) {
    const filter = pick(query, ['name', 'price', 'type']);
    const options = pick(query, ['sortBy', 'limit', 'page']);

    return await this.productService.queryProducts(filter, options);
  }

  @Get(':id')
  @Public()
  @ApiResponse({ type: Product })
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @RequiredPermissions(RolePermission.manageOrders)
  @ApiBearerAuth()
  @ApiResponse({ type: Product })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @RequiredPermissions(RolePermission.manageOrders)
  @ApiBearerAuth()
  @ApiResponse({ type: Product })
  remove(@Param('id') id: string): Promise<Product> {
    return this.productService.remove(id);
  }
}
