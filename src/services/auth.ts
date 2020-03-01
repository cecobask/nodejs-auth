import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import 'dotenv/config';

import UserModel from '../models/user';

import * as jwt from 'jsonwebtoken'

export default class AuthService {
  constructor(){}

  public async Login(email, password): Promise<any> {
    const userRecord = await UserModel.findOne({ email });
    if (!userRecord) {
      throw new Error('User not found')
    } else {
      const correctPassword = await argon2.verify(userRecord.password, password);
      if (!correctPassword) {
        throw new Error('Incorrect password')
      }
    }

    return {
      user: {
        email: userRecord.email,
        name: userRecord.name,
      },
      token: this.generateJWT(userRecord),
    }
  }

  public async LoginAs(email): Promise<any> {
    const userRecord = await UserModel.findOne({ email });
    if (!userRecord) {
      throw new Error('User not found');
    }
    return {
      user: {
        email: userRecord.email,
        name: userRecord.name,
      },
      token: this.generateJWT(userRecord),
    }
  }

  public async SignUp(email, password, name): Promise<any> {
    const salt = randomBytes(32);
    const passwordHashed = await argon2.hash(password, { salt });

    const userRecord = await UserModel.create({
      password: passwordHashed,
      email,
      salt: salt.toString('hex'),
      name,
    });
    const token = this.generateJWT(userRecord);
    return {
      user: {
        email: userRecord.email,
        name: userRecord.name,
      },
      token,
    }

  }

  // noinspection JSMethodCanBeStatic
  private generateJWT(user) {

    return jwt.sign({
      data: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    }, process.env.JWTSECRET, { expiresIn: '6h' });
  }

}
