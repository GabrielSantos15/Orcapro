import { Transacao } from "@/interfaces/Transacao";

interface DadoEvolucao {
  data: string;
  receita: number;
  despesa: number;
  saldo: number;
}

export function useEvolucaoSaldo(transacoes: Transacao[], saldoInicial: number = 0) {
  // Ordena as transações por data
  const transacoesOrdenadas = [...transacoes].sort(
    (a, b) => new Date(a.dataTransacao).getTime() - new Date(b.dataTransacao).getTime()
  );

  // Agrupa por data e calcula receita, despesa e saldo acumulado
  const dadosPorData = transacoesOrdenadas.reduce((acc: DadoEvolucao[], transacao) => {
    const dataFormatada = new Date(transacao.dataTransacao).toLocaleDateString("pt-BR");
    
    // Determina se é receita ou despesa
    const isReceita = transacao.categoria?.tipo === "RECEITA";
    const valor = isReceita ? transacao.valor : -transacao.valor;

    // Encontra se já existe entrada para essa data
    const existente = acc.find((item) => item.data === dataFormatada);

    if (existente) {
      // Atualiza a entrada existente
      if (isReceita) {
        existente.receita += transacao.valor;
      } else {
        existente.despesa += transacao.valor;
      }
      existente.saldo += valor;
    } else {
      // Cria nova entrada
      const saldoAnterior = acc.length > 0 ? acc[acc.length - 1].saldo : saldoInicial;
      acc.push({
        data: dataFormatada,
        receita: isReceita ? transacao.valor : 0,
        despesa: !isReceita ? transacao.valor : 0,
        saldo: saldoAnterior + valor,
      });
    }

    return acc;
  }, []);

  return dadosPorData;
}
