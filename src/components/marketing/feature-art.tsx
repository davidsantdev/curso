/** Pequenas ilustrações dos cartões "por que aprender aqui" (SVG original). */

const svgProps = {
  viewBox: "0 0 160 140",
  fill: "none",
  "aria-hidden": true,
  style: { overflow: "visible" as const },
};

function Shadow({ id }: { id: string }) {
  return (
    <filter id={id} x="-40%" y="-40%" width="180%" height="200%">
      <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#4f46b4" floodOpacity="0.28" />
    </filter>
  );
}

/** Prancheta com tarefas marcadas → "Passo a passo guiado" */
export function ArtChecklist({ className }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <defs>
        <linearGradient id="fa-board" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a299ff" />
          <stop offset="1" stopColor="#6c5cff" />
        </linearGradient>
        <linearGradient id="fa-clip" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffa1ea" />
          <stop offset="1" stopColor="#e94dcf" />
        </linearGradient>
        <linearGradient id="fa-mint" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5ce6cf" />
          <stop offset="1" stopColor="#14b8a0" />
        </linearGradient>
        <Shadow id="fa-shadow-1" />
      </defs>
      <ellipse cx="80" cy="130" rx="48" ry="7" fill="#6c5cff" opacity="0.12" />
      <g transform="rotate(-7 80 72)" filter="url(#fa-shadow-1)">
        <rect x="38" y="20" width="84" height="104" rx="16" fill="url(#fa-board)" />
        <rect x="47" y="33" width="66" height="83" rx="9" fill="#fff" />
        <rect x="62" y="11" width="36" height="21" rx="9" fill="url(#fa-clip)" />
        {[52, 72].map((y) => (
          <g key={y}>
            <circle cx="60" cy={y} r="6.5" fill="#c9f4ea" />
            <path
              d={`M56.8 ${y + 0.2}l2.3 2.3 4.2-4.6`}
              stroke="#0d9482"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="72" y={y - 3.5} width="33" height="7" rx="3.5" fill="#e7e5ff" />
          </g>
        ))}
        <circle cx="60" cy="92" r="6.5" fill="#ffe0f9" />
        <rect x="72" y="88.5" width="24" height="7" rx="3.5" fill="#e7e5ff" />
      </g>
      <g className="animate-float">
        <circle cx="124" cy="100" r="20" fill="url(#fa-mint)" filter="url(#fa-shadow-1)" />
        <path d="M115 100l6.5 6.5 12-13" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** Tela com vídeo e cursor → "Aprenda fazendo" */
export function ArtPractice({ className }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <defs>
        <linearGradient id="fa-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff9be9" />
          <stop offset="1" stopColor="#7d72f8" />
        </linearGradient>
        <Shadow id="fa-shadow-2" />
      </defs>
      <ellipse cx="80" cy="130" rx="48" ry="7" fill="#6c5cff" opacity="0.12" />
      <rect x="66" y="100" width="28" height="18" fill="#cfcbff" />
      <rect x="48" y="115" width="64" height="10" rx="5" fill="#dcd9ff" />
      <rect x="20" y="22" width="120" height="84" rx="16" fill="url(#fa-screen)" filter="url(#fa-shadow-2)" />
      <circle cx="80" cy="60" r="22" fill="#fff" />
      <path d="M74.5 50v20l16-10z" fill="#6c5cff" stroke="#6c5cff" strokeWidth="3" strokeLinejoin="round" />
      <rect x="34" y="91" width="92" height="5" rx="2.5" fill="#fff" opacity="0.4" />
      <rect x="34" y="91" width="54" height="5" rx="2.5" fill="#fff" />
      <g className="animate-float">
        <path
          d="M112 82l7 28 7-10 12-2.5z"
          fill="#15154d"
          stroke="#fff"
          strokeWidth="3.5"
          strokeLinejoin="round"
          filter="url(#fa-shadow-2)"
        />
      </g>
    </svg>
  );
}

/** Barras subindo com moeda → "Números sem mistério" */
export function ArtNumbers({ className }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <defs>
        <linearGradient id="fa-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a299ff" />
          <stop offset="1" stopColor="#6c5cff" />
        </linearGradient>
        <linearGradient id="fa-coin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe88c" />
          <stop offset="1" stopColor="#ffae1f" />
        </linearGradient>
        <Shadow id="fa-shadow-3" />
      </defs>
      <ellipse cx="80" cy="130" rx="48" ry="7" fill="#6c5cff" opacity="0.12" />
      <g filter="url(#fa-shadow-3)">
        <rect x="26" y="84" width="22" height="34" rx="6" fill="url(#fa-bar)" opacity="0.5" />
        <rect x="56" y="64" width="22" height="54" rx="6" fill="url(#fa-bar)" opacity="0.75" />
        <rect x="86" y="40" width="22" height="78" rx="6" fill="url(#fa-bar)" />
      </g>
      <rect x="18" y="116" width="100" height="6" rx="3" fill="#e7e5ff" />
      <path d="M28 66L58 46L96 20" stroke="#f25fdc" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M81 18.5l16 1.2-3 15.6" stroke="#f25fdc" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <g className="animate-float">
        <circle cx="126" cy="88" r="23" fill="url(#fa-coin)" filter="url(#fa-shadow-3)" />
        <circle cx="126" cy="88" r="16.5" stroke="#fff" strokeOpacity="0.6" strokeWidth="2.4" />
        <text x="126" y="95.5" textAnchor="middle" fontSize="21" fontWeight="700" fill="#b96a06">
          $
        </text>
      </g>
    </svg>
  );
}
