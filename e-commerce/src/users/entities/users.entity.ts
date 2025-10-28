import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from '../../orders/entities/orders.entity';

@Entity({
  name: 'USERS',
})
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'int',
  })
  phone: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  country?: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  city?: string;

  @Column({
    default: false,
  })
  isAdmin: boolean;

  @OneToMany(() => Orders, (order) => order.user)
  @JoinColumn({ name: 'order_id' })
  orders: Orders[];
}
