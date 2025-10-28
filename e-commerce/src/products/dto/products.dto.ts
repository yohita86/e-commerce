import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsNumber,
  Min,
  IsUrl,
  IsEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Categories } from '../../categories/entities/categories.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @MinLength(10, {
    message: 'La descripción debe tener al menos 10 caracteres',
  })
  description: string;

  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;

  @IsNumber()
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @IsUrl()
  @IsOptional()
  imgUrl?: string;

  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  category: Categories;
}

export class UpdateProductDto {
  @ApiProperty({
    description: 'Nombre del producto (no modificable)',
    example: 'Producto Original',
    readOnly: true,
  })
  @IsEmpty({ message: 'El nombre no se puede modificar' })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción del producto',
    example: 'Descripción actualizada del producto',
    minLength: 10,
  })
  @IsString()
  @IsOptional()
  @MinLength(10, {
    message: 'La descripción debe tener al menos 10 caracteres',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Precio del producto',
    example: 29.99,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'El precio no puede ser negativo' })
  price?: number;

  @ApiPropertyOptional({
    description: 'Stock disponible del producto',
    example: 50,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock?: number;

  @ApiPropertyOptional({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/product-image.jpg',
  })
  @IsUrl()
  @IsOptional()
  imgUrl?: string;

  @ApiProperty({
    description: 'Categoría del producto (no modificable)',
    example: { id: 'uuid-category', name: 'Electrónicos' },
    readOnly: true,
  })
  @IsEmpty({ message: 'La categoría no se puede modificar' })
  category: Categories;
}
