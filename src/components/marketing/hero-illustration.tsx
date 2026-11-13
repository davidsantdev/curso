/**
 * Ilustração principal da página inicial (SVG original, sem imagens externas):
 * uma pessoa comemorando uma venda, sentada sobre caixas de pedidos.
 */

function Sparkle({ x, y, s, opacity = 0.9 }: { x: number; y: number; s: number; opacity?: number }) {
  return (
    <path
      d={`M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`}
      fill="#fff"
      opacity={opacity}
    />
  );
}

function Coin({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g filter="url(#hi-shadow-sm)">
      <circle cx={cx} cy={cy} r={r} fill="url(#hi-coin)" />
      <circle cx={cx} cy={cy} r={r * 0.72} stroke="#fff" strokeOpacity="0.6" strokeWidth={r * 0.1} />
      <text x={cx} y={cy + r * 0.33} textAnchor="middle" fontSize={r * 0.95} fontWeight="700" fill="#b96a06">
        $
      </text>
    </g>
  );
}

export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 580"
      fill="none"
      className={className}
      style={{ overflow: "visible" }}
      role="img"
      aria-label="Ilustração de uma pessoa comemorando uma venda online, sentada sobre caixas de pedidos com um notebook no colo"
    >
      <defs>
        <linearGradient id="hi-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe2cf" />
          <stop offset="1" stopColor="#f6b796" />
        </linearGradient>
        <linearGradient id="hi-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3d3580" />
          <stop offset="1" stopColor="#1c1745" />
        </linearGradient>
        <linearGradient id="hi-sweater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dcdaff" />
        </linearGradient>
        <linearGradient id="hi-pants" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5361f7" />
          <stop offset="1" stopColor="#2e36bb" />
        </linearGradient>
        <linearGradient id="hi-box" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f9d3a3" />
          <stop offset="1" stopColor="#e9a763" />
        </linearGradient>
        <linearGradient id="hi-box-lid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9cb" />
          <stop offset="1" stopColor="#f6c88f" />
        </linearGradient>
        <linearGradient id="hi-laptop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4a4594" />
          <stop offset="1" stopColor="#221e50" />
        </linearGradient>
        <linearGradient id="hi-bag" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffa1ea" />
          <stop offset="1" stopColor="#e94dcf" />
        </linearGradient>
        <linearGradient id="hi-coin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe88c" />
          <stop offset="1" stopColor="#ffae1f" />
        </linearGradient>
        <linearGradient id="hi-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#84ebb2" />
          <stop offset="1" stopColor="#27ad6e" />
        </linearGradient>
        <linearGradient id="hi-pot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffa58a" />
          <stop offset="1" stopColor="#ee6c4b" />
        </linearGradient>
        <linearGradient id="hi-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a90ff" />
          <stop offset="1" stopColor="#6c5cff" />
        </linearGradient>
        <filter id="hi-shadow" x="-30%" y="-30%" width="160%" height="190%">
          <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#2c217a" floodOpacity="0.28" />
        </filter>
        <filter id="hi-shadow-sm" x="-30%" y="-30%" width="160%" height="190%">
          <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#2c217a" floodOpacity="0.24" />
        </filter>
      </defs>

      {/* Sombra no chão */}
      <ellipse cx="330" cy="546" rx="250" ry="20" fill="#2c217a" opacity="0.2" />

      <Sparkle x={226} y={84} s={12} />
      <Sparkle x={560} y={120} s={9} opacity={0.85} />
      <Sparkle x={50} y={410} s={7} opacity={0.75} />

      {/* Cartão de gráfico flutuando */}
      <g transform="translate(36 150) rotate(-8)">
        <g className="animate-float-slow">
          <rect width="152" height="118" rx="20" fill="#fff" filter="url(#hi-shadow)" />
          <rect x="18" y="18" width="58" height="8" rx="4" fill="#d6d2ff" />
          <rect x="18" y="32" width="36" height="6" rx="3" fill="#eceaff" />
          <rect x="20" y="76" width="16" height="24" rx="4" fill="url(#hi-bar)" opacity="0.45" />
          <rect x="44" y="66" width="16" height="34" rx="4" fill="url(#hi-bar)" opacity="0.6" />
          <rect x="68" y="72" width="16" height="28" rx="4" fill="url(#hi-bar)" opacity="0.75" />
          <rect x="92" y="56" width="16" height="44" rx="4" fill="url(#hi-bar)" opacity="0.9" />
          <rect x="116" y="44" width="16" height="56" rx="4" fill="#f25fdc" />
        </g>
      </g>

      {/* Caixa pequena com plantinha */}
      <g transform="rotate(-5 156 470)">
        <ellipse cx="156" cy="352" rx="13" ry="30" fill="url(#hi-leaf)" />
        <ellipse cx="136" cy="366" rx="11" ry="25" transform="rotate(-30 136 366)" fill="url(#hi-leaf)" />
        <ellipse cx="176" cy="366" rx="11" ry="25" transform="rotate(30 176 366)" fill="url(#hi-leaf)" />
        <path d="M130 382h52l-6 30a6 6 0 0 1-6 5h-28a6 6 0 0 1-6-5z" fill="url(#hi-pot)" />
        <rect x="126" y="376" width="60" height="12" rx="6" fill="#ffb9a2" />
        <rect x="94" y="424" width="124" height="110" rx="16" fill="url(#hi-box)" />
        <rect x="86" y="410" width="140" height="32" rx="13" fill="url(#hi-box-lid)" />
        <rect x="144" y="410" width="24" height="58" rx="4" fill="#fff3df" opacity="0.9" />
      </g>

      {/* Sacola de compras */}
      <g transform="rotate(6 522 476)">
        <path d="M498 426v-14a24 24 0 0 1 48 0v14" stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity="0.95" />
        <path d="M474 424h96l8 100a12 12 0 0 1-12 13h-88a12 12 0 0 1-12-13z" fill="url(#hi-bag)" />
        <path d="M474 424h96l1.6 20h-99.2z" fill="#fff" opacity="0.22" />
        <circle cx="522" cy="490" r="19" fill="#fff" opacity="0.96" />
        <path d="M513 490l6 6 12-13" stroke="#e94dcf" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Caixa grande */}
      <rect x="196" y="356" width="268" height="180" rx="22" fill="url(#hi-box)" />
      <path d="M418 372h46v142a22 22 0 0 1-22 22h-24z" fill="#c97b34" opacity="0.2" />
      <rect x="184" y="338" width="292" height="42" rx="17" fill="url(#hi-box-lid)" />
      <rect x="312" y="338" width="36" height="92" rx="5" fill="#fff3df" opacity="0.92" />
      <rect x="220" y="462" width="80" height="50" rx="9" fill="#fff" opacity="0.95" />
      <g fill="#2a2459" opacity="0.8">
        <rect x="231" y="472" width="4" height="20" />
        <rect x="239" y="472" width="2" height="20" />
        <rect x="245" y="472" width="6" height="20" />
        <rect x="255" y="472" width="2" height="20" />
        <rect x="261" y="472" width="4" height="20" />
        <rect x="269" y="472" width="2" height="20" />
        <rect x="275" y="472" width="5" height="20" />
      </g>
      <rect x="231" y="498" width="44" height="4" rx="2" fill="#cfcbe8" />

      {/* Pernas */}
      <rect x="262" y="350" width="136" height="54" rx="27" fill="url(#hi-pants)" />
      <rect x="268" y="372" width="50" height="104" rx="24" fill="url(#hi-pants)" />
      <rect x="342" y="372" width="50" height="104" rx="24" fill="url(#hi-pants)" />
      <rect x="270" y="454" width="46" height="20" rx="8" fill="#eceaff" />
      <rect x="344" y="454" width="46" height="20" rx="8" fill="#eceaff" />
      {/* Tênis */}
      <rect x="256" y="466" width="72" height="38" rx="19" fill="#fff" />
      <rect x="256" y="490" width="72" height="14" rx="7" fill="#c9ccff" />
      <rect x="276" y="476" width="24" height="7" rx="3.5" fill="#f25fdc" />
      <rect x="332" y="466" width="72" height="38" rx="19" fill="#fff" />
      <rect x="332" y="490" width="72" height="14" rx="7" fill="#c9ccff" />
      <rect x="360" y="476" width="24" height="7" rx="3.5" fill="#f25fdc" />

      {/* Tronco */}
      <rect x="270" y="232" width="120" height="150" rx="46" fill="url(#hi-sweater)" />
      <rect x="308" y="208" width="44" height="40" rx="16" fill="#efedff" />

      {/* Cabeça */}
      <circle cx="277" cy="172" r="10" fill="#f6b796" />
      <circle cx="383" cy="172" r="10" fill="#f6b796" />
      <circle cx="330" cy="166" r="54" fill="url(#hi-skin)" />
      <circle cx="354" cy="96" r="15" fill="url(#hi-hair)" />
      <path
        d="M274 172C266 122 292 100 330 98C370 96 396 124 386 172C382 150 368 136 350 134C336 148 306 152 286 142C279 150 275 160 274 172Z"
        fill="url(#hi-hair)"
      />
      <ellipse cx="311" cy="176" rx="5" ry="6.5" fill="#2a2459" />
      <ellipse cx="349" cy="176" rx="5" ry="6.5" fill="#2a2459" />
      <circle cx="312.6" cy="173.6" r="1.7" fill="#fff" />
      <circle cx="350.6" cy="173.6" r="1.7" fill="#fff" />
      <circle cx="297" cy="193" r="9" fill="#ff9fb5" opacity="0.55" />
      <circle cx="363" cy="193" r="9" fill="#ff9fb5" opacity="0.55" />
      <path d="M316 194Q330 209 344 194" stroke="#2a2459" strokeWidth="4" strokeLinecap="round" />

      {/* Notebook no colo */}
      <rect x="246" y="282" width="168" height="98" rx="14" fill="url(#hi-laptop)" filter="url(#hi-shadow-sm)" />
      <rect x="253" y="289" width="154" height="84" rx="9" stroke="#fff" strokeOpacity="0.08" strokeWidth="2" />
      <rect x="318" y="313" width="10" height="27" rx="5" transform="rotate(-24 323 326.5)" fill="#35d6c6" />
      <rect x="331" y="310" width="10" height="31" rx="5" transform="rotate(24 336 325.5)" fill="#f25fdc" opacity="0.95" />
      <rect x="232" y="374" width="196" height="14" rx="7" fill="#dfe0ff" />

      {/* Braço apoiado no notebook */}
      <path d="M286 258C262 280 250 306 258 336" stroke="#f3f1ff" strokeWidth="30" strokeLinecap="round" />
      <circle cx="258" cy="342" r="15" fill="url(#hi-skin)" />

      {/* Braço levantado com o celular */}
      <path d="M376 256C404 250 428 232 446 174" stroke="#f3f1ff" strokeWidth="30" strokeLinecap="round" />
      <g transform="rotate(12 458 122)">
        <rect x="438" y="88" width="42" height="70" rx="10" fill="#221e50" />
        <rect x="442" y="93" width="34" height="60" rx="7" fill="#fff" />
        <circle cx="459" cy="116" r="10" fill="#14b8a0" />
        <path d="M454.5 116l3.2 3.2 6-6.4" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="449" y="132" width="20" height="4" rx="2" fill="#d6d2ff" />
        <rect x="452" y="140" width="14" height="4" rx="2" fill="#eceaff" />
      </g>
      <circle cx="448" cy="162" r="16" fill="url(#hi-skin)" />

      {/* Moedas */}
      <g className="animate-float">
        <Coin cx={572} cy={306} r={26} />
      </g>
      <g className="animate-float-slow">
        <Coin cx={92} cy={318} r={17} />
        <Coin cx={610} cy={392} r={13} />
      </g>

      {/* Aviso de venda */}
      <g transform="translate(470 192) rotate(4)">
        <g className="animate-float">
          <rect width="164" height="62" rx="18" fill="#fff" filter="url(#hi-shadow)" />
          <circle cx="31" cy="31" r="17" fill="#e6faf6" />
          <path d="M23.5 31.5l5 5 9.5-10.5" stroke="#0d9482" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="58" y="27" fill="#15154d" fontSize="14.5" fontWeight="700">
            Nova venda!
          </text>
          <text x="58" y="45" fill="#4b4b72" fontSize="13" fontWeight="500">
            + R$ 129,90
          </text>
        </g>
      </g>
    </svg>
  );
}
