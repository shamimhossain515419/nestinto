import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../user.entity';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    // Injecting UsersCreateManyService
    private dataSource: DataSource,
  ) {}

  public async createMany(
    CreateManyUsersDto: CreateManyUsersDto,
  ): Promise<User[]> {
    let newUsers: User[] = [];

    // Create Query Runner Instance
    const queryRunner = this.dataSource.createQueryRunner();

    // Connect the query runner to the data source
    await queryRunner.connect();

    // Start the transaction
    await queryRunner.startTransaction();

    try {
      for (let user of CreateManyUsersDto.users) {
        // Validate user data here (optional)
        let newUser = queryRunner.manager.create(User, user);
        let result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }

      // Commit transaction if all users are saved successfully
      await queryRunner.commitTransaction();
    } catch (error) {
      // Log the error if necessary for debugging
      console.error('Error saving users:', error.message);

      // Rollback the transaction on error
      await queryRunner.rollbackTransaction();

      // Throw meaningful HTTP exceptions
      if (error.code === '23505') {
        // PostgreSQL unique violation error code (if you're using PostgreSQL)
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Duplicate entry. One or more users already exist.',
          },
          HttpStatus.CONFLICT,
        );
      } else if (error) {
        // Replace with actual validation error type
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Validation failed for one or more users.',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        // For generic or unknown errors
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'An unexpected error occurred while creating users.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } finally {
      // Release the query runner after completing the transaction
      await queryRunner.release();
    }

    return newUsers;
  }
}
