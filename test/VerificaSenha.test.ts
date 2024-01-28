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
});
