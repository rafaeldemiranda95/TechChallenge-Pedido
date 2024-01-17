import { IUsuarioUseCase } from '../../../core/domain/useCases/Usuario/IUsuarioUseCase';
import { Usuario } from '../../../core/domain/models/Usuario';
import { runQuery, prisma } from '../../../config/database';
import { VerificaSenha } from '../../../core/domain/valueObjects/VerificaSenha';
import { GerarHash } from '../../../core/domain/valueObjects/GerarHash';
var jwt = require('jsonwebtoken');

export class UsuarioRepository implements IUsuarioUseCase {
  // async obterUsuarioPorId(id: number): Promise<Usuario | undefined> {
  //   try {
  //     let usuario = await prisma.usuario.findUnique({
  //       where: { id: id },
  //     });
  //     if (usuario) {
  //       return new Usuario(
  //         usuario.nome,
  //         usuario.email,
  //         usuario.cpf,
  //         usuario.tipo,
  //         undefined,
  //         undefined,
  //         usuario.id
  //       );
  //     } else {
  //       return undefined;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async obterUsuarioPorId(id: number): Promise<Usuario | undefined> {
    try {
      const query = `SELECT * FROM usuario WHERE id = ${id}`;
      // const values = [id];

      const result = await runQuery(query);

      console.log('result  ==>>  ', result);

      if (result.length > 0) {
        const usuario = result[0];
        return new Usuario(
          usuario.nome,
          usuario.email,
          usuario.cpf,
          usuario.tipo,
          undefined,
          undefined,
          usuario.id
        );
      } else {
        return undefined;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async renovarToken(token: string): Promise<string | undefined> {
    let query = `select * from public.usuario where token = '${token}'`;
    let _getUsuarioDb = await runQuery(query);
    // let getUsuarioDb = await prisma.usuario.findUnique({
    //   where: {
    //     token: token,
    //   },
    // });
    if (_getUsuarioDb.length > 0) {
      let getUsuarioDb = _getUsuarioDb[0];
      let token = jwt.sign({ id: getUsuarioDb.id }, process.env.JWT_SECRET, {
        expiresIn: null,
      });
      await prisma.usuario.update({
        where: { id: getUsuarioDb.id },
        data: { token: token },
      });
      return token;
    } else {
      return undefined;
    }
  }

  async validarToken(token: string): Promise<boolean | undefined> {
    let query = `select * from public.usuario where token = '${token}'`;
    let _getUsuarioDb = await runQuery(query);
    // let getUsuarioDb = await prisma.usuario.findUnique({
    //   where: {
    //     token: token,
    //   },
    // });
    if (_getUsuarioDb.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async autenticaAdministrador(usuario: Usuario): Promise<string | undefined> {
    // let getUsuarioDb = await prisma.usuario.findUnique({
    //   where: {
    //     email: usuario.email,
    //   },
    // });

    let query = `select * from public.usuario where email = '${usuario.email}'`;
    let _getUsuarioDb = await runQuery(query);
    console.log(_getUsuarioDb);

    if (_getUsuarioDb.length > 0) {
      let getUsuarioDb = _getUsuarioDb[0];
      if (usuario.senha != undefined && getUsuarioDb.senha != undefined) {
        let validaSenha = new VerificaSenha(usuario.senha, getUsuarioDb.senha);
        if (validaSenha) {
          let token = jwt.sign(
            {
              id: getUsuarioDb.id,
              nome: getUsuarioDb.nome,
              email: getUsuarioDb.email,
              tipo: getUsuarioDb.tipo,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: '365d',
            }
          );
          // await prisma.usuario.update({
          //   where: { id: getUsuarioDb.id },
          //   data: { token: token },
          // });

          let saveQuery = `UPDATE public.usuario SET token = '${token}' where id = ${getUsuarioDb.id};`;
          await runQuery(saveQuery);
          return token;
        }
      } else {
        return undefined;
      }
    }

    return undefined;
  }

  async autenticaCliente(usuario: Usuario): Promise<string | undefined> {
    try {
      let query = `select * from public.usuario where cpf = '${usuario.cpf}'`;
      let _getUsuarioDb = await runQuery(query);
      if (_getUsuarioDb.length > 0) {
        let getUsuarioDb = _getUsuarioDb[0];
        let token = jwt.sign(
          {
            id: getUsuarioDb.id,
            nome: getUsuarioDb.nome,
            email: getUsuarioDb.email,
            tipo: getUsuarioDb.tipo,
            cpf: getUsuarioDb.cpf,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '365d',
          }
        );
        let saveQuery = `UPDATE public.usuario SET token = '${token}' where id = ${getUsuarioDb.id};`;
        await runQuery(saveQuery);
        return token;
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async salvar(usuario: Usuario): Promise<Usuario> {
    let gerarSenha = new GerarHash();
    const query = `INSERT INTO public.usuario(
      email, nome, cpf, tipo, senha)
      VALUES ('${usuario.email}', '${usuario.nome}', '${usuario.cpf}', '${
      usuario.tipo
    }', '${
      usuario.senha == undefined
        ? null
        : await gerarSenha.gerarHash(usuario.senha)
    }') RETURNING *;`;
    const _usuario = await runQuery(query);
    if (_usuario.length > 0) {
      let user: Usuario = _usuario[0];
      return user;
    } else {
      throw new Error('Usuário não encontrado');
    }
    // return prisma.usuario
    // .create({
    //   data: {
    //     nome: usuario.nome,
    //     email: usuario.email,
    //     cpf: usuario.cpf,
    //     tipo: usuario.tipo,
    //     senha:
    //       usuario.senha == undefined
    //         ? null
    //         : await gerarSenha.gerarHash(usuario.senha),
    //   },
    // })
    // .then((usuario: any) => {
    //   return usuario;
    // })
    // .catch((error: any) => {
    //   let errorType = JSON.stringify({
    //     code: error.code,
    //     field: error.meta.target[0],
    //   });
    //   throw new Error(errorType);
    // });
  }
}
