import crypto from 'crypto';
import { VerificaSenha } from '../src/core/domain/valueObjects/VerificaSenha';

describe('VerificaSenha', () => {
  let verificaSenha: VerificaSenha;

  // Mock da função pbkdf2 do módulo crypto
  jest.mock('crypto', () => ({
    pbkdf2: jest.fn(),
  }));

  beforeEach(() => {
    verificaSenha = new VerificaSenha();
  });

  test('deve retornar true para uma senha que corresponde ao hash', async () => {
    const senha = 'minhaSenha123';
    const salt = 'meuSalt';
    const hash = crypto
      .pbkdf2Sync(senha, salt, 100000, 64, 'sha512')
      .toString('hex');
    const senhaHash = `${hash}:${salt}`;

    const resultado = await verificaSenha.verificaSenha(senha, senhaHash);

    expect(resultado).toBe(true);
  });

  test('deve retornar false para uma senha que não corresponde ao hash', async () => {
    const senha = 'minhaSenha123';
    const senhaErrada = 'senhaErrada123';
    const salt = 'meuSalt';
    const hash = crypto
      .pbkdf2Sync(senha, salt, 100000, 64, 'sha512')
      .toString('hex');
    const senhaHash = `${hash}:${salt}`;

    const resultado = await verificaSenha.verificaSenha(senhaErrada, senhaHash);

    expect(resultado).toBe(false);
  });

  test('deve lançar um erro para um hash mal formatado', async () => {
    const senha = 'minhaSenha123';
    const senhaHash = 'hashMalFormatado';

    await expect(verificaSenha.verificaSenha(senha, senhaHash)).rejects.toThrow(
      'The "salt" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received undefined'
    );
  });

  it('deve rejeitar a Promise em caso de erro', async () => {
    const senha = 'senha123';
    const salt = 'salt123';
    const iterations = 100000;
    const keylen = 64;
    const digest = 'digestInvalido'; // Digest inválido para causar um erro

    const verificaSenha = new VerificaSenha();

    await expect(
      verificaSenha.pbkdf2Async(senha, salt, iterations, keylen, digest)
    ).rejects.toThrow();
  });

  // it('deve gerar um hash de senha corretamente', async () => {
  //   const senha = 'senha123';
  //   const salt = 'salt123';
  //   const iterations = 100000;
  //   const keylen = 64;
  //   const digest = 'sha512';

  //   const verificaSenha = new VerificaSenha();
  //   const derivedKey = await verificaSenha.pbkdf2Async(
  //     senha,
  //     salt,
  //     iterations,
  //     keylen,
  //     digest
  //   );

  //   expect(derivedKey).toBeDefined();
  //   expect(derivedKey instanceof Buffer).toBe(true);
  //   // Verifique se o tamanho do Buffer está correto
  //   expect(derivedKey.length).toBe(keylen);
  // });

  // it('deve rejeitar a Promise em caso de erro', async () => {
  //   const senha = 'senha123';
  //   const salt = 'salt123';
  //   const iterations = 100000;
  //   const keylen = 64;
  //   const digest = 'invalidDigest'; // Digest inválido para causar um erro

  //   const verificaSenha = new VerificaSenha();

  //   // Deve rejeitar a Promise devido ao digest inválido
  //   await expect(
  //     verificaSenha.pbkdf2Async(senha, salt, iterations, keylen, digest)
  //   ).rejects.toThrow();
  // });
});
