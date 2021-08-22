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
import { PermissionsGuard } from 'src/guards/permission.guard';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorator/public.decorator';
import { RequiredPermissions } from 'src/decorator/roles.decorator';
import { RolePermission } from 'src/common/constant/roles';
import { Category } from 'src/module/product/category/entities/category.entity';
import { CreateCategoryDto } from 'src/module/product/category/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/module/product/category/dto/update-category.dto';
import { CategoryService } from 'src/module/product/category/category.service';

@Controller('category')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @RequiredPermissions(RolePermission.manageOrders)
  @ApiBearerAuth()
  @ApiResponse({ type: Category })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @Public()
  @ApiResponse({ type: [Category] })
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @RequiredPermissions(RolePermission.manageOrders)
  @ApiBearerAuth()
  @ApiResponse({ type: Category })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @RequiredPermissions(RolePermission.manageOrders)
  @ApiBearerAuth()
  @ApiResponse({ type: Category })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
