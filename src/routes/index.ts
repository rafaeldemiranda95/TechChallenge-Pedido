import express from 'express';
import { PedidoController } from '../adapter/driver/PedidoController';
import { ProdutoController } from '../adapter/driver/ProdutoController';
import { UsuarioController } from '../adapter/driver/UsuarioController';
import { autenticacaoMiddleware } from '../adapter/middleware/autenticacao.middleware';
import { ItensPedido } from '../core/domain/models/ItensPedido';
import { UsuarioUseCase } from '../core/domain/useCases/Usuario/UsuarioUseCase';
const router = express.Router();
const usuarioUseCase = new UsuarioUseCase();
router.get('/', (req, res) => {
  res.status(200).send('OK');
});

router.post(
  '/cadastroProduto',
  autenticacaoMiddleware(usuarioUseCase),
  async (req, res) => {
    let categoria = req.body.categoria;
    let preco = req.body.preco;
    let descricao = req.body.descricao;
    let imagem = req.body.imagem;

    const produtoController = new ProdutoController();
    let produtoCadastrado = await produtoController.cadastrarProduto(
      nome,
      categoria,
      preco,
      descricao,
      imagem,
      res
    );
    res.status(200).send(produtoCadastrado);
  }
);

router.get(
  '/exibeProdutos',
  // autenticacaoMiddleware(usuarioUseCase),
  async (req, res) => {
    const produtoController = new ProdutoController();
    let listaDeProdutos = await produtoController.exibirProdutos(res);
    res.status(200).send(listaDeProdutos);
  }
);

router.get(
  '/exibeProdutosPorId',
  autenticacaoMiddleware(usuarioUseCase),
  async (req, res) => {
    let id = req.body.id;
    const produtoController = new ProdutoController();
    let listaDeProdutos = await produtoController.exibirProdutoPorId(id, res);
    res.status(200).send(listaDeProdutos);
  }
);

router.get(
  '/teste',
  autenticacaoMiddleware(usuarioUseCase),
  async (req, res) => {
    let id = req.body.id;
    const produtoController = new ProdutoController();
    let listaDeProdutos = await produtoController.exibirProdutoPorId(id, res);
    res.status(200).send(listaDeProdutos);
  }
);

router.get(
  '/exibeProdutosPorCategoria',
  autenticacaoMiddleware(usuarioUseCase),
  async (req, res) => {
    let categoria = req.body.categoria;
    const produtoController = new ProdutoController();
    let listaDeProdutos = await produtoController.exibirProdutoPorCategoria(
      categoria,
      res
    );
    res.status(200).send(listaDeProdutos);
  }
);

router.post(
  '/alteraProduto',
  autenticacaoMiddleware(usuarioUseCase),
  async (req, res) => {
    let id = req.body.id;
    let nome = req.body.nome;
    let categoria = req.body.categoria;
    let preco = req.body.preco;
    let descricao = req.body.descricao;
    let imagem = req.body.imagem;

    const produtoController = new ProdutoController();
    let produtoCadastrado = await produtoController.alterarProduto(
      id,
      nome,
      categoria,
      preco,
      descricao,
      imagem,
      res
    );
    res.status(200).send(produtoCadastrado);
  }
);

router.post(
  '/apagarProduto',
  autenticacaoMiddleware(usuarioUseCase),
  async (req, res) => {
    let id = req.body.id;
    const produtoController = new ProdutoController();
    await produtoController.apagarProduto(id, res);
  }
);

router.post('/cadastroCliente', async (req, res) => {
  let nome = req.body.nome;
  let email = req.body.email;
  let cpf = req.body.cpf;

  let usuarioController = new UsuarioController();
  await usuarioController.cadastrarCliente(nome, email, cpf, res);
});

router.post(
  '/cadastroAdministrador',
  autenticacaoMiddleware(usuarioUseCase),
  async (req, res) => {
    let nome = req.body.nome;
    let email = req.body.email;
    let cpf = req.body.cpf;
    let senha = req.body.senha;

    let usuarioController = new UsuarioController();
    await usuarioController.cadastrarAdministrador(
      nome,
      email,
      cpf,
      senha,
      res
    );
  }
);

router.post('/autenticaUsuarioAdministrador', async (req, res) => {
  let email = req.body.email;
  let senha = req.body.senha;

  let usuarioController = new UsuarioController();
  await usuarioController.autenticaAdminstrador(email, senha, res);
});

router.post('/autenticaCliente', async (req, res) => {
  let cpf = req.body.cpf;
  let usuarioController = new UsuarioController();
  await usuarioController.autenticaCliente(cpf, res);
});

router.post(
  '/enviarPedido',
  autenticacaoMiddleware(usuarioUseCase),
  async (req, res) => {
    let token = req.headers.authorization;
    let produto: Array<ItensPedido> = req.body.produtos;

    let pedidoController = new PedidoController();
    let response = await pedidoController.enviarPedido(token, produto, res);
    res.status(200).send(response);
  }
);

export default router;
