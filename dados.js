/* ============================================================
   DADOS E CÁLCULO — compartilhados por todas as páginas do site.
   Carregado por: index, timeline, alcance, regiao, fototeca,
   paramaconicas. Editar aqui muda o site inteiro de uma vez.
   ============================================================ */

/* ============================================================
   DADOS — fonte única da vitrine.
   Acrescentar uma visita = acrescentar UMA entrada aqui.
   Todo número exibido na página deriva deste bloco.

   Campos:
     data      ISO. Eventos de vários dias usam a data de início:
               o relatório conta o congresso inteiro como um dia.
     rotulo    Opcional. Texto de data exibido, quando difere de `data`.
     sede      Organização vinculada ao evento — Capítulo, Castelo,
               Bethel, Priorado — com o nome oficial dos mapas do
               GCESP. `null` quando o evento não tem organização
               vinculada: congressos, desfiles, participações
               institucionais ou cívicas. As páginas omitem a linha
               da sede nesses casos, e a esteira do mapa os ignora.
     ra        Número da Região Administrativa. `null` para evento
               fora de São Paulo, que não pertence à divisão
               administrativa do GCESP.
     uf        Opcional. Sigla do estado, quando não é "SP".
     conta     Se acende a região no mapa. Falso para evento de
               outra Ordem, visita institucional e cidade de passagem.
     km        Quilometragem do DIA. Quando o dia tem mais de uma
               sede, o km vai só na primeira; as demais levam 0.
               Evento na própria cidade do MCR não gera km: 0.
     mesmoDeslocamento  Marca as sedes seguintes do mesmo dia.
     viagem    Opcional. Rótulo de uma viagem contínua de vários dias
               (ex.: "18 a 20 de setembro"). O km total vai no primeiro
               dia; os dias seguintes levam 0 e aparecem como "mesma
               viagem" em vez de "evento local".
     ordem     Ordem a que o evento pertence. Separa o que `conta`
               não distingue: evento de outra Ordem (Filhas de Jó)
               versus visita institucional que é DeMolay mas não
               acende região. Alimenta a página de paramaçônicas.
     fotos     Vazio hoje; preenchido ao longo da gestão.
   ============================================================ */
const EVENTOS = [
  { data:"2026-07-09", evento:"Instalação dos Oficiais",
    sede:"Bethel Flores de Lis nº 30", cidade:"Itapeva", ra:28, conta:false,
    percurso:"Itapeva (evento local)", km:10, ordem:"Filhas de Jó", fotos:[
      { arquivo:"Registro Fotográfico/2026-07-09 — Itapeva — Flores de Lis 30 — capa.jpg", capa:true },
      { arquivo:"Registro Fotográfico/2026-07-09 — Itapeva — Flores de Lis 30 — 01.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-09 — Itapeva — Flores de Lis 30 — 02.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-09 — Itapeva — Flores de Lis 30 — 03.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-09 — Itapeva — Flores de Lis 30 — 04.jpg" }
    ] },

  { data:"2026-07-11", evento:"Iniciação à Ordem DeMolay",
    sede:"Capítulo Guardiões da Coroa nº 594", cidade:"Capão Bonito", ra:28, conta:true,
    percurso:"Itapeva → Capão Bonito → Itapeva", km:142, ordem:"DeMolay", fotos:[
      { arquivo:"Registro Fotográfico/2026-07-11 — Capão Bonito — Guardiões da Coroa 594 — capa.jpg", capa:true },
      { arquivo:"Registro Fotográfico/2026-07-11 — Capão Bonito — Guardiões da Coroa 594 — 01.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-11 — Capão Bonito — Guardiões da Coroa 594 — 02.jpg" }
    ] },

  { data:"2026-07-17", evento:"Abertura da Grande Sessão das Filhas de Jó do Estado de São Paulo",
    sede:"Grande Bethel do Estado de São Paulo", cidade:"São Carlos", ra:14, conta:false,
    percurso:"Itapeva → São Carlos", km:357, ordem:"Filhas de Jó", fotos:[
      { arquivo:"Registro Fotográfico/2026-07-17 — São Carlos — Grande Bethel — capa.jpg", capa:true },
      { arquivo:"Registro Fotográfico/2026-07-17 — São Carlos — Grande Bethel — 01.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-17 — São Carlos — Grande Bethel — 02.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-17 — São Carlos — Grande Bethel — 03.jpg" }
    ] },

  { data:"2026-07-18", evento:"Investidura do Grau Chevalier",
    sede:"Capítulo Grandes Lagos nº 1080", cidade:"Ilha Solteira", ra:36, conta:true,
    percurso:"São Carlos → Araraquara → Ilha Solteira", km:472, ordem:"DeMolay", fotos:[
      { arquivo:"Registro Fotográfico/2026-07-18 — Ilha Solteira — Grandes Lagos 1080 — capa.jpg", capa:true },
      { arquivo:"Registro Fotográfico/2026-07-18 — Ilha Solteira — Grandes Lagos 1080 — 01.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-18 — Ilha Solteira — Grandes Lagos 1080 — 02.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-18 — Ilha Solteira — Grandes Lagos 1080 — 03.jpg" }
    ] },

  { data:"2026-07-19", evento:"Instalação do Grande Conselho Guardião e do Grande Bethel das Filhas de Jó do Estado de São Paulo",
    sede:"Grande Conselho Guardião e Grande Bethel do Estado de São Paulo", cidade:"São Carlos", ra:14, conta:false,
    percurso:"Ilha Solteira → Araraquara → São Carlos → Itapeva", km:815, ordem:"Filhas de Jó", fotos:[
      { arquivo:"Registro Fotográfico/2026-07-19 — São Carlos — Grande Conselho Guardião — capa.jpg", capa:true },
      { arquivo:"Registro Fotográfico/2026-07-19 — São Carlos — Grande Conselho Guardião — 01.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-19 — São Carlos — Grande Conselho Guardião — 02.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-19 — São Carlos — Grande Conselho Guardião — 03.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-19 — São Carlos — Grande Conselho Guardião — 04.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-19 — São Carlos — Grande Conselho Guardião — 05.jpg" }
    ] },

  { data:"2026-07-24", rotulo:"24 a 26 de julho", evento:"45º CONAMESCO",
    sede:null, cidade:"Mogi Mirim", ra:27, conta:true,
    percurso:"Itapeva → Mogi Mirim → Itapeva", km:702, ordem:"DeMolay", fotos:[
      { arquivo:"Registro Fotográfico/2026-07-24 — Mogi Mirim — CONAMESCO — capa.jpg", capa:true },
      { arquivo:"Registro Fotográfico/2026-07-24 — Mogi Mirim — CONAMESCO — 01.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-24 — Mogi Mirim — CONAMESCO — 02.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-24 — Mogi Mirim — CONAMESCO — 04.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-24 — Mogi Mirim — CONAMESCO — 05.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-24 — Mogi Mirim — CONAMESCO — 06.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-24 — Mogi Mirim — CONAMESCO — 07.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-24 — Mogi Mirim — CONAMESCO — 08.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-24 — Mogi Mirim — CONAMESCO — 09.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-24 — Mogi Mirim — CONAMESCO — 10.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-24 — Mogi Mirim — CONAMESCO — 11.jpg" },
      { arquivo:"Registro Fotográfico/2026-07-24 — Mogi Mirim — CONAMESCO — 12.jpg" }
    ] },

  { data:"2026-08-01", evento:"Instalação dos Oficiais",
    sede:"Capítulo Cavaleiros da Terra Rasgada nº 1112", cidade:"Sorocaba", ra:32, conta:true,
    percurso:"Itapeva → Sorocaba → Itapetininga → Itapeva", km:407, ordem:"DeMolay", fotos:[
      { arquivo:"Registro Fotográfico/2026-08-01 — Sorocaba — Cavaleiros da Terra Rasgada 1112 — capa.jpg", capa:true },
      { arquivo:"Registro Fotográfico/2026-08-01 — Sorocaba — Cavaleiros da Terra Rasgada 1112 — 01.jpg" }
    ] },

  { data:"2026-08-01", evento:"Instalação dos Oficiais",
    sede:"Capítulo Cavaleiros do Templo de Itapetininga nº 515", cidade:"Itapetininga", ra:28, conta:true,
    percurso:"mesmo deslocamento do dia", km:0, mesmoDeslocamento:true, ordem:"DeMolay", fotos:[
      { arquivo:"Registro Fotográfico/2026-08-01 — Itapetininga — Cavaleiros do Templo de Itapetininga 515 — capa.jpg", capa:true },
      { arquivo:"Registro Fotográfico/2026-08-01 — Itapetininga — Cavaleiros do Templo de Itapetininga 515 — 01.jpg" },
      { arquivo:"Registro Fotográfico/2026-08-01 — Itapetininga — Cavaleiros do Templo de Itapetininga 515 — 02.jpg" }
    ] },

  { data:"2026-08-02", evento:"Instalação dos Oficiais",
    sede:"Capítulo Jovens Cavaleiros de Utu-Guaçu nº 810", cidade:"Itu", ra:32, conta:true,
    percurso:"Itapeva → Itu → São Paulo", km:331, ordem:"DeMolay", fotos:[
      { arquivo:"Registro Fotográfico/2026-08-02 — Itu — Jovens Cavaleiros de Utu-Guaçu 810 — capa.jpg", capa:true },
      { arquivo:"Registro Fotográfico/2026-08-02 — Itu — Jovens Cavaleiros de Utu-Guaçu 810 — 01.jpg" },
      { arquivo:"Registro Fotográfico/2026-08-02 — Itu — Jovens Cavaleiros de Utu-Guaçu 810 — 02.jpg" },
      { arquivo:"Registro Fotográfico/2026-08-02 — Itu — Jovens Cavaleiros de Utu-Guaçu 810 — 03.jpg" }
    ] },

  { data:"2026-08-03", evento:"Visita à sede da DeMolay São Paulo",
    sede:"Grande Conselho Estadual de São Paulo", cidade:"São Paulo", ra:2, conta:false,
    percurso:"São Paulo → Itapeva", km:297, ordem:"DeMolay", fotos:[] },

  { data:"2026-08-07", evento:"Instalação dos Oficiais e Investidura à Legião de Honra",
    sede:"Capítulo União Fraterna de Tupã nº 649", cidade:"Tupã", ra:17, conta:true,
    percurso:"Itapeva → Tupã → Itapeva", km:760, ordem:"DeMolay", fotos:[
      { arquivo:"Registro Fotográfico/2026-08-07 — Tupã — União Fraterna de Tupã 649 — capa.jpg", capa:true },
      { arquivo:"Registro Fotográfico/2026-08-07 — Tupã — União Fraterna de Tupã 649 — 01.jpg" },
      { arquivo:"Registro Fotográfico/2026-08-07 — Tupã — União Fraterna de Tupã 649 — 02.jpg" }
    ] },

  { data:"2026-08-08", evento:"Instalação dos Oficiais",
    sede:"Castelo União de Itapeva nº 392", cidade:"Itapeva", ra:28, conta:true,
    percurso:"Itapeva → Itararé → Itapeva", km:134, ordem:"DeMolay", fotos:[
      { arquivo:"Registro Fotográfico/2026-08-08 — Itapeva — União de Itapeva 392 — capa.jpg", capa:true }
    ] },

  { data:"2026-08-08", evento:"Cerimônia do Dia dos Pais",
    sede:"Bethel Flores de Lis nº 30", cidade:"Itapeva", ra:28, conta:false,
    percurso:"mesmo deslocamento do dia", km:0, mesmoDeslocamento:true, ordem:"Filhas de Jó", fotos:[] },

  { data:"2026-08-08", evento:"Instalação dos Oficiais",
    sede:"Capítulo Templários da Fronteira nº 1168", cidade:"Itararé", ra:28, conta:true,
    percurso:"mesmo deslocamento do dia", km:0, mesmoDeslocamento:true, ordem:"DeMolay", fotos:[
      { arquivo:"Registro Fotográfico/2026-08-08 — Itararé — Templários da Fronteira 1168 — capa.jpg", capa:true },
      { arquivo:"Registro Fotográfico/2026-08-08 — Itararé — Templários da Fronteira 1168 — 01.jpg" },
      { arquivo:"Registro Fotográfico/2026-08-08 — Itararé — Templários da Fronteira 1168 — 02.jpg" }
    ] },

  { data:"2026-08-15", evento:"Cerimônia de Cavaleiro Ex-Templário e Convocação",
    sede:"Priorado Cavaleiros da Távola Redonda nº 54", cidade:"Campinas", ra:3, conta:true,
    percurso:"Itapeva → Campinas → Itapeva", km:564, ordem:"DeMolay", fotos:[
      { arquivo:"Registro Fotográfico/2026-08-15 — Campinas — Cavaleiros da Távola Redonda 54 — capa.jpg", capa:true },
      { arquivo:"Registro Fotográfico/2026-08-15 — Campinas — Cavaleiros da Távola Redonda 54 — 01.jpg" }
    ] },

  { data:"2026-08-16", evento:"Instalação dos Oficiais",
    sede:"Capítulo União de Itapeva nº 429", cidade:"Itapeva", ra:28, conta:true,
    percurso:"Itapeva (evento local)", km:10, ordem:"DeMolay", fotos:[
      { arquivo:"Registro Fotográfico/2026-08-16 — Itapeva — União de Itapeva 429 — capa.jpg", capa:true },
      { arquivo:"Registro Fotográfico/2026-08-16 — Itapeva — União de Itapeva 429 — 01.jpg" },
      { arquivo:"Registro Fotográfico/2026-08-16 — Itapeva — União de Itapeva 429 — 02.jpg" },
      { arquivo:"Registro Fotográfico/2026-08-16 — Itapeva — União de Itapeva 429 — 03.jpg" }
    ] },

  // Fora de São Paulo: `ra:null` e `conta:false` mantêm o congresso fora
  // da contagem de regiões e macrorregiões — ele continua somando km,
  // visita e cidade, que saem da lista inteira de eventos.
  { data:"2026-08-21", rotulo:"21 a 23 de agosto",
    evento:"CNOD — Congresso Nacional da Ordem DeMolay",
    sede:null, cidade:"Campo Grande", uf:"MS", ra:null, conta:false,
    percurso:"Itapeva → Campo Grande → Itapeva", km:2146,
    ordem:"DeMolay", fotos:[
      { arquivo:"Registro Fotográfico/2026-08-21 — Campo Grande — CNOD — capa.jpg", capa:true },
      { arquivo:"Registro Fotográfico/2026-08-21 — Campo Grande — CNOD — 01.jpg" },
      { arquivo:"Registro Fotográfico/2026-08-21 — Campo Grande — CNOD — 02.jpg" },
      { arquivo:"Registro Fotográfico/2026-08-21 — Campo Grande — CNOD — 03.jpg" },
      { arquivo:"Registro Fotográfico/2026-08-21 — Campo Grande — CNOD — 04.jpg" },
      { arquivo:"Registro Fotográfico/2026-08-21 — Campo Grande — CNOD — 05.jpg" },
      { arquivo:"Registro Fotográfico/2026-08-21 — Campo Grande — CNOD — 06.jpg" },
      { arquivo:"Registro Fotográfico/2026-08-21 — Campo Grande — CNOD — 07.jpg" },
      { arquivo:"Registro Fotográfico/2026-08-21 — Campo Grande — CNOD — 08.jpg" },
      { arquivo:"Registro Fotográfico/2026-08-21 — Campo Grande — CNOD — 09.jpg" }
    ] },

  { data:"2026-08-29", evento:"Cerimônia de Investidura",
    sede:"Priorado Crucis Signatus nº 228", cidade:"Itararé", ra:28, conta:true,
    percurso:"Itapeva → Itararé → Itapeva", km:134, ordem:"DeMolay", fotos:[] },

  { data:"2026-09-05", evento:"Cerimônia de Setembro Amarelo",
    sede:"Bethel Flores de Lis nº 30", cidade:"Itapeva", ra:28, conta:false,
    percurso:"Itapeva (evento local)", km:0, ordem:"Filhas de Jó", fotos:[] },

  { data:"2026-09-05", evento:"Palestra sobre Setembro Amarelo (em conjunto com paramaçônicas de Itapeva)",
    sede:null, cidade:"Itapeva", ra:28, conta:false,
    percurso:"Itapeva (evento local)", km:0, mesmoDeslocamento:true,
    ordem:"Paramaçônicas de Itapeva", fotos:[] },

  { data:"2026-09-07", evento:"Desfile da Independência do Brasil (Sambódromo do Anhembi)",
    sede:null, cidade:"São Paulo", ra:2, conta:false,
    percurso:"Itapeva → São Paulo → Itapeva", km:480, ordem:"DeMolay", fotos:[
      { arquivo:"Registro Fotográfico/2026-09-07 — São Paulo — Desfile da Independência — capa.jpg", capa:true },
      { arquivo:"Registro Fotográfico/2026-09-07 — São Paulo — Desfile da Independência — 01.jpg" },
      { arquivo:"Registro Fotográfico/2026-09-07 — São Paulo — Desfile da Independência — 02.jpg" },
      { arquivo:"Registro Fotográfico/2026-09-07 — São Paulo — Desfile da Independência — 03.jpg" },
      { arquivo:"Registro Fotográfico/2026-09-07 — São Paulo — Desfile da Independência — 04.jpg" },
      { arquivo:"Registro Fotográfico/2026-09-07 — São Paulo — Desfile da Independência — 05.jpg" },
      { arquivo:"Registro Fotográfico/2026-09-07 — São Paulo — Desfile da Independência — 06.jpg" }
    ] },
  // Eventos locais (Itapeva): sem quilometragem, regra de 07/09/2026.
  { data:"2026-09-12", evento:"Cerimônia de Admissão",
    sede:"Castelo União de Itapeva nº 392", cidade:"Itapeva", ra:28, conta:true,
    percurso:"Itapeva (evento local)", km:0, ordem:"DeMolay", fotos:[
      { arquivo:"Registro Fotográfico/2026-09-12 — Itapeva — União de Itapeva 392 — capa.jpg", capa:true },
      { arquivo:"Registro Fotográfico/2026-09-12 — Itapeva — União de Itapeva 392 — 01.jpg" }
    ] },

  { data:"2026-09-12", evento:"Reunião Ritualística",
    sede:"Capítulo União de Itapeva nº 429", cidade:"Itapeva", ra:28, conta:true,
    percurso:"Itapeva (evento local)", km:0, mesmoDeslocamento:true,
    ordem:"DeMolay", fotos:[
      { arquivo:"Registro Fotográfico/2026-09-12 — Itapeva — União de Itapeva 429 — capa.jpg", capa:true }
    ] },

  // Viagem contínua de 18 a 20/09: Itapeva → São Paulo → Guarujá →
  // Itupeva → Itapeva. 981 km exatos informados pelo MCR, lançados
  // inteiros no primeiro dia; os demais dias levam 0.
  { data:"2026-09-18", evento:"Visita à sede da DeMolay São Paulo",
    sede:"Grande Conselho Estadual de São Paulo", cidade:"São Paulo", ra:2, conta:false,
    percurso:"Itapeva → São Paulo → Guarujá → Itupeva → Itapeva",
    km:981, viagem:"18 a 20 de setembro", ordem:"DeMolay", fotos:[
      { arquivo:"Registro Fotográfico/2026-09-18 — São Paulo — Grande Conselho Estadual — capa.jpg", capa:true }
    ] },

  { data:"2026-09-19", evento:"Reinstalação do Capítulo",
    sede:"Capítulo Guarujá nº 1125", cidade:"Guarujá", ra:1, conta:true,
    percurso:"São Paulo → Guarujá", km:0, viagem:"18 a 20 de setembro",
    ordem:"DeMolay", fotos:[
      { arquivo:"Registro Fotográfico/2026-09-19 — Guarujá — Guarujá 1125 — capa.jpg", capa:true },
      { arquivo:"Registro Fotográfico/2026-09-19 — Guarujá — Guarujá 1125 — 01.jpg" },
      { arquivo:"Registro Fotográfico/2026-09-19 — Guarujá — Guarujá 1125 — 02.jpg" },
      { arquivo:"Registro Fotográfico/2026-09-19 — Guarujá — Guarujá 1125 — 03.jpg" },
      { arquivo:"Registro Fotográfico/2026-09-19 — Guarujá — Guarujá 1125 — 04.jpg" },
      { arquivo:"Registro Fotográfico/2026-09-19 — Guarujá — Guarujá 1125 — 05.jpg" },
      { arquivo:"Registro Fotográfico/2026-09-19 — Guarujá — Guarujá 1125 — 06.jpg" },
      { arquivo:"Registro Fotográfico/2026-09-19 — Guarujá — Guarujá 1125 — 07.jpg" }
    ] },

  { data:"2026-09-20", evento:"Fundação do Capítulo",
    sede:"Capítulo Luzes de Itupeva nº 1280", cidade:"Itupeva", ra:3, conta:true,
    percurso:"Guarujá → Itupeva → Itapeva", km:0, viagem:"18 a 20 de setembro",
    ordem:"DeMolay", fotos:[
      { arquivo:"Registro Fotográfico/2026-09-20 — Itupeva — Luzes de Itupeva 1280 — capa.jpg", capa:true },
      { arquivo:"Registro Fotográfico/2026-09-20 — Itupeva — Luzes de Itupeva 1280 — 01.jpg" },
      { arquivo:"Registro Fotográfico/2026-09-20 — Itupeva — Luzes de Itupeva 1280 — 02.jpg" },
      { arquivo:"Registro Fotográfico/2026-09-20 — Itupeva — Luzes de Itupeva 1280 — 03.jpg" },
      { arquivo:"Registro Fotográfico/2026-09-20 — Itupeva — Luzes de Itupeva 1280 — 04.jpg" },
      { arquivo:"Registro Fotográfico/2026-09-20 — Itupeva — Luzes de Itupeva 1280 — 05.jpg" },
      { arquivo:"Registro Fotográfico/2026-09-20 — Itupeva — Luzes de Itupeva 1280 — 06.jpg" }
    ] },

  { data:"2026-09-24", evento:"Cerimônia da Luz e Apresentação da Ordem DeMolay",
    sede:"Capítulo União de Itapeva nº 429", cidade:"Itapeva", ra:28, conta:true,
    percurso:"Itapeva (evento local)", km:0, ordem:"DeMolay", fotos:[
      { arquivo:"Registro Fotográfico/2026-09-24 — Itapeva — União de Itapeva 429 — capa.jpg", capa:true }
    ] }
];

/* Agrupamento oficial: 9 macrorregiões, 29 Regiões Administrativas.
   Corroborado pela ordem das camadas no KML do GCESP. */
const MACROS = {
  "A+B":[1,2,8,13,20], "C":[3,27,31],  "D+H":[4,6,10,33,36],
  "E":[5,11,15,26],    "F":[7,19],     "G":[9,24,29],
  "I":[12,17],         "J":[14,23,30], "K":[28,32]
};

const MESES = ["janeiro","fevereiro","março","abril","maio","junho",
               "julho","agosto","setembro","outubro","novembro","dezembro"];

/* ── Auxiliares compartilhados ────────────────────────────── */
const nf = new Intl.NumberFormat('pt-BR');
const calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function escapar(t){
  return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                  .replace(/"/g,'&quot;');
}
function porExtenso(iso){
  const [a, m, d] = iso.split('-').map(Number);
  return d + ' de ' + MESES[m - 1] + ' de ' + a;
}
function diaPorExtenso(iso){
  const [, m, d] = iso.split('-').map(Number);
  return Number(d) + ' de ' + MESES[m - 1];
}
/* Quase tudo acontece em São Paulo; a sigla só é escrita quando o
   evento sai do estado. */
function uf(e){ return e.uf || 'SP'; }

/* ── Navegação do site ────────────────────────────────────────
   O relatório é um livro de seis capítulos. Os três primeiros vivem
   na abertura; os demais têm página própria. Uma lista só alimenta a
   barra do topo e o menu em cartões: capítulo novo entra em um lugar
   e aparece nos dois.
   ─────────────────────────────────────────────────────────── */
const CAPITULOS = {
  abertura: { num:'01', titulo:'Abertura' },
  numeros:  { num:'02', titulo:'A Gestão em Números' },
  territorio:{ num:'03', titulo:'O Território' },
  jornada:  { num:'04', titulo:'A Jornada' },
  fototeca: { num:'05', titulo:'Fototeca' },
  registros:{ num:'06', titulo:'Registros' }
};

const NAVEGACAO = [
  { id:'inicio', num:'01', rotulo:'Abertura', arquivo:'index.html',
    titulo:'Abertura',
    resumo:'A gestão em números e o mapa do estado, com cada estrada percorrida.' },
  { id:'territorio', num:'03', rotulo:'Território', arquivo:'alcance.html',
    titulo:'O Território',
    resumo:'As macrorregiões e as Regiões Administrativas onde a 28ª esteve presente.' },
  { id:'jornada', num:'04', rotulo:'Jornada', arquivo:'timeline.html',
    titulo:'A Jornada',
    resumo:'Cada visita em ordem, mês a mês, com sede, percurso e quilometragem.' },
  { id:'fototeca', num:'05', rotulo:'Fototeca', arquivo:'fototeca.html',
    titulo:'Fototeca',
    resumo:'O registro fotográfico das cerimônias acompanhadas na gestão.' },
  { id:'registros', num:'06', rotulo:'Registros', arquivo:'paramaconicas.html',
    titulo:'Registros',
    resumo:'Presenças em cerimônias das demais Ordens paramaçônicas.' }
];

/* ============================================================
   CÁLCULO — funções puras. Nenhum total escrito à mão.
   ============================================================ */
function calcular(eventos) {
  const doMes = m => eventos.filter(e => e.data.slice(5, 7) === m);
  const somaKm = lista => lista.reduce((s, e) => s + e.km, 0);
  const contados = eventos.filter(e => e.conta);
  const ras = [...new Set(contados.map(e => e.ra))].sort((a, b) => a - b);
  const macrosAcesas = Object.keys(MACROS)
    .filter(g => MACROS[g].some(r => ras.includes(r)));
  const datas = [...new Set(eventos.map(e => e.data))].sort();

  return {
    kmJulho:  somaKm(doMes("07")),
    kmAgosto: somaKm(doMes("08")),
    kmTotal:  somaKm(eventos),
    eventos:  eventos.length,
    // O congresso de 24 a 26/07 é uma entrada só: o relatório o conta
    // como um dia de atividade, não três.
    dias:     datas.length,
    cidades:  new Set(eventos.map(e => e.cidade)).size,
    // Evento sem organização vinculada (sede null) não é uma sede.
    sedes:    new Set(eventos.filter(e => e.sede).map(e => e.sede)).size,
    regioesVisitadas: ras,
    macrosAcesas,
    macros:   macrosAcesas.length,
    macrosTotal: Object.keys(MACROS).length,
    primeiraData: datas[0],
    ultimaData:   datas[datas.length - 1]
  };
}

const DIAG = calcular(EVENTOS);
window.__DIAG = DIAG;
