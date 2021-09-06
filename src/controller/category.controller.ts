import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/constant/roles';
import { Acl } from 'src/decorator/acl.decorator';
import { Public } from 'src/decorator/public.decorator';
import { AclGuard } from 'src/guards/acl.guard';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { CategoryService } from 'src/module/product/category/category.service';
import { CreateCategoryDto } from 'src/module/product/category/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/module/product/category/dto/update-category.dto';
import { Category } from 'src/module/product/category/entities/category.entity';

@Controller('categories')
@UseGuards(JwtAuthGuard, AclGuard)
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Acl(Role.VendorStaff)
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
  @Acl(Role.VendorStaff)
  @ApiBearerAuth()
  @ApiResponse({ type: Category })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Acl(Role.VendorStaff)
  @ApiBearerAuth()
  @ApiResponse({ type: Category })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
