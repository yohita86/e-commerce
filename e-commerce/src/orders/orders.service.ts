import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  addOrder(userId: string, products: any) {
    return this.ordersRepository.addOrders(userId, products);
  }

  getOrder(id: string) {
    return this.ordersRepository.getOrder(id);
  }

  deleteOrder(id: string) {
    return this.ordersRepository.deleteOrder(id);
  }
}
