import {
  IsBoolean,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { Orders } from 'src/orders/entities/orders.entity';
import { PartialType } from '@nestjs/mapped-types';
import { MatchPassword } from 'src/decorators/matchPassword.decorator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiHideProperty()
  id?: string;
  @ApiHideProperty()
  orders?: Orders[];

  /**
   * Debe ser un string de entre 3 y 50 caracteres
   * @example 'Test User 01'
   */
  @ApiProperty({
    example: 'Test User 01',
    description: 'Debe ser un string de entre 3 y 50 caracteres',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  /**
   * Debe ser un email de formato válido
   * @example 'Testuser01@test.com'
   */
  @ApiProperty({
    example: 'Testuser01@test.com',
    description: 'Debe ser un email de formato válido',
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'Email es obligatorio' })
  @MaxLength(50)
  @IsEmail()
  email: string;

  /**
   * Debe contener una minúscula, una mayúscula y un carater especial, de entre 8 y 15 caracteres
   * @example 'aaBB11##'
   */
  @ApiProperty({
    example: 'aaBB11##',
    description:
      'Debe contener una minúscula, una mayúscula y un caracter especial, de entre 8 y 15 caracteres',
    minLength: 8,
    maxLength: 15,
  })
  @IsNotEmpty({ message: 'Password es obligatorio' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @Matches(/.*[a-z].*/, {
    message: 'La contraseña debe contener al menos una letra minúscula.',
  })
  @Matches(/.*[A-Z].*/, {
    message: 'La contraseña debe contener al menos una letra mayúscula.',
  })
  @Matches(/.*[0-9].*/, {
    message: 'La contraseña debe contener al menos un número.',
  })
  @Matches(/.*[!@#$%^&*].*/, {
    message: 'La contraseña debe contener al menos un símbolo (como !@#$%^&*).',
  })
  @MinLength(8)
  @MaxLength(15)
  password: string;

  /**
   * Debe ser igual al password
   * @example 'aaBB11##'
   */
  @ApiProperty({
    example: 'aaBB11##',
    description: 'Debe ser igual al password',
    minLength: 8,
    maxLength: 15,
  })
  @IsNotEmpty()
  @Validate(MatchPassword, ['password'])
  confirmPassword: string;

  /**
   * Debe tener entre 3 y 88 caracteres
   * @example 'Test Street 123'
   */
  @ApiProperty({
    example: 'Test Street 123',
    description: 'Debe tener entre 3 y 88 caracteres',
    minLength: 3,
    maxLength: 80,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  address: string;

  /**
   * Debe contener numeros
   * @example '1234567890'
   */
  @ApiProperty({
    example: 1234567890,
    description: 'Debe contener números',
  })
  @IsNotEmpty()
  @IsNumber()
  phone: number;

  /**
   * Debe tener entre 5 y 20 caracteres
   * @example 'Test Country'
   */
  @ApiProperty({
    example: 'Test Country',
    description: 'Debe tener entre 5 y 20 caracteres',
    minLength: 5,
    maxLength: 20,
  })
  @MinLength(5)
  @MaxLength(20)
  country: string;

  /**
   * Debe tener entre 5 y 20 caracteres
   * @example 'Test City'
   */
  @ApiProperty({
    example: 'Test City',
    description: 'Debe tener entre 5 y 20 caracteres',
    minLength: 5,
    maxLength: 20,
  })
  @MinLength(5)
  @MaxLength(20)
  city: string;

  @ApiHideProperty()
  @IsEmpty()
  isAdmin: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: number;
  country: string;
  city: string;
  isAdmin: boolean;
}
