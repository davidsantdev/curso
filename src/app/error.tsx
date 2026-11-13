"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CircleAlert } from "lucide-react";

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest = error instanceof Error && "digest" in error ? String(error.digest) : null;

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-5 py-16 text-center">
      <span className="bg-danger-50 text-danger-600 grid size-16 place-items-center rounded-3xl">
        <CircleAlert className="size-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-3xl font-bold">Algo deu errado</h1>
      <p className="text-ink mt-3 max-w-md text-[17px] leading-relaxed">
        Não foi possível carregar esta página agora. Tente de novo em alguns segundos.
      </p>
      {digest ? <p className="text-muted mt-2 text-sm">Código do erro: {digest}</p> : null}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => retry()} className="btn btn-primary">
          Tentar de novo
        </button>
        <Link href="/" className="btn btn-outline">
          Página inicial
        </Link>
      </div>
    </main>
  );
}
