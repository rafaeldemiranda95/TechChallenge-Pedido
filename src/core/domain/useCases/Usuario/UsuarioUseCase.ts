import { Usuario } from '../../../domain/models/Usuario';
import { UsuarioRepository } from '../../../../adapter/driven/infra/UsuarioRepository';

export class UsuarioUseCase {
  async cadastraUsuario(usuario: Usuario, res: any) {
    try {
      await new UsuarioRepository().salvar(usuario);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async cadastraAdministrador(usuario: Usuario, res: any) {
    try {
      await new UsuarioRepository().salvar(usuario);
    } catch (error: any) {
      let errorType = JSON.parse(error.message);
      if (errorType.code == 'P2002') {
        throw new Error(errorType.field);
      }
    }
  }

  async autenticaAdministrador(usuario: Usuario, res: any) {
    try {
      let verificaUsuario =
        await new UsuarioRepository().autenticaAdministrador(usuario);
      if (verificaUsuario == undefined) {
        res.status(400).send('Usuário não encontrado');
      } else {
        res.status(200).send(verificaUsuario);
      }
    } catch (error: any) {
      console.log(error);
    }
  }
  async autenticaCliente(usuario: Usuario, res: any) {
    try {
      let verificaUsuario = await new UsuarioRepository().autenticaCliente(
        usuario
      );
      if (verificaUsuario == undefined) {
        res.status(400).send('Usuário não encontrado');
      } else {
        res.status(200).send(verificaUsuario);
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async validarToken(token: string) {
    try {
      let tokenValido = await new UsuarioRepository().validarToken(token);
      return tokenValido;
    } catch (error: any) {
      console.log(error);
    }
  }
}
