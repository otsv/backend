import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { pick } from 'lodash';
import { PaginationResult } from 'src/common/constant/pagination.dto';
import { RoleEnum } from 'src/common/constant/roles';
import { multerOptions } from 'src/common/constant/upload-file.option';
import { Acl } from 'src/decorator/acl.decorator';
import { Public } from 'src/decorator/public.decorator';
import { AclGuard } from 'src/guards/acl.guard';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { Product } from 'src/module/product/entities/product.entity';
import { CreateProductDto } from '../module/product/dto/create-product.dto';
import { QueryProductsDto } from '../module/product/dto/query-product.dto';
import { UpdateProductDto } from '../module/product/dto/update-product.dto';
import { ProductService } from '../module/product/product.service';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Request } from 'express';
import { maxImagesUploadCount } from 'src/common/constant/constant';
import { UserDoc } from 'src/module/user/entities/user.entity';
import { unlink } from 'fs/promises';

@Controller('products')
@UseGuards(JwtAuthGuard, AclGuard)
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Acl(RoleEnum.vendor, RoleEnum.admin)
  @ApiBearerAuth()
  @ApiResponse({ type: Product })
  @UseInterceptors(
    FilesInterceptor(
      'images',
      maxImagesUploadCount,
      multerOptions('drink', async (req: Request, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
      }),
    ),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() request: Request,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<Product> {
    try {
      const user = request.user as UserDoc;
      if (files) {
        Object.assign(createProductDto, {
          images: files.map<string>((file) => file.filename),
        });
      }
      const createdProduct = await this.productService.create(
        createProductDto,
        user,
      );
      return createdProduct;
    } catch (err) {
      if (files) {
        for (const file of files) {
          await unlink(file.path);
        }
      }
      throw err;
    }
  }

  @Put(':productId')
  @Acl(RoleEnum.vendor, RoleEnum.admin)
  @ApiBearerAuth()
  @ApiResponse({ type: Product })
  @UseInterceptors(
    FilesInterceptor(
      'images',
      maxImagesUploadCount,
      multerOptions('drink', async (req: Request, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
      }),
    ),
  )
  async update(
    @Body() updateProductDto: UpdateProductDto,
    @Req() request: Request,
    @Param('productId') productId: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<Product> {
    try {
      const user = request.user as UserDoc;
      if (files && files.length > 0) {
        Object.assign(updateProductDto, {
          images: files.map<string>((file) => file.filename),
        });
      }

      const createdProduct = await this.productService.update(
        productId,
        updateProductDto,
        user,
      );
      return createdProduct;
    } catch (err) {
      if (files) {
        for (const file of files) {
          await unlink(file.path);
        }
      }
      throw err;
    }
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

  @Delete(':id')
  @Acl(RoleEnum.vendor)
  @ApiBearerAuth()
  @ApiResponse({ type: Product })
  remove(@Param('id') id: string): Promise<Product> {
    return this.productService.remove(id);
  }
}
