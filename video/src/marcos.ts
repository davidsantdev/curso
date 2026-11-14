import type { CapituloHud } from "./componentes/hud";
import { DURACAO, em, FIM_DA_FALA } from "./lib/tempo";

/** Cada cena começa um pouquinho antes da primeira palavra dela. */
const antes = (s: number) => Math.max(0, s - 0.15);

/** Início de cada cena (segundos), achado pela própria fala. */
export const T = {
  inicio: 0,
  hoje: antes(em("Hoje a gente começa do começo")),
  duvida: antes(em("e talvez tenha ficado com aquela dúvida")),
  explicacao: antes(em("Então aqui eu vou te dar")),
  cap1: antes(em("Primeira coisa")),
  naoEsta: antes(em("Você vende um produto que não está")),
  fornecedor: antes(em("Quem tem o produto guardado")),
  caminho: antes(em("E aí, quando um cliente compra")),
  ponto: antes(em("Repara numa coisa aqui")),
  jaComprou: antes(em("Pô, isso muda tudo")),
  cap2: antes(em("Beleza. Vou te mostrar com um exemplo")),
  ilustrativo: antes(em("Tô usando número redondo")),
  garrafa: antes(em("Você acha um fornecedor")),
  venda: antes(em("Aí um cliente entra")),
  sobra: antes(em("Sobraram 54 reais")),
  estrutura: antes(em("Por enquanto, guarda a estrutura")),
  comparacao: antes(em("Agora olha a diferença")),
  cap3: antes(em("E aí aparece a palavra")),
  dropshipping: antes(em("Que fique claro")),
  cap4: antes(em("Beleza. Agora a parte que muita gente")),
  papeis: antes(em("Você é quem escolhe o produto")),
  objecao: antes(em("Tem gente que pensa assim")),
  porque: antes(em("Porque, pro cliente")),
  atrasou: antes(em("Então atrasou")),
  verdade: antes(em("Mas, como eu tava dizendo")),
  cap5: antes(em("Só que, olha")),
  naoE: antes(em("Vender sem estoque não é dinheiro fácil")),
  vantagem: antes(em("Qual é a vantagem real")),
  cap6: antes(em("Então, o que você faz com essa informação")),
  tarefas: antes(em("Primeira: explica")),
  proxima: antes(em("Na próxima aula")),
  fimDaFala: FIM_DA_FALA,
  fim: DURACAO,
};

/** Capítulos (para o indicador no canto e para a lista de capítulos do YouTube). */
export const CAPITULOS = [
  { n: "01", titulo: "O que é vender sem estoque", de: T.cap1, cartaoAte: T.naoEsta },
  { n: "02", titulo: "Do clique à casa do cliente", de: T.cap2, cartaoAte: T.ilustrativo },
  { n: "03", titulo: "E esse tal de dropshipping?", de: T.cap3, cartaoAte: T.dropshipping },
  { n: "04", titulo: "Quem faz o quê", de: T.cap4, cartaoAte: T.papeis },
  { n: "05", titulo: "O que vender sem estoque não é", de: T.verdade, cartaoAte: T.naoE },
  { n: "06", titulo: "O que você faz com isso", de: T.cap6, cartaoAte: T.tarefas },
];

/** Trechos em que o indicador do canto aparece: depois de cada cartão de capítulo até o próximo capítulo. */
export const TRECHOS_HUD: CapituloHud[] = CAPITULOS.map((c, i) => ({
  n: c.n,
  titulo: c.titulo,
  de: c.cartaoAte,
  ate: i + 1 < CAPITULOS.length ? CAPITULOS[i + 1].de : T.proxima,
}));
