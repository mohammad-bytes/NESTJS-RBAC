import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User } from '../admin/entites/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseResponseDto } from 'src/helper/base-response.dto';
import { message } from 'src/constant/message';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as ejs from 'ejs';
import * as path from 'path';
import * as moment from 'moment';
import { EmailService } from 'src/helper/email-helper.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
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

  async forgotPassword(email): Promise<BaseResponseDto> {
    try {
      const userExits = await this.userRepository.findOne({ where: { email } });
      if (!userExits) {
        throw new NotFoundException(message.NOT_FOUND);
      }

      const token = await this.jwtService.sign(
        {},
        { secret: process.env.SECRET },
      );

      const resetPasswordLink = `${process.env.URL}/${token}`;

      const ejsTemplate = await ejs.renderFile(
        path.join(__dirname, '../../email-templates/forgot-password.ejs'),
        { data: userExits, url: resetPasswordLink },
        { sync: true },
      );

      await this.userRepository.update(
        {
          email,
        },
        {
          reset_password_token: token,
          reset_password_token_datetime: moment().add(10, 'minute').unix(),
        },
      );

      await this.emailService.sendEmail(email, 'Reset Password', ejsTemplate);

      return {
        statusCode: HttpStatus.ACCEPTED,
        message: message.FORGOT_PASS_LINK,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async passwordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND));
    return await bcrypt.hash(password.trim(), salt);
  }

  async resetPassword(token: string, password): Promise<BaseResponseDto> {
    try {
      const userExits = await this.userRepository.findOne({
        where: { reset_password_token: token },
      });
      if (!userExits) {
        throw new NotFoundException(message.INVALID_RESET_PASSWORD_LINK);
      }
      if (userExits.reset_password_token_datetime <= moment().unix()) {
        throw new BadRequestException(message.RESET_PASS_EXPIRE);
      }

      await this.userRepository.update(
        {
          email: userExits.email,
        },
        {
          reset_password_token: null,
          reset_password_token_datetime: null,
          password: await this.passwordHash(password),
        },
      );

      return {
        statusCode: HttpStatus.ACCEPTED,
        message: message.RESET_PASS,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
