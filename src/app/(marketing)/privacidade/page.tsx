import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Política de privacidade" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Política de privacidade" updatedAt="13 de novembro de 2026">
      <p>
        Esta política explica quais dados pessoais a {site.name} coleta, para que eles são usados e quais são os seus
        direitos, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
      </p>

      <h2>1. Dados que coletamos</h2>
      <ul>
        <li>
          <strong>Cadastro:</strong> nome, e-mail e senha (guardada apenas de forma criptografada, sem possibilidade de
          leitura).
        </li>
        <li>
          <strong>Uso da plataforma:</strong> aulas concluídas, respostas de quizzes, tarefas marcadas, anotações e
          comentários.
        </li>
        <li>
          <strong>Pagamento:</strong> plano contratado, valores, forma de pagamento e datas. O pagamento é processado
          pelo Mercado Pago, que recebe o seu nome e e-mail para emitir a cobrança. Os dados do cartão ficam com ele e
          não passam pelos nossos servidores.
        </li>
      </ul>

      <h2>2. Para que usamos</h2>
      <ul>
        <li>Dar acesso ao conteúdo e salvar o seu progresso.</li>
        <li>Emitir certificados e mostrar conquistas.</li>
        <li>
          Enviar e-mails sobre a sua conta: boas-vindas, recuperação de senha, confirmação de pagamento e aviso de fim
          do período de acesso.
        </li>
        <li>Melhorar as aulas com base no uso agregado da plataforma.</li>
      </ul>

      <h2>3. Cookies</h2>
      <p>
        Usamos um cookie essencial para manter você conectado. Ele não é usado para publicidade e não é compartilhado
        com terceiros.
      </p>

      <h2>4. Seus direitos</h2>
      <p>
        Na página <em>Minha conta</em> você pode corrigir os seus dados, baixar uma cópia de tudo o que guardamos
        sobre você e excluir a conta, sem precisar pedir a ninguém. Se preferir, escreva para{" "}
        <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
      </p>

      <h2>5. Por quanto tempo guardamos</h2>
      <p>
        Os dados ficam guardados enquanto a conta existir. Ao excluir a conta, o cadastro, o progresso, as anotações e
        os comentários são apagados na hora. Os registros de pagamento são mantidos sem identificação do titular, para
        cumprir obrigações fiscais.
      </p>
    </LegalPage>
  );
}
