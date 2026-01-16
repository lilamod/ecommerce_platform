import { Controller, Get, Post, Put, Delete, Body, Param, Res, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: "./uploads/products",
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() =>
          (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (extname(file.originalname) === ".jpg" || extname(file.originalname) === ".png" || extname(file.originalname) === ".jpeg") {
        cb(null, true);
      } else {
        cb(new HttpException("Only png/jpg/jpeg files are allowed", HttpStatus.NOT_ACCEPTABLE), false);
      }
    }
  }))
  async createProduct(@Body() createProductBody: CreateProductDto, @Res() response, @UploadedFile() image: Express.Multer.File) {
    try {
      createProductBody.image = image ? image.filename : null;
      createProductBody.created_by = response.req.user?.user_id || null;
      
      console.log(createProductBody)
      const product = await this.productService.createProduct(createProductBody);

      if (product) {
        return response.send({
          success: true,
          item: product
        });
      } else {
        return response.send({
          success: false,
          errors: [{
            code: "error.bad_request",
            param: "",
            message: "Bad request"
          }]
        });
      }
    } catch (err) {
      return response.status(400).send({
        success: false,
        errors: [{
          code: err.message || err,
          param: "",
          message: err.message || err
        }]
      });
    }
  }

  @Get()
  async getAllProducts(@Res() response, @Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    try {
      const products = await this.productService.getAllProducts(page, limit);
      return response.send({
        success: true,
        data: products
      });
    } catch (err) {
      return response.status(400).send({
        success: false,
        errors: [{
          code: err.message || err,
          param: "",
          message: err.message || err
        }]
      });
    }
  }

  @Get(':id')
  async getProductById(@Param('id') id: string, @Res() response) {
    try {
      const product = await this.productService.getProductById(id);
      if (product) {
        return response.send({
          success: true,
          data: product
        });
      } else {
        return response.status(404).send({
          success: false,
          errors: [{
            code: "error.not_found",
            param: "",
            message: "Product not found"
          }]
        });
      }
    } catch (err) {
      return response.status(400).send({
        success: false,
        errors: [{
          code: err.message || err,
          param: "",
          message: err.message || err
        }]
      });
    }
  }

  @Put('update/:id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: "./uploads/products",
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() =>
          (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (extname(file.originalname) === ".jpg" || extname(file.originalname) === ".png" || extname(file.originalname) === ".jpeg") {
        cb(null, true);
      } else {
        cb(new HttpException("Only png/jpg/jpeg files are allowed", HttpStatus.NOT_ACCEPTABLE), false);
      }
    }
  }))
  async updateProduct(@Param('id') id: string, @Body() updateProductBody: UpdateProductDto, @Res() response, @UploadedFile() image: Express.Multer.File) {
    try {
      if (image) {
        updateProductBody.image = image.filename;
      }
      updateProductBody.updated_by = response.req.user?.user_id || null;

      const product = await this.productService.updateProduct(id, updateProductBody);

      if (product) {
        return response.send({
          success: true,
          item: product
        });
      } else {
        return response.send({
          success: false,
          errors: [{
            code: "error.bad_request",
            param: "",
            message: "Bad request"
          }]
        });
      }
    } catch (err) {
      return response.status(400).send({
        success: false,
        errors: [{
          code: err.message || err,
          param: "",
          message: err.message || err
        }]
      });
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string, @Res() response) {
    try {
      const result = await this.productService.deleteProduct(id);
      if (result) {
        return response.send({
          success: true,
          message: "Product deleted successfully"
        });
      } else {
        return response.status(404).send({
          success: false,
          errors: [{
            code: "error.not_found",
            param: "",
            message: "Product not found"
          }]
        });
      }
    } catch (err) {
      return response.status(400).send({
        success: false,
        errors: [{
          code: err.message || err,
          param: "",
          message: err.message || err
        }]
      });
    }
  }
}