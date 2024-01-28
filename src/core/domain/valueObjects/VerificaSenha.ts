import crypto from 'crypto';

export class VerificaSenha {
  // constructor(senha: string, senhaHash: string) {
  //     this.verificaSenha(senha, senhaHash);
  // }

  async verificaSenha(senha: string, senhaHash: string): Promise<boolean> {
    const [hash, salt] = senhaHash.split(':');
    const derivedKey = await this.pbkdf2Async(
      senha,
      salt,
      100000,
      64,
      'sha512'
    );
    const derivedPasswordHash = derivedKey.toString('hex');
    return derivedPasswordHash === hash;
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
