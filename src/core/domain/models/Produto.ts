export class Produto {
  id?: number;
  nome: string;
  categoria: string;
  preco: number;
  descricao: string;
  imagem: string;
  tempoPreparo?: number;
  quantidade?: number;

  constructor(
    nome: string,
    categoria: string,
    preco: number,
    descricao: string,
    imagem: string,
    tempoPreparo?: number,
    id?: number,
    quantidade?: number
  ) {
    this.nome = nome;
    this.categoria = categoria;
    this.preco = preco;
    this.descricao = descricao;
    this.imagem = imagem;
    this.id = id;
    this.quantidade = quantidade;
    this.tempoPreparo = tempoPreparo;
  }
}
