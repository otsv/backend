import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductTypeService } from '../module/product-type/product-type.service';
import { CreateProductTypeDto } from '../module/product-type/dto/create-product-type.dto';
import { UpdateProductTypeDto } from '../module/product-type/dto/update-product-type.dto';
import { PermissionsGuard } from 'src/guards/permission.guard';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorator/public.decorator';
import { RequiredPermissions } from 'src/decorator/roles.decorator';
import { RolePermission } from 'src/common/constant/roles';
import { ProductType } from 'src/module/product-type/entities/product-type.entity';

@Controller('product-type')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags('product-type')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @Post()
  @RequiredPermissions(RolePermission.manageOrders)
  @ApiBearerAuth()
  @ApiResponse({ type: ProductType })
  create(@Body() createProductTypeDto: CreateProductTypeDto) {
    return this.productTypeService.create(createProductTypeDto);
  }

  @Get()
  @Public()
  @ApiResponse({ type: [ProductType] })
  findAll(): Promise<ProductType[]> {
    return this.productTypeService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productTypeService.findOne(id);
  }

  @Patch(':id')
  @RequiredPermissions(RolePermission.manageOrders)
  @ApiBearerAuth()
  @ApiResponse({ type: ProductType })
  update(
    @Param('id') id: string,
    @Body() updateProductTypeDto: UpdateProductTypeDto,
  ) {
    return this.productTypeService.update(id, updateProductTypeDto);
  }

  @Delete(':id')
  @RequiredPermissions(RolePermission.manageOrders)
  @ApiBearerAuth()
  @ApiResponse({ type: ProductType })
  remove(@Param('id') id: string) {
    return this.productTypeService.remove(id);
  }
}
