import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  /**
   * Debe ser un email de formato válido
   * @example 'Testuser03@test.com'
   */
  @ApiProperty({
    example: 'Testuser03@test.com',
    description: 'Debe ser un email de formato válido',
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'El email es requerido' })
  @MaxLength(50, { message: 'El email no puede ser mayor a 50 caracteres' })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email: string;

  /**
   * Debe contener una minúscula, una mayúscula y un carater especial, de entre 8 y 15 caracteres
   * @example 'aaBB33##'
   */
  @ApiProperty({
    example: 'aaBB33##',
    description:
      'Debe contener una minúscula, una mayúscula y un caracter especial, de entre 8 y 15 caracteres',
    minLength: 8,
    maxLength: 15,
  })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(15, {
    message: 'La contraseña debe tener al menos 8 caracteres.',
  })
  password: string;
}
