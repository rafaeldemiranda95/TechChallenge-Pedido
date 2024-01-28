import { Pool } from 'pg';
import { runQuery } from './database';

jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('runQuery', () => {
  let pool: any;

  beforeEach(() => {
    pool = new Pool();
  });

  test('deve executar uma consulta e retornar resultados', async () => {
    const mockRows = [{ id: 1, name: 'Test' }];
    pool.query.mockResolvedValue({ rows: mockRows });

    const result = await runQuery('SELECT * FROM table');
    expect(result).toEqual(mockRows);
    expect(pool.connect).toHaveBeenCalled();
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM table');
  });

  test('deve lidar com erros de consulta', async () => {
    pool.query.mockRejectedValue(new Error('Erro de consulta'));

    await expect(runQuery('SELECT * FROM table')).rejects.toThrow(
      'Erro de consulta'
    );
    expect(pool.connect).toHaveBeenCalled();
  });

  // Outros testes conforme necessário
});
