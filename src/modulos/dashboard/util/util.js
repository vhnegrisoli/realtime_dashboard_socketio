const JANEIRO_NUMERO = "01";
const JANEIRO_ABREVIADO = "Jan";
const FEVEREIRO_NUMERO = "02";
const FEVEREIRO_ABREVIADO = "FEv";
const MARCO_NUMERO = "03";
const MARCO_ABREVIADO = "Mar";
const ABRIL_NUMERO = "04";
const ABRIL_ABREVIADO = "Abr";
const MAIO_NUMERO = "05";
const MAIO_ABREVIADO = "Mai";
const JUNHO_NUMERO = "06";
const JUNHO_ABREVIADO = "Jun";
const JULHO_NUMERO = "07";
const JULHO_ABREVIADO = "Jul";
const AGOSTO_NUMERO = "08";
const AGOSTO_ABREVIADO = "Ago";
const SETEMBRO_NUMERO = "09";
const SETEMBRO_ABREVIADO = "Set";
const OUTUBRO_NUMERO = "10";
const OUTUBRO_ABREVIADO = "Out";
const NOVEMBRO_NUMERO = "11";
const NOVEMBRO_ABREVIADO = "Nov";
const DEZEMBRO_NUMERO = "12";
const DEZEMBRO_ABREVIADO = "Dez";

export function formatarDiaMesParaMesAbreviado(dados) {
  dados.forEach((venda) => {
    if (venda._id === JANEIRO_NUMERO) {
      venda._id = JANEIRO_ABREVIADO;
    }
    if (venda._id === FEVEREIRO_NUMERO) {
      venda._id = FEVEREIRO_ABREVIADO;
    }
    if (venda._id === MARCO_NUMERO) {
      venda._id = MARCO_ABREVIADO;
    }
    if (venda._id === ABRIL_NUMERO) {
      venda._id = ABRIL_ABREVIADO;
    }
    if (venda._id === MAIO_NUMERO) {
      venda._id = MAIO_ABREVIADO;
    }
    if (venda._id === JUNHO_NUMERO) {
      venda._id = JUNHO_ABREVIADO;
    }
    if (venda._id === JULHO_NUMERO) {
      venda._id = JULHO_ABREVIADO;
    }
    if (venda._id === AGOSTO_NUMERO) {
      venda._id = AGOSTO_ABREVIADO;
    }
    if (venda._id === SETEMBRO_NUMERO) {
      venda._id = SETEMBRO_ABREVIADO;
    }
    if (venda._id === OUTUBRO_NUMERO) {
      venda._id = OUTUBRO_ABREVIADO;
    }
    if (venda._id === NOVEMBRO_NUMERO) {
      venda._id = NOVEMBRO_ABREVIADO;
    }
    if (venda._id === DEZEMBRO_NUMERO) {
      venda._id = DEZEMBRO_ABREVIADO;
    }
  });
  return dados;
}

export function formatarValoresParaDuasCasasDecimais(dados) {
  dados.forEach((item) => {
    item.value = item.value.toFixed(2);
  });
  return dados;
}
