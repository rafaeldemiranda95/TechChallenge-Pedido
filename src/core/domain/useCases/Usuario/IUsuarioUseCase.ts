import { Usuario } from '../../models/Usuario';
export interface IUsuarioUseCase {
  salvar(usuario: Usuario): Promise<Usuario>;
  autenticaAdministrador(usuario: Usuario): Promise<string | undefined>;
  autenticaCliente(usuario: Usuario): Promise<string | undefined>;
  validarToken(token: string): Promise<boolean | undefined>;
  renovarToken(token: string): Promise<string | undefined>;
  obterUsuarioPorId(id: number): Promise<Usuario | undefined>;
}
