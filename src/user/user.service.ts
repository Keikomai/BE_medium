import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUSerDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto.';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUSerDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {},
    };
    const userByEmail = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    const userByUserName = await this.userRepository.findOne({
      where: {
        username: createUserDto.username,
      },
    });

    if (userByEmail) {
      errorResponse.errors['email'] = 'Email has been taken';
    }
    if (userByUserName) {
      errorResponse.errors['username'] = 'Username has been taken';
    }
    if (userByEmail || userByUserName) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const newUser = new UserEntity();

    Object.assign(newUser, createUserDto);

    return await this.userRepository.save(newUser);
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {},
    };

    const userByEmail = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
      select: ['bio', 'email', 'image', 'password', 'username', 'id'],
    });

    if (!userByEmail) {
      errorResponse.errors['email'] = 'Email is not exist';
    }

    if (!userByEmail) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      userByEmail.password,
    );

    if (!isPasswordCorrect) {
      errorResponse.errors['credentials'] = 'Credentials is not correct';
    }

    if (!isPasswordCorrect) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    delete userByEmail.password;

    return userByEmail;
  }

  async updateUser(
    updateUserDto: UpdateUserDto,
    currentUserId: UserEntity['id'],
  ): Promise<UserEntity> {
    const userById = await this.findById(currentUserId);

    if (!userById) {
      throw new HttpException(
        'Email is not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    Object.assign(userById, updateUserDto);

    return await this.userRepository.save(userById);
  }

  findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
