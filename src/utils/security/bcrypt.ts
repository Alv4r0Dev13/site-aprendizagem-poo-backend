import * as bcrypt from 'bcrypt';

export abstract class BCrypt {
  static encryptPassword(object: any) {
    object.password = bcrypt.hashSync(
      object.password,
      Number(process.env.BCRYPT_SALT),
    );
    return object;
  }

  static verifyPassword(password: string, passwordEncrypted: string) {
    return bcrypt.compareSync(password, passwordEncrypted);
  }
}
