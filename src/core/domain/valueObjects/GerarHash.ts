import crypto from 'crypto';

export class GerarHash {
  async gerarHash(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = await this.pbkdf2Async(
      password,
      salt,
      100000,
      64,
      'sha512'
    );
    const hash = derivedKey.toString('hex');
    return `${hash}:${salt}`;
  }

  pbkdf2Async(
    password: string,
    salt: string,
    iterations: number,
    keylen: number,
    digest: string
  ): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      crypto.pbkdf2(
        password,
        salt,
        iterations,
        keylen,
        digest,
        (err, derivedKey) => {
          if (err) {
            reject(err);
          } else {
            resolve(derivedKey);
          }
        }
      );
    });
  }
}
