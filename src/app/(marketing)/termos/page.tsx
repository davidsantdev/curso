import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Termos de uso" };

export default function TermsPage() {
  return (
    <LegalPage title="Termos de uso" updatedAt="16 de novembro de 2026">
      <h2>1. Sobre a plataforma</h2>
      <p>
        A {site.name} oferece cursos on-line sobre vendas na internet, organizados em trilhas, módulos e aulas. Ao criar
        uma conta, você concorda com estes termos.
      </p>

      <h2>2. Conta e acesso</h2>
      <ul>
        <li>A conta é pessoal e intransferível. Não compartilhe o seu login.</li>
        <li>Você é responsável por manter a sua senha em segurança.</li>
        <li>Podemos suspender contas usadas para compartilhar ou revender o conteúdo.</li>
      </ul>

      <h2>3. Planos e pagamento</h2>
      <ul>
        <li>O plano gratuito libera parte do conteúdo, sem custo e sem prazo.</li>
        <li>Os planos pagos liberam todo o conteúdo durante o período contratado.</li>
        <li>
          O pagamento é feito uma única vez por período, por Pix, cartão ou boleto, e é processado pela Cakto, que
          intermedeia a venda e cuida da cobrança e dos reembolsos. <strong>Não há renovação nem cobrança automática</strong>:
          ao fim do período, o acesso pago termina e você decide se quer renovar.
        </li>
        <li>O seu progresso, as anotações e os certificados continuam guardados mesmo depois que o período termina.</li>
        <li>
          Você pode desistir da compra em até 7 dias e receber o valor de volta, conforme o Código de Defesa do
          Consumidor (art. 49). Basta pedir pelo link do e-mail de confirmação da compra ou pelo e-mail de contato. Com o
          reembolso, o acesso pago é encerrado.
        </li>
        <li>Cupons de desconto e de cortesia valem para uma compra, não são cumulativos e podem ter prazo ou limite de uso.</li>
      </ul>

      <h2>4. Conteúdo</h2>
      {site.prelaunch ? (
        <p>
          <strong>Pré-estreia:</strong> enquanto o site estiver em pré-estreia, todas as aulas publicadas ficam
          disponíveis em texto, com tarefas e quiz, e os vídeos das aulas são publicados aos poucos, sem data
          garantida para cada um. Os vídeos publicados durante o seu período de acesso fazem parte do plano, sem custo
          adicional. As aulas ainda sem vídeo aparecem marcadas como “vídeo em breve”, e o preço cobrado nesse período é
          o preço de estreia mostrado na página de planos.
        </p>
      ) : null}
      <p>
        Todo o material é protegido por direitos autorais. É proibido copiar, gravar, redistribuir ou revender aulas,
        textos e materiais sem autorização por escrito.
      </p>

      <h2>5. Sem garantia de resultado</h2>
      <p>
        O conteúdo tem finalidade educacional. Resultados financeiros dependem de fatores fora do nosso controle — como
        mercado, produto, investimento e execução — e por isso não prometemos nem garantimos ganhos.
      </p>

      <h2>6. Contato</h2>
      <p>
        Dúvidas sobre estes termos: <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
      </p>
    </LegalPage>
  );
}
