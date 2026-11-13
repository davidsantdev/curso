/**
 * Gráfico de colunas simples (uma série), feito em HTML/CSS.
 *
 * Segue as regras de visualização do projeto:
 * - uma cor só (a série é uma só, então não há legenda — o título diz o que é);
 * - colunas finas (até 24px), canto arredondado só no topo, base reta;
 * - linhas de grade finas e discretas; rótulo só no maior valor;
 * - dica (tooltip) ao passar o mouse ou focar com o teclado;
 * - tabela com todos os valores logo abaixo, para quem prefere ler os números.
 */

type Point = { day: string; value: number };

const dayLabel = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "UTC" });
const dayLong = new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit", month: "short", timeZone: "UTC" });

function toDate(day: string) {
  return new Date(`${day}T12:00:00Z`);
}

/** Topo "redondo" do eixo: 0, 1, 2, 5, 10, 20, 50… */
function niceMax(value: number): number {
  if (value <= 4) return 4;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  for (const step of [1, 2, 2.5, 5, 10]) {
    if (value <= step * magnitude) return step * magnitude;
  }
  return 10 * magnitude;
}

export function ColumnChart({ title, data, unit }: { title: string; data: Point[]; unit: [string, string] }) {
  const max = niceMax(Math.max(0, ...data.map((point) => point.value)));
  const ticks = [max, max / 2, 0];
  const peak = data.reduce((best, point) => (point.value > best.value ? point : best), data[0] ?? { day: "", value: 0 });
  const total = data.reduce((sum, point) => sum + point.value, 0);
  const describe = (value: number) => `${value} ${value === 1 ? unit[0] : unit[1]}`;

  return (
    <figure className="card p-6">
      <figcaption className="flex items-baseline justify-between gap-4">
        <span className="text-navy-900 text-[16px] font-semibold">{title}</span>
        <span className="text-muted text-sm">{describe(total)} em 14 dias</span>
      </figcaption>

      <div className="mt-6 flex gap-3">
        {/* Eixo Y */}
        <div className="text-muted flex h-40 flex-col justify-between text-right text-xs tabular-nums" aria-hidden="true">
          {ticks.map((tick) => (
            <span key={tick} className="-translate-y-1/2 leading-none first:translate-y-0 last:translate-y-0">
              {Number.isInteger(tick) ? tick : tick.toFixed(1)}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          {/* Área do gráfico */}
          <div className="relative h-40" aria-hidden="true">
            {ticks.map((tick, index) => (
              <div
                key={tick}
                className="bg-line absolute inset-x-0 h-px"
                style={{ top: `${(index / (ticks.length - 1)) * 100}%` }}
              />
            ))}
            <div className="absolute inset-0 flex items-end">
              {data.map((point) => {
                const height = max > 0 ? (point.value / max) * 100 : 0;
                const isPeak = point.value > 0 && point.day === peak.day;
                return (
                  <div
                    key={point.day}
                    tabIndex={0}
                    className="group relative flex h-full flex-1 items-end justify-center outline-none"
                  >
                    {/* Coluna */}
                    <div
                      className="bg-brand-500 group-hover:bg-brand-600 group-focus-visible:bg-brand-600 w-full max-w-6 rounded-t-[4px] transition-colors"
                      style={{ height: `${height}%`, minHeight: point.value > 0 ? 3 : 0 }}
                    />
                    {/* Rótulo só no pico */}
                    {isPeak ? (
                      <span
                        className="text-navy-900 absolute text-xs font-semibold tabular-nums"
                        style={{ bottom: `calc(${height}% + 4px)` }}
                      >
                        {point.value}
                      </span>
                    ) : null}
                    {/* Dica */}
                    <span className="bg-navy-900 pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 rounded-lg px-2.5 py-1.5 text-xs whitespace-nowrap text-white shadow-lg group-hover:block group-focus-visible:block">
                      {dayLong.format(toDate(point.day))}: <strong className="font-semibold">{describe(point.value)}</strong>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Eixo X: um rótulo a cada 2 dias */}
          <div className="text-muted mt-2 flex text-[11px] tabular-nums" aria-hidden="true">
            {data.map((point, index) => (
              <span key={point.day} className="flex-1 text-center">
                {index % 2 === data.length % 2 ? "" : dayLabel.format(toDate(point.day))}
              </span>
            ))}
          </div>
        </div>
      </div>

      <details className="mt-4">
        <summary className="text-brand-600 hover:text-brand-700 cursor-pointer text-sm font-medium">Ver tabela</summary>
        <table className="table-base mt-3">
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr>
              <th scope="col">Dia</th>
              <th scope="col" className="text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((point) => (
              <tr key={point.day}>
                <td>{dayLong.format(toDate(point.day))}</td>
                <td className="text-navy-900 text-right tabular-nums">{point.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
