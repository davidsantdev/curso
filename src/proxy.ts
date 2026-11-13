import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";

/**
 * Checagem "otimista": quem chega a uma área logada sem o cookie de sessão
 * vai direto para o login, guardando a página de destino em `?next=`.
 *
 * A verificação de verdade (sessão válida, plano, admin) acontece no servidor,
 * em cada página e em cada action — o proxy só melhora a experiência.
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const login = new URL("/entrar", request.url);
  login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/painel/:path*",
    "/trilhas/:path*",
    "/aula/:path*",
    "/conquistas/:path*",
    "/ferramentas/:path*",
    "/certificados/:path*",
    "/conta/:path*",
    "/assinatura/:path*",
    "/checkout/:path*",
    "/admin/:path*",
  ],
};
