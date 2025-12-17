import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { UserClient } from './entities/user.entity';
import { CreateUserDto } from '../auth/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Permet de valider un utilisateur avec son mot de passe.
   *
   * @param email
   * @param password
   * @return les données de l'utilisateur si le mot de passe correspond, sinon null
   */
  async validateUser(email: string, password: string): Promise<UserClient | null> {
    const userPlain = await this.databaseService.user.findUnique({
      where: { email },
      include: {
        member: true,
      },
    });

    if (!userPlain) return null;

    const isPasswordValid = await bcrypt.compare(password, userPlain.password);
    if (!isPasswordValid) return null;

    return new UserClient(userPlain);
  }

  /**
   * Cette fonction permet de créer un nouvel utilisateur.
   *
   * @return l'utilisateur créé
   */
  async create(createUser: CreateUserDto): Promise<UserClient> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUser.password, saltRounds);

    const userPlain = await this.databaseService.user.create({
      data: {
        ...createUser,
        password: hashedPassword,
      },
    });

    return new UserClient(userPlain);
  }

  /**
   * Permet de trouver tous les users
   *
   * @return un tableau de users.
   */
  async findAll(): Promise<UserClient[]> {
    const usersPlain = await this.databaseService.user.findMany();

    return usersPlain.map((userPlain) => new UserClient(userPlain));
  }

  /**
   * Permet de trouver un user sur base de son id.
   *
   * @param id
   * @return l'utilisateur ou null si absent
   */
  async findOne(id: number): Promise<UserClient | null> {
    const userPlain = await this.databaseService.user.findUnique({
      where: { id },
    });
    if (!userPlain) return null;
    return new UserClient(userPlain);
  }

  /**
   * Permet de supprimer un utilisateur.
   *
   * @param id
   */
  async remove(id: number) : Promise<UserClient | null> {
    const plainUser = await this.databaseService.user.delete({ where: { id } });
    if (!plainUser) return null;
    const { password, ...safeUser } = plainUser;
    return new UserClient(safeUser);
  }
}
