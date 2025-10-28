import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Products } from './entities/products.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  getProducts(page: number, limit: number) {
    return this.productsRepository.getProducts(page, limit);
  }

  getProductById(id: string) {
    return this.productsRepository.getProductById(id);
  }

  addProducts() {
    return this.productsRepository.addProducts();
  }

  updateProduct(id: string, product: Partial<Products>) {
    return this.productsRepository.updateProduct(id, product as Products);
  }
}
