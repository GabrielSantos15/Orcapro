import { Landmark } from "lucide-react";

const normalizar = (texto: string): string => {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export const listaBancosPopulares = [
  { id: "nubank", nome: "Nubank", logo: "/bancos/nubank.jpg" },
  { id: "itau", nome: "Itaú", logo: "/bancos/itau.png" },
  { id: "bradesco", nome: "Bradesco", logo: "/bancos/bradesco.png" },
  { id: "santander", nome: "Santander", logo: "/bancos/santander.jpg" },
  { id: "inter", nome: "Inter", logo: "/bancos/inter.png" },
  { id: "bb", nome: "Banco do Brasil", logo: "/bancos/banco-do-brasil.jpg" },
  { id: "caixa", nome: "Caixa", logo: "/bancos/caixa.png" },
  { id: "carteira", nome: "Carteira", logo: "/bancos/carteira.jpg" },
];

export const getLogoBanco = (nomeInstituicao: string): string => {
  const nomeLimpo = normalizar(nomeInstituicao);

  if (nomeLimpo.includes("nubank") || nomeLimpo.includes("nu ")) return "/bancos/nubank.jpg";
  if (nomeLimpo.includes("itau")) return "/bancos/itau.png";
  if (nomeLimpo.includes("bradesco")) return "/bancos/bradesco.png";
  if (nomeLimpo.includes("santander")) return "/bancos/santander.jpg";
  if (nomeLimpo.includes("inter")) return "/bancos/inter.png";
  if (nomeLimpo.includes("brasil") || nomeLimpo.includes(" bb")) return "/bancos/banco-do-brasil.jpg";
  if (nomeLimpo.includes("caixa") || nomeLimpo.includes("cef")) return "/bancos/caixa.png";
  if (nomeLimpo.includes("xp")) return "/bancos/xp.png";
  if (nomeLimpo.includes("rico")) return "/bancos/rico.webp";
  if (nomeLimpo.includes("btg") || nomeLimpo.includes("pactual")) return "/bancos/btg.png";
  if (nomeLimpo.includes("mercado pago") || nomeLimpo.includes("mercadopago")) return "/bancos/mercado-pago.png";
  if (nomeLimpo.includes("picpay") || nomeLimpo.includes("pic pay")) return "/bancos/Picpay.webp";
  if (nomeLimpo.includes("pagbank") || nomeLimpo.includes("pagseguro")) return "/bancos/pagbank.png";
  if (nomeLimpo.includes("carteira") || nomeLimpo.includes("dinheiro") || nomeLimpo.includes("especie")) return "/bancos/carteira.jpg";

  return "/bancos/default.png";
};