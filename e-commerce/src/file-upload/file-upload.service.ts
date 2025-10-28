import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './file-upload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/products/entities/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileUploadService {
  constructor(private readonly fileUploadRepository: FileUploadRepository) {}
  @InjectRepository(Products)
  private readonly productRepository: Repository<Products>;
  async uploadImage(file: Express.Multer.File, productId: string) {
    const product = await this.productRepository.findOneBy({
      id: productId,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const response = await this.fileUploadRepository.uploadImage(file);
    if (!response.secure_url) {
      throw new NotFoundException('Error al subir imagen en Cloudinary');
    }
    await this.productRepository.update(productId, {
      imgUrl: response.secure_url,
    });

    const updatedProduct = await this.productRepository.findOneBy({
      id: productId,
    });
    return updatedProduct;
  }
}
