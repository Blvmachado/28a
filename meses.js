/* ============================================================
   MESES — renderização dos eventos agrupados por dia.
   Depende de dados.js (EVENTOS, MESES, nf, escapar, diaPorExtenso)
   e de comum.js (SELO).
   Usado pela Timeline e pelas páginas de região: uma implementação
   só, para os dois lugares nunca mostrarem o mesmo evento diferente.
   ============================================================ */

function cartaoEvento(e){
  // Sem foto, entra o selo heráldico. Nunca um aviso de ausência:
  // numa vitrine pública, "aguardando" lê como buraco.
  const fotos = (e.fotos && e.fotos.length) ? blocoFotos(e) : '';
  const partilha = e.mesmoDeslocamento
    ? '<p class="marca-partilha">Mesmo deslocamento do dia</p>'
    : (e.viagem && !e.km)
      ? '<p class="marca-partilha">Parte da viagem de ' + escapar(e.viagem) + '</p>' : '';
  // Sem organização vinculada, a linha da sede não aparece — melhor o
  // silêncio que um travessão anunciando ausência.
  const sede = e.sede ? '<p class="sede-ev">' + escapar(e.sede) + '</p>' : '';
  return '<li class="evento" data-evento>' +
           '<div class="selo">' + SELO + '</div>' +
           '<div class="corpo-ev">' +
             '<h3>' + escapar(e.evento) + '</h3>' + sede +
             '<p class="cidade-ev">' + escapar(e.cidade) + '/' + uf(e) + '</p>' +
             partilha + fotos +
           '</div>' +
         '</li>';
}

function montarMes(secao){
  const chave = secao.dataset.mes;                 // "2026-07"
  const [ano, mes] = chave.split('-');
  const doMes = EVENTOS.filter(e => e.data.slice(0, 7) === chave)
                       .sort((a, b) => a.data.localeCompare(b.data));
  if (!doMes.length) return;

  const kmMes = doMes.reduce((t, e) => t + e.km, 0);
  const nomeMes = MESES[Number(mes) - 1];

  const porDia = new Map();
  doMes.forEach(e => {
    if (!porDia.has(e.data)) porDia.set(e.data, []);
    porDia.get(e.data).push(e);
  });

  const dias = [...porDia.entries()].map(([data, lista]) => {
    const km = lista.reduce((t, e) => t + e.km, 0);
    const principal = lista.find(e => !e.mesmoDeslocamento) || lista[0];
    const rotuloData = principal.rotulo || diaPorExtenso(data);
    // "Sedes" deixou de servir de contagem: o dia pode ter evento sem
    // organização vinculada. Conta-se o que há de fato — eventos.
    const varias = lista.length > 1
      ? ' <span class="dia-km">' + lista.length + ' eventos</span>' : '';
    // Dia sem estrada — evento na própria cidade — não anuncia "0 km".
    // Dia do meio de uma viagem contínua: o km já foi lançado no primeiro.
    const selo = km > 0 ? nf.format(km) + ' km'
               : principal.viagem ? 'mesma viagem' : 'evento local';
    return '<li class="dia" data-dia>' +
             '<div class="dia-topo">' +
               '<span class="dia-data">' + escapar(rotuloData) + '</span>' +
               '<span class="dia-km">' + selo + '</span>' + varias +
             '</div>' +
             '<p class="dia-percurso">' + escapar(principal.percurso) + '</p>' +
             '<ul class="eventos">' + lista.map(cartaoEvento).join('') + '</ul>' +
           '</li>';
  }).join('');

  secao.innerHTML =
    '<header class="capa-mes">' +
      '<div>' +
        '<p class="nome-mes">' + nomeMes + ' de ' + ano + '</p>' +
        '<p class="saldo-mes"><b>' + nf.format(kmMes) + ' km</b> em ' +
          doMes.length + (doMes.length > 1 ? ' eventos' : ' evento') +
          ', ' + porDia.size + (porDia.size > 1 ? ' dias' : ' dia') + ' de estrada</p>' +
      '</div>' +
    '</header>' +
    '<ol class="dias">' + dias + '</ol>';
}

/* Um capítulo por mês que exista nos dados, em ordem cronológica.
   Mês novo em EVENTOS = capítulo novo e item de menu novo, sem tocar
   no HTML. */
