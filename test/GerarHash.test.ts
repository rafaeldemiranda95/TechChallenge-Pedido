import assert from 'assert';
import { GerarHash } from '../src/core/domain/valueObjects/GerarHash';

describe('GerarHash', () => {
  it('deve gerar um hash válido', async () => {
    const gerador = new GerarHash();
    const senha = 'senha_segura';

    const hashComSalt = await gerador.gerarHash(senha);
    const partes = hashComSalt.split(':');

    assert.strictEqual(partes.length, 2, 'Deve ter duas partes');
    assert.strictEqual(
      typeof partes[0],
      'string',
      'A primeira parte deve ser uma string'
    );
    assert.strictEqual(
      typeof partes[1],
      'string',
      'A segunda parte deve ser uma string'
    );
  });

  it('deve gerar hashes diferentes para senhas diferentes', async () => {
    const gerador = new GerarHash();
    const senha1 = 'senha1';
    const senha2 = 'senha2';

    const hash1 = await gerador.gerarHash(senha1);
    const hash2 = await gerador.gerarHash(senha2);

    assert.notStrictEqual(hash1, hash2, 'Os hashes devem ser diferentes');
  });
});
