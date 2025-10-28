import { BadRequestException, Injectable } from '@nestjs/common';
import { Users } from 'src/users/entities/users.entity';
import { UsersRepository } from 'src/users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  getAuth() {
    return 'Autenticación';
  }

  //*Login
  async signIn(email: string, password: string) {
    //*Verificamos que exista:
    const foundUser = await this.usersRepository.getUserByEmail(email);
    if (!foundUser) throw new BadRequestException('Credenciales incorrectas');

    //*Validamos contraseña => Con Hash:
    const validPassword = await bcrypt.compare(password, foundUser.password);
    if (!validPassword)
      throw new BadRequestException('Credenciales incorrectas');

    //Generamos token
    const payload = {
      id: foundUser.id,
      email: foundUser.email,
      isAdmin: foundUser.isAdmin,
    };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Usuario logueado',
      token,
    };
  }

  //*Registro
  async signUp(user: Partial<Users>) {
    const { email, password } = user;

    //*Verificamos que no exista:
    if (!email || !password)
      throw new BadRequestException('Se necesita email y password');
    const foundUser = await this.usersRepository.getUserByEmail(email);
    if (foundUser) throw new BadRequestException('Email ya registrado');

    //* Hasheamos la contraseña:
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword)
      throw new BadRequestException('Error al hashear la contraseña');

    const newUser = await this.usersRepository.addUser({
      ...user,
      password: hashedPassword,
    });

    const safeUser: any = { ...newUser };
    delete safeUser.password;
    delete safeUser.confirmPassword;

    return safeUser;
  }
}
