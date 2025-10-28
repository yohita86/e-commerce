import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../users/entities/users.entity';
import { OrderDetails } from './orderdetails.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'ORDERS',
})
export class Orders {
  @ApiProperty({
    description: 'uuid v4 generado por la BBDD',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Fecha en formato dd/mm/yyyy',
    example: '01/01/2022',
  })
  @Column()
  date: Date;

  @OneToOne(() => OrderDetails, (orderDetails) => orderDetails.order)
  orderDetails: OrderDetails;

  @ManyToOne(() => Users, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
