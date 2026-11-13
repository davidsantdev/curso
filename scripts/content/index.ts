/**
 * Conteúdo inicial da plataforma: uma trilha por arquivo.
 *
 * A ordem desta lista é a ordem em que as trilhas aparecem para o aluno.
 * Para editar o conteúdo depois que o banco já foi criado, use /admin/conteudo
 * (estes arquivos só são lidos pelo `npm run db:seed`, quando o banco está vazio).
 */
import { VENDER_SEM_ESTOQUE } from "./01-vender-sem-estoque";
import { PRODUTOS_E_FORNECEDORES } from "./02-produtos-e-fornecedores";
import { CRIAR_LOJA_VIRTUAL } from "./03-criar-loja-virtual";
import { CRIAR_SITES_E_PAGINAS } from "./04-criar-sites-e-paginas";
import { PAGAMENTOS_E_CHECKOUT } from "./05-pagamentos-e-checkout";
import { ANUNCIOS_FACEBOOK_INSTAGRAM } from "./06-anuncios-facebook-instagram";
import { ANUNCIOS_TIKTOK } from "./07-anuncios-tiktok";
import { ANUNCIOS_GOOGLE } from "./08-anuncios-google";
import { ROBOS_E_AUTOMACOES } from "./09-robos-e-automacoes";
import { VENDER_EM_MARKETPLACES } from "./10-vender-em-marketplaces";
import type { TrackSeed } from "./types";

export const TRACKS: TrackSeed[] = [
  VENDER_SEM_ESTOQUE,
  PRODUTOS_E_FORNECEDORES,
  CRIAR_LOJA_VIRTUAL,
  CRIAR_SITES_E_PAGINAS,
  PAGAMENTOS_E_CHECKOUT,
  ANUNCIOS_FACEBOOK_INSTAGRAM,
  ANUNCIOS_TIKTOK,
  ANUNCIOS_GOOGLE,
  ROBOS_E_AUTOMACOES,
  VENDER_EM_MARKETPLACES,
];
