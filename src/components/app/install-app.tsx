"use client";

import { useEffect, useState } from "react";
import { CircleCheck, Smartphone } from "lucide-react";

/** Evento que o Chrome e o Edge disparam quando o site pode ser instalado como app. */
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Device = "unknown" | "ios" | "other";

/** Cartão "Instale o app": botão de instalar quando o navegador permite, ou o passo a passo. */
export function InstallApp() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [device, setDevice] = useState<Device>("unknown");

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(standalone);
    setDevice(/iphone|ipad|ipod/i.test(navigator.userAgent) ? "ios" : "other");

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setPromptEvent(null);
  }

  return (
    <section className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-7">
      <span className="bg-brand-50 text-brand-600 grid size-12 shrink-0 place-items-center rounded-2xl">
        <Smartphone className="size-6" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <h2 className="text-xl font-semibold">Instale o app</h2>
        {installed ? (
          <p className="text-mint-700 mt-1 flex items-center gap-2 text-[15px] font-medium">
            <CircleCheck className="size-4.5 shrink-0" aria-hidden="true" />
            O app já está instalado neste aparelho.
          </p>
        ) : promptEvent ? (
          <p className="text-ink mt-1 text-[15px] leading-relaxed">
            Tenha a plataforma na tela inicial, com um toque, como qualquer aplicativo.
          </p>
        ) : device === "ios" ? (
          <p className="text-ink mt-1 text-[15px] leading-relaxed">
            No Safari, toque em <strong className="text-navy-900 font-semibold">Compartilhar</strong> e depois em{" "}
            <strong className="text-navy-900 font-semibold">Adicionar à Tela de Início</strong>.
          </p>
        ) : (
          <p className="text-ink mt-1 text-[15px] leading-relaxed">
            Abra o menu do navegador e escolha{" "}
            <strong className="text-navy-900 font-semibold">Instalar app</strong> ou{" "}
            <strong className="text-navy-900 font-semibold">Adicionar à tela inicial</strong>. A plataforma passa a
            abrir com um toque, como qualquer aplicativo.
          </p>
        )}
      </div>

      {!installed && promptEvent ? (
        <button type="button" onClick={install} className="btn btn-primary shrink-0">
          Instalar agora
        </button>
      ) : null}
    </section>
  );
}
