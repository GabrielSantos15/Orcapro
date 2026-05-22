export function formatarDiaMes(dataISO: string) {
    const data = new Date(dataISO);
    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0");
    return `${dia}/${mes}`;
  }
