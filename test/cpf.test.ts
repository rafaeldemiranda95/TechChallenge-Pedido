import assert from 'assert';
import { CPF } from '../src/core/domain/valueObjects/cpf'; // Importe a classe CPF aqui

describe('CPF', () => {
  describe('Validação de CPF', () => {
    it('deve validar um CPF válido', () => {
      const cpfValido = new CPF('350.538.270-10');
      assert.strictEqual(cpfValido.value, true);
    });

    it('deve rejeitar um CPF inválido', () => {
      const cpfInvalido = new CPF('123.456.789-00');
      assert.strictEqual(cpfInvalido.value, false);
    });
  });

  describe('Construtor', () => {
    it('deve criar uma instância de CPF com valor válido', () => {
      const cpfInstancia = new CPF('517.821.720-92');
      assert.ok(cpfInstancia instanceof CPF);
      assert.strictEqual(cpfInstancia.value, true);
    });

    it('deve criar uma instância de CPF com valor inválido', () => {
      const cpfInstancia = new CPF('123.456.789-00');
      assert.ok(cpfInstancia instanceof CPF);
      assert.strictEqual(cpfInstancia.value, false);
    });
  });
});
