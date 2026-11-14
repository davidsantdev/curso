import { House, Package, ShoppingBag, Store, Warehouse, type LucideIcon } from "lucide-react";
import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { prog, SUAVE } from "../lib/anim";
import { FPS } from "../lib/tempo";
import { COR, DEGRADE, DEGRADE_FORTE, FONTE } from "../tema";
import { Cena, Fala, IconeCaixa, Rotulo, Vidro } from "./base";

/* ----------------------------------------------------------------------------------------------
 * Cartão de capítulo: número grande em contorno (que se preenche com o degradê) + título.
 * ---------------------------------------------------------------------------------------------- */
export const CenaCapitulo: React.FC<{
  numero: string;
  titulo: string;
  de: number;
  ate: number;
  extra?: React.ReactNode;
}> = ({ numero, titulo, de, ate, extra }) => {
  const frame = useCurrentFrame();
  const pNum = prog(frame, de, 1.1);
  const pPreenche = prog(frame, de + 0.35, 1.6, SUAVE);
  const pLinha = prog(frame, de + 0.3, 1.0, SUAVE);
  const numeroBase: React.CSSProperties = {
    fontFamily: FONTE.sans,
    fontWeight: 700,
    fontSize: 360,
    lineHeight: 0.8,
    letterSpacing: "-0.07em",
  };
  return (
    <Cena de={de} ate={ate} zoom={0.02}>
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 190px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 100 }}>
          <div
            style={{
              position: "relative",
              opacity: pNum,
              transform: `translateY(${((1 - pNum) * 70).toFixed(2)}px)`,
              filter: pNum < 0.99 ? `blur(${((1 - pNum) * 10).toFixed(2)}px)` : undefined,
            }}
          >
            <div style={{ ...numeroBase, color: "transparent", WebkitTextStroke: "2px rgba(201,166,245,0.45)" }}>
              {numero}
            </div>
            <div
              style={{
                ...numeroBase,
                position: "absolute",
                inset: 0,
                backgroundImage: DEGRADE_FORTE,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                opacity: 0.3,
                clipPath: `inset(${((1 - pPreenche) * 100).toFixed(2)}% 0 0 0)`,
              }}
            >
              {numero}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 30 }}>
            <Rotulo em={de + 0.1}>{`Capítulo ${numero}`}</Rotulo>
            <Fala texto={titulo} em={de + 0.22} intervalo={0.06} tamanho={104} largura={1050} entrelinha={1.02} />
            <div
              style={{
                height: 3,
                width: 280,
                borderRadius: 3,
                backgroundImage: DEGRADE_FORTE,
                transform: `scaleX(${pLinha.toFixed(4)})`,
                transformOrigin: "left center",
              }}
            />
            {extra}
          </div>
        </div>
      </AbsoluteFill>
    </Cena>
  );
};

/* ----------------------------------------------------------------------------------------------
 * Triângulo cliente → você → fornecedor → cliente. A seta principal (fornecedor → cliente) mostra
 * o produto indo direto para a casa do cliente, sem passar por você.
 * ---------------------------------------------------------------------------------------------- */
type Ponto = { x: number; y: number };
type NoTriangulo = { em: number; nota?: string };

const POS = { voce: { x: 560, y: 360 }, fornecedor: { x: 1360, y: 360 }, cliente: { x: 960, y: 760 } };

function segmento(a: Ponto, b: Ponto, r1 = 100, r2 = 108) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const L = Math.hypot(dx, dy);
  const ux = dx / L;
  const uy = dy / L;
  return {
    x1: a.x + ux * r1,
    y1: a.y + uy * r1,
    x2: b.x - ux * r2,
    y2: b.y - uy * r2,
    len: L - r1 - r2,
    ang: (Math.atan2(dy, dx) * 180) / Math.PI,
  };
}

const No: React.FC<{
  pos: Ponto;
  icone: LucideIcon;
  nome: string;
  nota?: string;
  em: number;
  lado: "esquerda" | "direita" | "baixo";
  apagado?: number;
  destaque?: boolean;
  dy: number;
}> = ({ pos, icone, nome, nota, em, lado, apagado = 0, destaque, dy }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, em, 0.7);
  const texto: React.CSSProperties =
    lado === "baixo"
      ? { position: "absolute", left: "50%", top: "calc(100% + 20px)", transform: "translateX(-50%)", textAlign: "center" }
      : lado === "esquerda"
        ? { position: "absolute", right: "calc(100% + 30px)", top: "50%", transform: "translateY(-50%)", textAlign: "right" }
        : { position: "absolute", left: "calc(100% + 30px)", top: "50%", transform: "translateY(-50%)", textAlign: "left" };
  return (
    <div
      style={{
        position: "absolute",
        left: pos.x - 66,
        top: pos.y + dy - 66,
        width: 132,
        height: 132,
        opacity: p * (1 - 0.68 * apagado),
        transform: `scale(${(0.86 + 0.14 * p).toFixed(4)})`,
        filter: p < 0.99 ? `blur(${((1 - p) * 8).toFixed(2)}px)` : undefined,
      }}
    >
      <IconeCaixa icone={icone} tamanho={132} destaque={destaque} />
      <div style={{ ...texto, width: 360 }}>
        <div style={{ fontFamily: FONTE.sans, fontWeight: 600, fontSize: 40, letterSpacing: "-0.03em", color: COR.texto }}>
          {nome}
        </div>
        {nota && (
          <div style={{ fontFamily: FONTE.sans, fontSize: 25, color: COR.suave, marginTop: 6, letterSpacing: "-0.01em" }}>
            {nota}
          </div>
        )}
      </div>
    </div>
  );
};

const Ligacao: React.FC<{
  id: string;
  a: Ponto;
  b: Ponto;
  em: number;
  principal?: boolean;
  apagado?: number;
}> = ({ id, a, b, em, principal = false, apagado = 0 }) => {
  const frame = useCurrentFrame();
  const s = segmento(a, b);
  const p = prog(frame, em, 0.9, SUAVE);
  const seta = prog(frame, em + 0.75, 0.25);
  const opacidade = 1 - 0.75 * apagado;
  const cor = principal ? `url(#${id})` : "rgba(246,245,251,0.42)";
  return (
    <g opacity={opacidade}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}>
          <stop offset="0" stopColor="#8C9BFF" />
          <stop offset="0.5" stopColor="#B49CFB" />
          <stop offset="1" stopColor="#F4A6DE" />
        </linearGradient>
      </defs>
      {principal && (
        <line
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke={cor}
          strokeWidth={16}
          strokeLinecap="round"
          opacity={0.16}
          strokeDasharray={s.len}
          strokeDashoffset={s.len * (1 - p)}
        />
      )}
      <line
        x1={s.x1}
        y1={s.y1}
        x2={s.x2}
        y2={s.y2}
        stroke={cor}
        strokeWidth={principal ? 4 : 2.5}
        strokeLinecap="round"
        strokeDasharray={s.len}
        strokeDashoffset={s.len * (1 - p)}
      />
      <polygon
        points="-2,-11 20,0 -2,11"
        fill={principal ? "#F4A6DE" : "rgba(246,245,251,0.7)"}
        opacity={seta}
        transform={`translate(${s.x2} ${s.y2}) rotate(${s.ang})`}
      />
    </g>
  );
};

/** Caixinha que viaja pela seta principal, em loop, depois que a seta aparece. */
const Pacote: React.FC<{ a: Ponto; b: Ponto; em: number }> = ({ a, b, em }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = segmento(a, b, 110, 130);
  const inicio = em + 0.9;
  if (t < inicio) return null;
  const ciclo = 2.4;
  const u = ((t - inicio) % ciclo) / ciclo;
  const e = SUAVE(u);
  const o = Math.min(1, u / 0.12, (1 - u) / 0.12);
  const x = s.x1 + (s.x2 - s.x1) * e;
  const y = s.y1 + (s.y2 - s.y1) * e;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 30,
        top: y - 30,
        width: 60,
        height: 60,
        borderRadius: 18,
        display: "grid",
        placeItems: "center",
        backgroundImage: DEGRADE_FORTE,
        boxShadow: "0 0 40px rgba(242,155,217,0.7)",
        opacity: o,
      }}
    >
      <Package size={30} strokeWidth={1.8} color="#FFFFFF" />
    </div>
  );
};

export const Triangulo: React.FC<{
  cliente: NoTriangulo;
  voce: NoTriangulo;
  fornecedor: NoTriangulo;
  ligacoes: { clienteVoce: number; voceFornecedor: number; fornecedorCliente: number };
  rotulos: { clienteVoce: string; voceFornecedor: string; fornecedorCliente: string };
  /** Segundo em que "você" fica apagado (o produto não passa por você). */
  voceApagaEm?: number;
  dy?: number;
}> = ({ cliente, voce, fornecedor, ligacoes, rotulos, voceApagaEm, dy = 0 }) => {
  const frame = useCurrentFrame();
  const apaga = voceApagaEm === undefined ? 0 : prog(frame, voceApagaEm, 0.8, SUAVE);
  const P = {
    voce: { x: POS.voce.x, y: POS.voce.y + dy },
    fornecedor: { x: POS.fornecedor.x, y: POS.fornecedor.y + dy },
    cliente: { x: POS.cliente.x, y: POS.cliente.y + dy },
  };
  const rotulo = (texto: string, em: number, style: React.CSSProperties, principal = false, apagado = 0) => {
    const p = prog(frame, em + 0.35, 0.6);
    return (
      <div
        style={{
          position: "absolute",
          fontFamily: FONTE.mono,
          fontSize: 20,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: principal ? COR.rosa : COR.suave,
          opacity: p * (1 - 0.7 * apagado),
          whiteSpace: "nowrap",
          ...style,
        }}
      >
        {texto}
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <Ligacao id="lig-cv" a={P.cliente} b={P.voce} em={ligacoes.clienteVoce} apagado={apaga} />
        <Ligacao id="lig-vf" a={P.voce} b={P.fornecedor} em={ligacoes.voceFornecedor} apagado={apaga} />
        <Ligacao id="lig-fc" a={P.fornecedor} b={P.cliente} em={ligacoes.fornecedorCliente} principal />
      </svg>
      {rotulo(rotulos.clienteVoce, ligacoes.clienteVoce, { left: 760 - 40, top: 560 + dy, transform: "translate(-100%, -50%)" }, false, apaga)}
      {rotulo(rotulos.voceFornecedor, ligacoes.voceFornecedor, { left: 960, top: 318 + dy, transform: "translate(-50%, -100%)" }, false, apaga)}
      {rotulo(rotulos.fornecedorCliente, ligacoes.fornecedorCliente, { left: 1160 + 40, top: 560 + dy, transform: "translate(0, -50%)" }, true)}
      <Pacote a={P.fornecedor} b={P.cliente} em={ligacoes.fornecedorCliente} />
      <No pos={POS.voce} dy={dy} icone={Store} nome="Você" nota={voce.nota} em={voce.em} lado="esquerda" apagado={apaga} />
      <No pos={POS.fornecedor} dy={dy} icone={Warehouse} nome="Fornecedor" nota={fornecedor.nota} em={fornecedor.em} lado="direita" />
      <No pos={POS.cliente} dy={dy} icone={House} nome="Cliente" nota={cliente.nota} em={cliente.em} lado="baixo" destaque />
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------------------------------------------
 * Garrafa térmica desenhada em vetor, com reflexo de luz passando (visual de foto de produto).
 * ---------------------------------------------------------------------------------------------- */
const CORPO =
  "M74 124 H226 Q238 124 240 138 L244 190 V716 Q244 744 216 744 H84 Q56 744 56 716 V190 L60 138 Q62 124 74 124 Z";

export const Garrafa: React.FC<{ em: number; altura?: number }> = ({ em, altura = 680 }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const p = prog(frame, em, 1.2);
  const varre = (((t - em) / 3.4) % 1 + 1) % 1;
  const x = -180 + varre * 560;
  return (
    <div
      style={{
        position: "relative",
        opacity: p,
        transform: `translateY(${((1 - p) * 50).toFixed(2)}px) scale(${(0.94 + 0.06 * p).toFixed(4)})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "52%",
          width: 640,
          height: 640,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(125,114,248,0.42), rgba(242,95,220,0.12) 60%, transparent 100%)",
        }}
      />
      <svg viewBox="0 0 300 780" height={altura} style={{ position: "relative", overflow: "visible", display: "block" }}>
        <defs>
          <linearGradient id="g-corpo" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0E0E14" />
            <stop offset="0.15" stopColor="#2B2B37" />
            <stop offset="0.29" stopColor="#A3A3BC" />
            <stop offset="0.37" stopColor="#5C5C73" />
            <stop offset="0.62" stopColor="#272733" />
            <stop offset="0.86" stopColor="#3D3654" />
            <stop offset="1" stopColor="#0B0B11" />
          </linearGradient>
          <linearGradient id="g-tampa" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#09090D" />
            <stop offset="0.3" stopColor="#4A4A5E" />
            <stop offset="0.45" stopColor="#24242F" />
            <stop offset="1" stopColor="#09090D" />
          </linearGradient>
          <linearGradient id="g-varre" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.26" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="g-aro" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#5565FF" />
            <stop offset="0.5" stopColor="#B885ED" />
            <stop offset="1" stopColor="#F29BD9" />
          </linearGradient>
          <radialGradient id="g-sombra">
            <stop offset="0" stopColor="#000000" stopOpacity="0.75" />
            <stop offset="1" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <clipPath id="c-garrafa">
            <path d={CORPO} />
            <rect x="92" y="18" width="116" height="92" rx="24" />
          </clipPath>
        </defs>
        <ellipse cx="150" cy="754" rx="140" ry="20" fill="url(#g-sombra)" />
        <rect x="92" y="18" width="116" height="92" rx="24" fill="url(#g-tampa)" />
        <rect x="84" y="104" width="132" height="20" rx="7" fill="#1C1C26" />
        <path d={CORPO} fill="url(#g-corpo)" />
        <rect x="56" y="452" width="188" height="3" fill="url(#g-aro)" opacity="0.95" />
        <rect x="99" y="150" width="9" height="560" rx="4.5" fill="#FFFFFF" opacity="0.22" />
        <g clipPath="url(#c-garrafa)">
          <rect x={x} y="0" width="140" height="780" fill="url(#g-varre)" transform="skewX(-14)" />
        </g>
      </svg>
    </div>
  );
};

/* ----------------------------------------------------------------------------------------------
 * 100 garrafas (o estoque comprado antes da primeira venda). Ficam cinza quando "paradas".
 * ---------------------------------------------------------------------------------------------- */
export const GradeGarrafas: React.FC<{ em: number; paradoEm?: number; tamanho?: number }> = ({
  em,
  paradoEm,
  tamanho = 18,
}) => {
  const frame = useCurrentFrame();
  const cinza = paradoEm === undefined ? 0 : prog(frame, paradoEm, 0.9, SUAVE);
  const corpo = interpolateColors(cinza, [0, 1], ["#B49CFB", "#474754"]);
  const tampa = interpolateColors(cinza, [0, 1], ["#F4A6DE", "#363641"]);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(10, ${tamanho}px)`,
        gap: `${tamanho * 0.5}px ${tamanho * 0.5}px`,
      }}
    >
      {Array.from({ length: 100 }, (_, i) => {
        const p = prog(frame, em + i * 0.013, 0.35);
        return (
          <svg
            key={i}
            width={tamanho}
            height={tamanho * 1.9}
            viewBox="0 0 20 38"
            style={{ opacity: p, transform: `translateY(${((1 - p) * 8).toFixed(2)}px)` }}
          >
            <rect x="6" y="0" width="8" height="6" rx="2" fill={tampa} />
            <rect x="3" y="7" width="14" height="31" rx="4.5" fill={corpo} />
          </svg>
        );
      })}
    </div>
  );
};

/* ----------------------------------------------------------------------------------------------
 * Prateleira do fornecedor: caixas que chegam uma a uma.
 * ---------------------------------------------------------------------------------------------- */
export const Prateleira: React.FC<{ em: number; titulo?: string; nota?: string }> = ({
  em,
  titulo = "Fornecedor",
  nota = "o estoque fica aqui",
}) => {
  const frame = useCurrentFrame();
  const ALTURAS = [62, 78, 56, 70, 74, 60, 80, 66, 58, 76, 64, 72];
  return (
    <Vidro style={{ width: 540, padding: "40px 42px 34px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 14 }}>
        <IconeCaixa icone={Warehouse} tamanho={78} />
        <div>
          <div style={{ fontFamily: FONTE.sans, fontWeight: 600, fontSize: 36, letterSpacing: "-0.03em" }}>{titulo}</div>
          <div style={{ fontFamily: FONTE.sans, fontSize: 24, color: COR.suave }}>{nota}</div>
        </div>
      </div>
      {[0, 1, 2].map((fila) => (
        <div
          key={fila}
          style={{
            display: "flex",
            gap: 14,
            alignItems: "flex-end",
            height: 96,
            paddingLeft: 6,
            borderBottom: "2px solid rgba(255,255,255,0.16)",
            marginTop: 16,
          }}
        >
          {[0, 1, 2, 3].map((col) => {
            const i = fila * 4 + col;
            const p = prog(frame, em + i * 0.07, 0.5);
            return (
              <div
                key={col}
                style={{
                  position: "relative",
                  width: 100,
                  height: ALTURAS[i],
                  borderRadius: 10,
                  background: "linear-gradient(180deg, rgba(201,166,245,0.32), rgba(201,166,245,0.1))",
                  border: "1px solid rgba(201,166,245,0.38)",
                  opacity: p,
                  transform: `translateY(${((1 - p) * -26).toFixed(2)}px)`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: 0,
                    width: 14,
                    height: "100%",
                    transform: "translateX(-50%)",
                    background: "rgba(244,166,222,0.28)",
                  }}
                />
              </div>
            );
          })}
        </div>
      ))}
    </Vidro>
  );
};

/** Ícone do cliente, usado em cartões de etapas. */
export const ICONES = { ShoppingBag, Store, Warehouse, House, Package };

/** Texto em degradê (sem serifa), para números e palavras de impacto. */
export const TextoDegrade: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span
    style={{
      backgroundImage: DEGRADE,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      ...style,
    }}
  >
    {children}
  </span>
);
