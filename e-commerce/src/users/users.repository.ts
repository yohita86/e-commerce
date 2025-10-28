import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { Users } from './entities/users.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async getUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const users = await this.usersRepository.find({
      take: limit,
      skip: skip,
    });

    return users.map(({ password, ...userNoPassword }) => userNoPassword);
  }

  async getUserById(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        orders: true,
      },
    });
    if (!user) return 'No se encontró el usuario con ese id ${id}';
    const { password, ...userNoPassword } = user;
    return userNoPassword;
  }

  async addUser(user: Partial<Users>) {
    const newUser = await this.usersRepository.save(user);
    const dbUser = await this.usersRepository.findOneBy({
      id: newUser.id,
    });
    if (!dbUser)
      throw new Error('No se encontró el usuario con ese id ${newUserid}');

    const { password, ...userNoPassword } = newUser;
    return userNoPassword;
  }

  async updateUser(id: string, user: UpdateUserDto) {
    await this.usersRepository.update(id, user);
    const updatedUser = await this.usersRepository.findOneBy({ id });
    if (!updatedUser)
      throw new Error('No se encontró el usuario con ese id ${id}');
    const { password, ...userNoPassword } = updatedUser;
    return userNoPassword;
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new Error('No se encontró el usuario con ese id ${id}');
    this.usersRepository.remove(user);
    const { password, ...userNoPassword } = user;
    return userNoPassword;
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }
}
