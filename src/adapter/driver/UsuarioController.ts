import { Usuario } from '../../core/domain/models/Usuario';
import { UsuarioUseCase } from '../../core/domain/useCases/Usuario/UsuarioUseCase';
import { CPF } from '../../core/domain/valueObjects/cpf';
export class UsuarioController {
  constructor(
    private usuarioUseCase: UsuarioUseCase,
    private cpfFactory: (cpf: string) => CPF
  ) {}
  async cadastrarCliente(nome: string, email: string, cpf: string, res: any) {
    if (!cpf) {
      throw new Error('CPF é obrigatório');
    }
    const cpfObj = this.cpfFactory(cpf);
    if (!cpfObj.value) {
      throw new Error('CPF inválido');
    }
    try {
      const usuario = new Usuario(nome, email, cpf);
      await this.usuarioUseCase.cadastraUsuario(usuario, res);
      res.status(200).send('Usuário cadastrado com sucesso');
    } catch (error: any) {
      throw new Error('Erro ao cadastrar usuário');
    }
  }

  async cadastrarAdministrador(
    nome: string,
    email: string,
    cpf: string,
    senha: string,
    res: any
  ) {
    if (!cpf) {
      throw new Error('CPF é obrigatório');
    }
    const cpfObj = this.cpfFactory(cpf);
    if (!cpfObj.value) {
      throw new Error('CPF inválido');
    }
    try {
      const usuario = new Usuario(nome, email, cpf, 'administrador', senha);
      await this.usuarioUseCase.cadastraAdministrador(usuario, res);
      res.status(200).send('Usuário cadastrado com sucesso');
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  }

  async autenticaAdminstrador(email: string, senha: string, res: any) {
    try {
      let usuario = new Usuario('', email, '', '', senha);
      await this.usuarioUseCase.autenticaAdministrador(usuario, res);
    } catch (error: any) {
      throw new Error('Erro de autenticação do administrador');
    }
  }
  async autenticaCliente(cpf: string, res: any) {
    try {
      let usuario = new Usuario('', '', cpf, '');
      await this.usuarioUseCase.autenticaCliente(usuario, res);
    } catch (error: any) {
      throw new Error('Erro de autenticação do cliente');
    }
  }
}
