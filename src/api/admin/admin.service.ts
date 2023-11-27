import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseResponseDto } from 'src/helper/base-response.dto';
import { message } from 'src/constant/message';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/helper/email-helper.service';
import * as ejs from 'ejs';
import * as path from 'path';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async createUser(body: CreateUserDto): Promise<BaseResponseDto> {
    try {
      const isExits = await this.userRepository.count({
        where: [
          {
            email: body.email.trim(),
          },
          {
            phone: body.phone.trim(),
          },
        ],
      });

      if (isExits != 0) {
        throw new HttpException(message.USER_EXITS, HttpStatus.BAD_REQUEST);
      }

      const user = new User();
      user.first_name = body.first_name;
      user.last_name = body.last_name;
      user.email = body.email.trim();
      user.phone = body.phone ? body.phone.trim() : null;
      const password = `${await this.randomPassword()}@2022`;
      user.password = await this.passwordHash(password);
      user.activation_key = await this.jwtService.sign(
        {},
        { secret: process.env.SECRET },
      );

      const url = `${process.env.URL}/verify/${user.activation_key}`;
      const ejsTemplate = await ejs.renderFile(
        path.join(__dirname, '../../../src/email-templates/account-verify.ejs'),
        { data: user, password, url },
        { sync: true },
      );
      await this.emailService.sendEmail(
        user.email,
        'Your credential',
        ejsTemplate,
      );

      const data = await this.userRepository.save({
        ...user,
        role: { id: body.role },
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: message.USER_CREATED,
        data,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async randomPassword(): Promise<string> {
    const string = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
    ];
    let password = '';
    for (let i = 0; i < 7; i++) {
      const randInt = Math.floor(Math.random() * string.length);
      password += string[randInt];
    }
    return password;
  }

  async passwordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND));
    return await bcrypt.hash(password.trim(), salt);
  }
}
