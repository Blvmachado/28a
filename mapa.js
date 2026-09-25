/* ============================================================
   CAPÍTULO 3 · O MAPA
   Uma única linha do tempo cronológica dirige as três coisas ao
   mesmo tempo: as rotas que se desenham, as regiões que acendem
   e o contador de quilômetros. Assim nada pode dessincronizar.
   ============================================================ */
const SEDE = 'Itapeva';                      // origem de todo deslocamento
const CIDADES = {                             // latitude, longitude
  'Itapeva':       [-23.982, -48.876],
  'Capão Bonito':  [-24.006, -48.349],
  'São Carlos':    [-22.017, -47.891],
  'Ilha Solteira': [-20.432, -51.343],
  'Mogi Mirim':    [-22.432, -46.958],
  'Sorocaba':      [-23.502, -47.458],
  'Campinas':      [-22.906, -47.061],
  'Itapetininga':  [-23.592, -48.053],
  'Itu':           [-23.264, -47.299],
  'São Paulo':     [-23.551, -46.633],
  'Tupã':          [-21.935, -50.514],
  'Itararé':       [-24.112, -49.332],
  'Guarujá':       [-23.993, -46.256],
  'Itupeva':       [-23.153, -47.058]
};

/* Mesma projeção usada para gerar os polígonos. Reprojetar com
   outra fórmula desalinharia os pontos do mapa. */
function projetar(lat, lon){
  return { x:(lon - PROJ.lon0) * PROJ.k * PROJ.esc,
           y:(PROJ.lat1 - lat) * PROJ.esc };
}

const svgMapa = document.querySelector('[data-mapa]');
const elKm    = document.querySelector('[data-km-mapa]');
const elMarco = document.querySelector('[data-marco]');
const secMapa = document.getElementById('mapa');
const NS = 'http://www.w3.org/2000/svg';

/* Linha do tempo: eventos em ordem, com km acumulado */
let acumulado = 0;
const LINHA = [...EVENTOS]
  .sort((a, b) => a.data.localeCompare(b.data))
  .map(e => { acumulado += e.km;
              return { ev:e, kmAte:acumulado }; });

/* --- desenho do mapa --- */
svgMapa.setAttribute('viewBox', VIEWBOX);

Object.keys(REGIOES).sort((a,b) => a-b).forEach(num => {
  const p = document.createElementNS(NS, 'path');
  p.setAttribute('d', REGIOES[num].d);
  p.setAttribute('class', 'ra' + (Number(num) === 28 ? ' propria' : ''));
  p.setAttribute('data-ra', num);
  const t = document.createElementNS(NS, 'title');
  t.textContent = REGIOES[num].nome;
  p.appendChild(t);
  svgMapa.appendChild(p);
});

/* Uma rota por cidade de destino, na ordem da primeira visita */
const origem = projetar(...CIDADES[SEDE]);
const rotas = new Map();
LINHA.forEach(({ ev }) => {
  if (ev.cidade === SEDE || rotas.has(ev.cidade)) return;
  // Cidade fora de São Paulo não tem lugar num mapa do estado: o evento
  // continua nos totais, mas não desenha rota nem ponto.
  if (!CIDADES[ev.cidade]) return;
  const destino = projetar(...CIDADES[ev.cidade]);
  const mx = (origem.x + destino.x) / 2, my = (origem.y + destino.y) / 2;
  const dx = destino.x - origem.x,       dy = destino.y - origem.y;
  // curvatura perpendicular: dá o gesto de estrada em vez de reta seca
  const cx = mx - dy * 0.17, cy = my + dx * 0.17;

  const linha = document.createElementNS(NS, 'path');
  linha.setAttribute('d', `M${origem.x.toFixed(1)},${origem.y.toFixed(1)} ` +
                          `Q${cx.toFixed(1)},${cy.toFixed(1)} ` +
                          `${destino.x.toFixed(1)},${destino.y.toFixed(1)}`);
  linha.setAttribute('class', 'rota');
  svgMapa.appendChild(linha);

  const ponto = document.createElementNS(NS, 'circle');
  ponto.setAttribute('cx', destino.x.toFixed(1));
  ponto.setAttribute('cy', destino.y.toFixed(1));
  ponto.setAttribute('r', 4.4);
  ponto.setAttribute('class', 'ponto');
  svgMapa.appendChild(ponto);

  // O nome da cidade NÃO entra no mapa: escrita sobre a geografia
  // briga com ela. Ele aparece na lista lateral quando a rota chega.
  const comprimento = linha.getTotalLength();
  linha.style.strokeDasharray = comprimento;
  rotas.set(ev.cidade, { linha, ponto, comprimento });
});

/* Itapeva: origem, sempre visível */
const base = document.createElementNS(NS, 'circle');
base.setAttribute('cx', origem.x.toFixed(1));
base.setAttribute('cy', origem.y.toFixed(1));
base.setAttribute('r', 6);
base.setAttribute('class', 'base');
svgMapa.appendChild(base);

/* ── Esteira das sedes ────────────────────────────────────────
   Cada sede desce para a esteira quando a linha chega ao destino.
   Como o conteúdo muda durante a rolagem, a animação não pode ser
   um keyframe de CSS (que reiniciaria com salto a cada item novo):
   a esteira é movida em JS, com o deslocamento dando a volta pelo
   módulo da largura de uma cópia.
   ───────────────────────────────────────────────────────────── */
const faixaEl = document.querySelector('[data-faixa]');
const ulFaixa = document.createElement('ul');
faixaEl.appendChild(ulFaixa);

/* Cada sede guarda o índice do evento que a estreia. */
const SEDES_ORDEM = [];
LINHA.forEach(({ ev }, i) => {
  // Evento sem organização vinculada — congresso, desfile, participação
  // institucional — não tem sede para descer à esteira.
  if (!ev.sede) return;
  if (!SEDES_ORDEM.some(x => x.sede === ev.sede))
    SEDES_ORDEM.push({ sede:ev.sede, cidade:ev.cidade, entra:i });
});

const htmlItem = (x, i) =>
  '<li data-i="' + i + '"><span class="sede">' + x.sede +
  '</span><span class="cidade">' + x.cidade + '</span></li>';

let quantasNaFaixa = -1, larguraCopia = 0, rolando = false;
let deslocamento = 0, pausada = false, ultimoQuadro = 0;

function montarFaixa(n){
  if (n === quantasNaFaixa) return;
  const cresceu = n > quantasNaFaixa;
  quantasNaFaixa = n;

  if (n <= 0){ ulFaixa.innerHTML = ''; rolando = false; return; }

  const uma = SEDES_ORDEM.slice(0, n).map(htmlItem).join('');
  ulFaixa.classList.remove('parada');
  ulFaixa.innerHTML = uma;
  larguraCopia = ulFaixa.scrollWidth;
  rolando = larguraCopia > faixaEl.clientWidth;

  if (rolando){
    // cópias suficientes para nunca abrir buraco na volta
    const copias = Math.max(2, Math.ceil(faixaEl.clientWidth / larguraCopia) + 1);
    ulFaixa.innerHTML = new Array(copias).fill(uma).join('');
    if (deslocamento <= -larguraCopia) deslocamento = 0;
  } else {
    ulFaixa.classList.add('parada');
    deslocamento = 0;
  }

  if (cresceu){
    ulFaixa.querySelectorAll('[data-i="' + (n - 1) + '"]')
           .forEach(li => li.classList.add('entrando'));
  }
}

faixaEl.addEventListener('mouseenter', () => pausada = true);
faixaEl.addEventListener('mouseleave', () => pausada = false);

function moverFaixa(ts){
  const dt = ultimoQuadro ? Math.min(.05, (ts - ultimoQuadro) / 1000) : 0;
  ultimoQuadro = ts;
  if (rolando && !pausada && !calmo && larguraCopia > 0){
    deslocamento -= 32 * dt;                       // pixels por segundo
    if (deslocamento <= -larguraCopia) deslocamento += larguraCopia;
    ulFaixa.style.transform = 'translateX(' + deslocamento.toFixed(1) + 'px)';
  }
  requestAnimationFrame(moverFaixa);
}
requestAnimationFrame(moverFaixa);

/* --- estado conforme a rolagem --- */
const regioesEl = new Map(
  [...svgMapa.querySelectorAll('[data-ra]')].map(p => [Number(p.dataset.ra), p]));

function pintarMapa(p){
  const passos = LINHA.length;
  const posicao = p * passos;                 // 0 → 16
  let kmVisivel = 0, ultimo = null;
  const acesas = new Set();
  const chegada = new Map();                  // cidade → quanto da rota desenhar

  LINHA.forEach((item, i) => {
    // cada evento tem sua janela; a rota se desenha dentro dela
    const t = Math.max(0, Math.min(1, posicao - i));
    if (t <= 0) return;
    ultimo = item;
    kmVisivel = item.kmAte;
    if (item.ev.conta) acesas.add(item.ev.ra);
    const anterior = chegada.get(item.ev.cidade) || 0;
    chegada.set(item.ev.cidade, Math.max(anterior, t));
  });

  elKm.textContent = nf.format(Math.round(kmVisivel));

  regioesEl.forEach((el, ra) => el.classList.toggle('acesa', acesas.has(ra)));

  rotas.forEach((r, cidade) => {
    const t = chegada.get(cidade) || 0;
    r.linha.style.strokeDashoffset = r.comprimento * (1 - t);
    r.ponto.style.opacity = t >= 1 ? 1 : 0;
  });

  /* Uma sede entra quando o evento que a estreia se completa — para
     as cidades com rota, isso é exatamente o instante da chegada. */
  let sedesChegadas = 0;
  SEDES_ORDEM.forEach(x => { if (posicao - x.entra >= 1) sedesChegadas++; });
  montarFaixa(sedesChegadas);

  if (ultimo){
    const e = ultimo.ev;
    elMarco.innerHTML = '<span class="quando"></span>' +
                        '<span class="oque"></span><span class="onde"></span>';
    elMarco.querySelector('.quando').textContent =
      (e.rotulo || porExtenso(e.data)) + ' · ' + e.cidade;
    elMarco.querySelector('.oque').textContent  = e.evento;
    // Sem sede, o terceiro verso do marco fica vazio em vez de "null".
    elMarco.querySelector('.onde').textContent  = e.sede || '';
  } else {
    elMarco.textContent = '';
  }
}

function progressoMapa(){
  const r = secMapa.getBoundingClientRect();
  const percorrivel = secMapa.offsetHeight - window.innerHeight;
  if (percorrivel <= 0) return 1;
  return Math.max(0, Math.min(1, -r.top / percorrivel));
}

let mapaAgendado = false;
function atualizarMapa(){
  pintarMapa(progressoMapa());
  mapaAgendado = false;
}
addEventListener('scroll', () => {
  if (!mapaAgendado) { mapaAgendado = true; requestAnimationFrame(atualizarMapa); }
}, { passive:true });
addEventListener('resize', atualizarMapa, { passive:true });

/* Sem movimento: o mapa nasce no estado final, nada se perde. */
if (calmo) pintarMapa(1); else atualizarMapa();
