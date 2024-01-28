import { Usuario } from '../../core/domain/models/Usuario';
import { UsuarioUseCase } from '../../core/domain/useCases/Usuario/UsuarioUseCase';
import { CPF } from '../../core/domain/valueObjects/cpf';
export class UsuarioController {
  async cadastrarCliente(nome: string, email: string, cpf: string, res: any) {
    try {
      let usuarioUseCase = new UsuarioUseCase();
      if (cpf == undefined || cpf == null || cpf == '') {
        return res.status(400).send('CPF é obrigatório');
      }
      let cpfObj = new CPF(cpf);
      if (cpfObj.value) {
        let usuario = new Usuario(nome, email, cpf);
        await usuarioUseCase.cadastraUsuario(usuario, res);
        return res.status(200).send('Usuário cadastrado com sucesso');
      } else {
        return res.status(400).send('CPF inválido');
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async cadastrarAdministrador(
    nome: string,
    email: string,
    cpf: string,
    senha: string,
    res: any
  ) {
    try {
      let cpfObj = new CPF(cpf);
      if (cpfObj.value) {
        let usuario = new Usuario(nome, email, cpf, 'administrador', senha);
        await new UsuarioUseCase().cadastraAdministrador(usuario, res);
        res.status(200).send('Usuário cadastrado com sucesso');
      } else {
        res.status(400).send('CPF inválido');
      }
    } catch (error: any) {
      res.status(400).send(`${error.message} já cadastrado`);
    }
  }

  async autenticaAdminstrador(email: string, senha: string, res: any) {
    try {
      let usuario = new Usuario('', email, '', '', senha);
      await new UsuarioUseCase().autenticaAdministrador(usuario, res);
    } catch (error: any) {
      console.log(error);
      throw 'Erro de autenticação do administrador';
    }
  }
  async autenticaCliente(cpf: string, res: any) {
    try {
      let usuario = new Usuario('', '', cpf, '');
      await new UsuarioUseCase().autenticaCliente(usuario, res);
    } catch (error: any) {
      console.log(error);
      throw 'Erro de autenticação do cliente';
    }
  }
}
