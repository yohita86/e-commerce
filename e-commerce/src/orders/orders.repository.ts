import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetails } from 'src/orders/entities/orderdetails.entity';
import { Orders } from 'src/orders/entities/orders.entity';
import { Repository } from 'typeorm';
import { Products } from 'src/products/entities/products.entity';
import { Users } from 'src/users/entities/users.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(OrderDetails)
    private ordersDetailsRepository: Repository<OrderDetails>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  async addOrders(userId: string, products: any) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      return `El usuario con id ${userId} no existe`;
    }

    const order = new Orders();
    order.date = new Date();
    order.user = user;

    const newOrder = await this.ordersRepository.save(order);

    const ProductsArray = await Promise.all(
      products.map(async (element: any) => {
        const product = await this.productsRepository.findOneBy({
          id: element.id,
        });
        if (!product) {
          throw new NotFoundException(
            `El producto con id ${element.id} no existe`,
          );
        }

        await this.productsRepository.update(
          { id: element.id },
          { stock: product.stock - 1 },
        );
        return product;
      }),
    );

    const total = ProductsArray.reduce(
      (sum, product) => sum + Number(product.price),
      0,
    );

    const orderDetail = new OrderDetails();

    orderDetail.price = Number(Number(total).toFixed(2));
    orderDetail.products = ProductsArray;
    orderDetail.order = newOrder;
    await this.ordersDetailsRepository.save(orderDetail);

    return await this.ordersRepository.find({
      where: { id: newOrder.id },
      relations: { orderDetails: true },
    });
  }

  async getOrder(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        orderDetails: {
          products: true,
        },
      },
    });

    if (!order) {
      return `Orden con id ${id} no existe`;
    }

    return order;
  }

  async deleteOrder(id: string) {
    const user = await this.ordersRepository.findOneBy({ id });
    if (!user) throw new Error('No se encontró el usuario con ese id ${id}');
    await this.ordersRepository.delete(user);
    return user;
  }
}
