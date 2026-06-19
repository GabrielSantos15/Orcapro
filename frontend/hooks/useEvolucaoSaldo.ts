import { Transacao } from "@/interfaces/Transacao";

interface DadoEvolucao {
  data: string;
  receita: number;
  despesa: number;
  saldo: number;
}

export function useEvolucaoSaldo(transacoes: Transacao[], saldoInicial: number = 0) {
  const transacoesOrdenadas = [...transacoes].sort(
    (a, b) => new Date(a.dataTransacao).getTime() - new Date(b.dataTransacao).getTime()
  );

  const dadosPorData = transacoesOrdenadas.reduce((acc: DadoEvolucao[], transacao) => {
    const dataFormatada = new Date(transacao.dataTransacao).toLocaleDateString("pt-BR");
    
    const isEntrada = transacao.categoria?.tipo === "ENTRADA";
    const valor = isEntrada ? transacao.valor : -transacao.valor;

    const existente = acc.find((item) => item.data === dataFormatada);

    if (existente) {
      if (isEntrada) {
        existente.receita += transacao.valor;
      } else {
        existente.despesa += transacao.valor;
      }
      existente.saldo += valor;
    } else {
      const saldoAnterior = acc.length > 0 ? acc[acc.length - 1].saldo : saldoInicial;
      acc.push({
        data: dataFormatada,
        receita: isEntrada ? transacao.valor : 0,
        despesa: !isEntrada ? transacao.valor : 0,
        saldo: saldoAnterior + valor,
      });
    }

    return acc;
  }, []);

  return dadosPorData;
}
