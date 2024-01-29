// import { expect } from 'chai';
import assert from 'assert'; // Importe o módulo assert aqui
import { GerarHash } from '../src/core/domain/valueObjects/GerarHash'; // Importe a classe GerarHash aqui

describe('GerarHash', () => {
  it('deve gerar um hash válido', async () => {
    const gerador = new GerarHash();
    const senha = 'senha_segura';

    const hashComSalt = await gerador.gerarHash(senha);
    const partes = hashComSalt.split(':');

    // Use assert para verificar as condições
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

    // Use assert para verificar se os hashes são diferentes
    assert.notStrictEqual(hash1, hash2, 'Os hashes devem ser diferentes');
  });
});
