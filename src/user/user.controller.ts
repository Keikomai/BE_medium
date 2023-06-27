import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUSerDto } from './dto/createUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';

import { User } from './decorates/userDecorators';
import { UserEntity } from './user.entity';
import { AuthGuard } from './guards/auth.guards';
import { UpdateUserDto } from './dto/updateUser.dto.';
import { BackendValidationPipe } from '@app/shared/pipes/BackendValidation.pipe';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('users')
  @UsePipes(new BackendValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUSerDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);

    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new BackendValidationPipe())
  async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginUserDto);

    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateUser(
    @User('id') currentUserId: UserEntity['id'],
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(
      updateUserDto,
      currentUserId,
    );

    return this.userService.buildUserResponse(user);
  }
}
