import {
  IsNotEmpty,
  IsUUID,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Products } from 'src/products/entities/products.entity';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'El userId es requerido' })
  @IsUUID(4, { message: 'El userId debe ser un UUID válido' })
  userId: string;

  @IsArray({ message: 'Products debe ser un array' })
  @ArrayMinSize(1, { message: 'Products debe contener al menos un elemento' })
  @ValidateNested({ each: true })
  @Type(() => Object)
  products: Partial<Products>[];
}
