import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User } from '../admin/entites/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseResponseDto } from 'src/helper/base-response.dto';
import { message } from 'src/constant/message';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(body: LoginDto): Promise<BaseResponseDto> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: body.email,
        },
      });
      if (!user) {
        throw new HttpException(message.INVALID_CRED, HttpStatus.UNAUTHORIZED);
      }
      if (!user.email_verify) {
        throw new HttpException(message.VERIFY_EMAIL, HttpStatus.BAD_REQUEST);
      }
      const password = await bcrypt.compare(body?.password, user.password);
      if (!user || !password) {
        throw new HttpException(message.INVALID_CRED, HttpStatus.UNAUTHORIZED);
      }
      const access_token = await this.jwtService.sign(
        {
          id: user.id,
          email: user.email,
        },
        { secret: process.env.SECRET },
      );

      return {
        statusCode: HttpStatus.ACCEPTED,
        message: message.SUCCESS,
        access_token,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async activateAccount(activation_key: string): Promise<BaseResponseDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { activation_key, email_verify: false },
      });
      if (!user) {
        throw new HttpException(message.NOT_FOUND, HttpStatus.BAD_REQUEST);
      }
      await this.userRepository.update(
        { activation_key },
        { email_verify: true, is_active: true, activation_key: null },
      );
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: message.ACCOUNT_ACTIVATE,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
