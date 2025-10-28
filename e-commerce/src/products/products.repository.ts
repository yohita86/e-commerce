import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories } from 'src/categories/entities/categories.entity';
import { Products } from 'src/products/entities/products.entity';
import data from 'src/utils/data.json';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async getProducts(page: number, limit: number): Promise<Products[]> {
    let products = await this.productsRepository.find({
      relations: {
        category: true,
      },
    });
    const start = (page - 1) * limit;
    const end = start + limit;
    products = products.slice(start, end);
    return products;
  }

  async getProduct(id: string) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      return 'No se encontró el producto con ese id';
    }
    return product;
  }

  async getProductById(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: {
        category: true,
      },
    });
    if (!product) {
      throw new Error('No se encontró el producto con ese id');
    }
    return product;
  }

  async addProducts() {
    const categories = await this.categoriesRepository.find();
    await Promise.all(
      data.map(async (element) => {
        const category = categories.find(
          (category) => category.name === element.category,
        );
        if (!category)
          throw new Error(`La categoría ${element.category} no existe`);
        const product = new Products();
        product.name = element.name;
        product.description = element.description;
        product.price = element.price;
        product.stock = element.stock;
        product.category = category;

        await this.productsRepository
          .createQueryBuilder()
          .insert()
          .into(Products)
          .values(product)
          .orUpdate(['description', 'price', 'imgUrl', 'stock'], ['name'])
          .execute();
      }),
    );
    return 'Productos agregados';
  }

  async addProduct(product: Partial<Products>) {
    const category = await this.categoriesRepository.findOneBy({
      id: product.category?.id,
    });
    if (!category) {
      throw new Error('La categoría especificada no existe');
    }

    const newProduct = this.productsRepository.create({
      ...product,
      category,
    });

    return await this.productsRepository.save(newProduct);
  }

  async updateProduct(id: string, product: Products) {
    await this.productsRepository.update(id, product);
    const updatedProduct = await this.productsRepository.findOneBy({
      id,
    });
    return updatedProduct;
  }

  async deleteProduct(id: string) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new Error('El producto no existe');
    }
    await this.productsRepository.delete(id);
    return `Producto con id ${id} eliminado correctamente`;
  }
}
