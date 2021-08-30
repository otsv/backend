import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { pick } from 'lodash';
import { PaginationResult } from 'src/common/constant/pagination.dto';
import { Role } from 'src/common/constant/roles';
import { Acl } from 'src/decorator/acl.decorator';
import { Public } from 'src/decorator/public.decorator';
import { AclGuard } from 'src/guards/acl.guard';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { Product } from 'src/module/product/entities/product.entity';
import { CreateProductDto } from '../module/product/dto/create-product.dto';
import { QueryProductsDto } from '../module/product/dto/query-product.dto';
import { UpdateProductDto } from '../module/product/dto/update-product.dto';
import { ProductService } from '../module/product/product.service';

@Controller('products')
@UseGuards(JwtAuthGuard, AclGuard)
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Acl(Role.VendorStaff)
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
  @Acl(Role.VendorStaff)
  @ApiBearerAuth()
  @ApiResponse({ type: Product })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Acl(Role.VendorStaff)
  @ApiBearerAuth()
  @ApiResponse({ type: Product })
  remove(@Param('id') id: string): Promise<Product> {
    return this.productService.remove(id);
  }
}
