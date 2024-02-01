# TechChallenge

## TURMA 2SOAT

**Grupo 21**

349463 - Airton Patrocínio da Silva Junior

349308 - Rafael de Miranda

## Links:

[Link Miro](https://miro.com/welcomeonboard/cFBKa2FvMmk2aUlFdmJUMVkzV09mYXFSMjY4TFMyNU9HRUxoZnhCOVJlckROTFlGVzNaR081aGVhRzg4QVZLeXwzNDU4NzY0NTU0ODI1ODY4Mzg3fDI=?share_link_id=476610680949)

[Link gitHub](https://github.com/rafaeldemiranda95/TechChallenge)

**Para rodar o projeto**: docker-compose up -d

## API

**Como gerar o token de autrnticação de usuário**

Para gerar o token do usuário, deve-se acessar na API de Usuários os seguintes end-points:

1. Usuario Funcionário: /autenticaUsuarioAdministrador
2. Usuário Ciente: /autenticaCliente

Os end-points que necessitam do Authorization devem ter esse parâmetro passado no cabeçalho da requisição, passando o token gerado na autenticação do usuário.

- Produtos
  | Método | URL | Header | Exemplo de Parâmetros |
  |--------|-----|--------|------------|
  | POST | /cadastroProduto | | `{"nome":"Água 500ml","categoria": "Bebida","preco":2.55,"descricao": "Uma garrafa de água mineral sem gás","imagem": "url da imagem virá aqui"}` |
  | POST | /alteraProduto | | `{"id": 4,"nome":"Coca Cola refil","categoria": "Bebida","preco":10.78,"descricao": "Um como de 500 ml de Coca Cola uqe você pode recarregar quantas vezes quiser","imagem": "url da imagem virá aqui"}` |
  | POST | /apagarProduto | Authorization: token usuário | `{"id": 5}` |
  | GET | /exibeProdutos | | |
  | GET | /exibeProdutosPorId | | |
  | GET | /exibeProdutosPorCategoria | | |

- Usuário
  | Método | URL | Header | Exemplo de Parâmetros |
  |--------|-----|--------|------------|
  | POST | /cadastroCliente | | `{"nome":"Rafael de Miranda","email":"3434@gmail.com","cpf":"96509759004"}` |
  | POST | /cadastroAdministrador | | `{"nome":"Rafael de Miranda","email":"434343133332321@gmail.com","cpf":"51697242090","senha":"123456","tipo":"adminstrador"}` |
  | POST | /autenticaUsuarioAdministrador | | `{"email":"derafae@gmail.com","senha":"123456"}` |
  | POST | /autenticaCliente | | `{"cpf":"50651193095"}` |

- Prdidos
  | Método | URL | Header | Exemplo de Parâmetros |
  |--------|-----|--------|------------|
  | POST | /enviarPedido | Authorization: token usuário | `{"produtos":[{"id":9,"quantidade":2},{"id":1,"quantidade":1},{"id":8,"quantidade":2},{"id":30,"quantidade":1},{"id":20,"quantidade":1}]}` |
  | POST | /trocarStatusFila | Authorization: token usuário | `{"id":11,"status":"Finalizado"}` |
  | GET | /listarPedidos | Authorization: token usuário | |
  | GET | /listarFilas | Authorization: token usuário | |
