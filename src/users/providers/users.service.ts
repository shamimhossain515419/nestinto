import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
  forwardRef,
} from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';

/**
 * Controller class for '/users' API endpoint
 */
@Injectable()
export class UsersService {
  constructor(
    /**
     * Injecting User repository into UsersService
     * */
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    // Injecting Auth Service
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    // injecting config service
    private readonly configService: ConfigService,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    /**
     * Inject UsersCreateMany provider
     */
    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    // createUserProvider
    private readonly createUserProvider: CreateUserProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return await this.createUserProvider.CreateUser(createUserDto);
  }

  /**
   * Public method responsible for handling GET request for '/users' endpoint
   */
  public findAll() {
    const logIn = false;
    if (!logIn) {
      throw new HttpException(
        {
          status: HttpStatus.MOVED_PERMANENTLY,
          error: 'Unauthorized',
          fileName: 'User.services.log',
        },
        HttpStatus.MOVED_PERMANENTLY,
        {
          cause: new Error(),
          description: 'User not found',
        },
      );
    }
  }

  /**
   * Public method used to find one user using the ID of the user
   */
  public async findOneById(id: number) {
    // Handle exceptions if user does not exist later
    console.log(this.profileConfiguration);
    console.log(this.profileConfiguration.apiKey);
    return await this.usersRepository.findOneBy({
      id,
    });
  }

  public async createMany(
    CreateManyUsersDto: CreateManyUsersDto,
  ): Promise<User[]> {
    return await this.usersCreateManyProvider.createMany(CreateManyUsersDto);
  }
}
