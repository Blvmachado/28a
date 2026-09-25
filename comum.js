/* ============================================================
   COMUM — a moldura e os ornamentos de todas as páginas.
   Depende de dados.js (NAVEGACAO, CAPITULOS, nf, calmo, porExtenso).
   ============================================================ */

/* Emblema oficial da 28ª Região. Substitui o placeholder "GR · 28" nos
   mesmos lugares e proporções: barra do topo, selo dos cartões sem foto
   e marca d'água da abertura. Fonte: Identidade Visual/Ativos/Emblema. */
const EMBLEMA = 'emblema/emblema-28-regiao-128.webp';
const EMBLEMA_GRANDE = 'emblema/emblema-28-regiao-640.webp';

const BRASAO = '<img class="emblema" src="' + EMBLEMA + '" alt="" ' +
  'width="128" height="128" decoding="async">';

/* O selo que ocupa o lugar da foto enquanto ela não existe. Nunca um
   aviso de ausência: numa vitrine pública, "aguardando" lê como buraco. */
const SELO = BRASAO;

/* Emblema grande, para a marca d'água da abertura. */
const MARCA_DAGUA = '<img class="emblema" src="' + EMBLEMA_GRANDE + '" alt="" ' +
  'width="640" height="640" decoding="async">';

/* Divisor heráldico: fio, losango, fio. */
const LOSANGO = '<svg viewBox="0 0 210 9" aria-hidden="true" preserveAspectRatio="none">' +
  '<line x1="0" y1="4.5" x2="92" y2="4.5" stroke="currentColor" stroke-width="1"/>' +
  '<rect x="101" y="0.6" width="7.4" height="7.4" transform="rotate(45 104.7 4.3)" ' +
  'fill="none" stroke="currentColor" stroke-width="1"/>' +
  '<line x1="118" y1="4.5" x2="210" y2="4.5" stroke="currentColor" stroke-width="1"/>' +
  '</svg>';

/* Bloco de fotos de um evento, nos cartões da Jornada, da região e dos
   registros. Mostra só a CAPA — a fotografia que o MCR escolheu para
   representar a cerimônia — e um selo com o resto, que leva ao mural.
   Empilhar todas as miniaturas aqui fazia o cartão do CONAMESCO nascer
   com doze delas; o mural é o lugar de ver tudo. */
/* Identificador estável de um evento na URL: data + sede (ou nome do
   evento, quando não há sede). Usado pela Fototeca para mostrar só as
   fotos daquela visita. */
function chaveEvento(e){ return e.data + '~' + (e.sede || e.evento); }
function linkFotosEvento(e){ return 'fototeca.html?evento=' + encodeURIComponent(chaveEvento(e)); }

function blocoFotos(e){
  if (!e.fotos || !e.fotos.length) return '<div class="selo-vazio">' + SELO + '</div>';
  const capa = e.fotos.find(f => f.capa) || e.fotos[0];
  const resto = e.fotos.length - 1;
  // A capa e o selo "+N" levam às fotos DESTA visita, não ao topo da Fototeca.
  return '<div class="fotos">' +
      '<a href="' + linkFotosEvento(e) + '"><img src="' + escapar(capa.arquivo) + '" alt="' +
        escapar(capa.legenda || e.evento) + '" loading="lazy"></a>' +
      (resto ? '<a class="mais-fotos" href="' + linkFotosEvento(e) + '">+' + resto +
               (resto > 1 ? ' fotos' : ' foto') + '</a>' : '') +
    '</div>';
}

/* Cabeçalho de capítulo — o elemento que faz páginas soltas virarem livro. */
function abreCapitulo(chave, subtitulo){
  const c = CAPITULOS[chave];
  return '<header class="abre-capitulo">' +
    '<p class="capitulo-num">' + c.num + ' &nbsp;·&nbsp; Capítulo</p>' +
    '<h1 class="titulo-capitulo">' + c.titulo + '</h1>' +
    (subtitulo ? '<p class="subtitulo-capitulo">' + subtitulo + '</p>' : '') +
  '</header>';
}

function montarMoldura(paginaAtual){
  const links = NAVEGACAO.map(p =>
    '<a href="' + p.arquivo + '"' +
    (p.id === paginaAtual ? ' aria-current="page"' : '') +
    '>' + p.rotulo + '</a>').join('');

  const moldura = document.createElement('div');
  moldura.className = 'moldura';
  moldura.innerHTML =
    '<a class="brasao" href="index.html" aria-label="Início">' +
      BRASAO + '<span>28<span class="ord">ª</span> REGIÃO</span>' +
    '</a>' +
    '<div class="trilho" role="presentation"><i data-progresso></i></div>' +
    '<button class="gaveta-btn" aria-expanded="false" aria-controls="menu-capitulos" ' +
      'aria-label="Páginas">' +
      '<svg viewBox="0 0 20 20" aria-hidden="true">' +
      '<path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" stroke-width="1.4" ' +
      'fill="none"/></svg>' +
    '</button>' +
    '<nav class="capitulos" id="menu-capitulos">' + links + '</nav>';
  document.body.insertBefore(moldura, document.body.firstChild);

  /* Barra de progresso — scaleX, nunca width (width força relayout) */
  const progresso = moldura.querySelector('[data-progresso]');
  let agendado = false;
  function pintarProgresso(){
    const rolavel = document.documentElement.scrollHeight - window.innerHeight;
    const p = rolavel > 0 ? window.scrollY / rolavel : 0;
    progresso.style.transform = 'scaleX(' + Math.min(1, Math.max(0, p)) + ')';
    agendado = false;
  }
  addEventListener('scroll', () => {
    if (!agendado) { agendado = true; requestAnimationFrame(pintarProgresso); }
  }, { passive:true });
  pintarProgresso();

  /* Gaveta (telas estreitas) */
  const btn = moldura.querySelector('.gaveta-btn');
  const menu = moldura.querySelector('#menu-capitulos');
  btn.addEventListener('click', () => {
    const aberta = menu.classList.toggle('aberta');
    btn.setAttribute('aria-expanded', String(aberta));
  });
  menu.addEventListener('click', e => {
    if (e.target.tagName === 'A'){
      menu.classList.remove('aberta');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* Contador com ease-out. Respeita movimento reduzido indo direto ao valor. */
function contarAte(el, alvo, ms){
  if (calmo){ el.textContent = nf.format(alvo); return; }
  const inicio = performance.now();
  (function passo(agora){
    const t = Math.min(1, (agora - inicio) / ms);
    const suave = 1 - Math.pow(1 - t, 3);
    el.textContent = nf.format(Math.round(alvo * suave));
    if (t < 1) requestAnimationFrame(passo);
  })(performance.now());
}

/* Revelação em cascata, usada por todas as páginas. */
function revelar(seletor){
  const obs = new IntersectionObserver((entradas, o) => {
    /* A cascata escalona quem entra JUNTO na tela, não a posição na
       lista inteira: indexando pela lista, a 73ª peça do mural saía
       com 5,8 s de atraso e parecia que a foto não tinha carregado.
       Teto de 6 passos — passado isso, cascata vira espera. */
    let i = 0;
    entradas.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.style.transitionDelay = (Math.min(i++, 6) * 70) + 'ms';
      en.target.classList.add('visivel');
      o.unobserve(en.target);
    });
  }, { threshold:.15 });
  document.querySelectorAll(seletor).forEach(el => obs.observe(el));
}

/* Rodapé institucional, idêntico em todas as páginas. */
function montarRodape(alvo){
  alvo.innerHTML =
    '<span class="losango">' + LOSANGO + '</span>' +
    '<p class="criterio">Uma Região Administrativa só é contada como visitada ' +
      'quando houve evento da Ordem DeMolay nela — capítulo, Priorado, Castelo ' +
      'ou congresso da própria Ordem. Presença em evento de outra organização, ' +
      'visita institucional a sede e cidade de passagem na rota não entram na ' +
      'contagem. Evento da Ordem realizado fora do Estado de São Paulo — como ' +
      'o Congresso Nacional — fica igualmente de fora: a divisão administrativa ' +
      'do GCESP só alcança o estado.</p>' +
    '<p class="uniao"><img src="' + EMBLEMA_GRANDE + '" alt="" style="width:120px;height:auto"></p>' +
    '<div class="assinatura">' +
      '<img class="so-impressao" data-assinatura alt="Assinatura do Mestre Conselheiro Regional">' +
      '<p class="nome">Henrique Machado</p>' +
      '<p class="cargo">Mestre Conselheiro Regional</p>' +
      '<p class="cargo">28ª Região Administrativa do Estado de São Paulo</p>' +
    '</div>' +
    '<p class="colofao">' +
      'Gestão 2026/2027 &middot; Ordem DeMolay &middot; Estado de São Paulo<br>' +
      'Período coberto: ' + porExtenso(DIAG.primeiraData) + ' a ' +
      porExtenso(DIAG.ultimaData) + ' &middot; ' + nf.format(DIAG.kmTotal) + ' km' +
    '</p>';
  // A assinatura só existe onde ela foi carregada — a home.
  const img = alvo.querySelector('[data-assinatura]');
  if (typeof ASSINATURA !== 'undefined') img.src = ASSINATURA;
  else img.remove();
}
