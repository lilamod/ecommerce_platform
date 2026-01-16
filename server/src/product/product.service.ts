import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from 'src/dto/create-product.dto';
import { UpdateProductDto } from 'src/dto/update-product.dto';
import { Product } from 'src/schema/product.schema';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async getAllProducts(page: number = 1, limit: number = 10): Promise<Product[]> {
    const skip = (page - 1) * limit;
    return this.productModel.find().skip(skip).limit(limit).exec();
  }

  async getProductById(id: string): Promise<Product> {
    return this.productModel.findById(id).exec();
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
  }

  async deleteProduct(id: string): Promise<any> {
    return this.productModel.findByIdAndDelete(id).exec();
  }
}