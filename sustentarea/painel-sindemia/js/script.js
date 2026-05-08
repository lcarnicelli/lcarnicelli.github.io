const tabMap = { nutri: 'active-nutri', clima: 'active-clima', integ: 'active-integ' };

function switchTab(id, btn) {
  document.querySelectorAll('.tab-pane-custom').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-main .nav-link').forEach(b => b.classList.remove('active-nutri', 'active-clima', 'active-integ'));
  document.getElementById('tab-' + id).classList.add('active');
  btn.classList.add(tabMap[id]);
  tabAtual = id;
  if (id === 'nutri') setTimeout(() => { if (mapInstance) mapInstance.invalidateSize(); }, 50);
  if (id === 'clima') {
    if (!mapClimaInicializado) {
      mapClimaInicializado = true;
      inicializarMapaClima();
      setTimeout(() => { aplicarTemaClima(); }, 200);
    } else {
      setTimeout(() => { mapClimaInstance.invalidateSize(); }, 50);
    }
  }
}

const anos = [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019];

const dadosJson = [
  { ano:'2008', desn:'0,13', exce_peso:'0,09', gee_pessoa:'17,84005' },
  { ano:'2009', desn:'0,13', exce_peso:'0,08', gee_pessoa:'13,55485' },
  { ano:'2010', desn:'0,12', exce_peso:'0,08', gee_pessoa:'13,88444' },
  { ano:'2011', desn:'0,12', exce_peso:'0,08', gee_pessoa:'14,13573' },
  { ano:'2012', desn:'0,11', exce_peso:'0,08', gee_pessoa:'14,78926' },
  { ano:'2013', desn:'0,11', exce_peso:'0,07', gee_pessoa:'16,30574' },
  { ano:'2014', desn:'0,11', exce_peso:'0,08', gee_pessoa:'15,42568' },
  { ano:'2015', desn:'0,11', exce_peso:'0,08', gee_pessoa:'16,13953' },
  { ano:'2016', desn:'0,11', exce_peso:'0,08', gee_pessoa:'15,52818' },
  { ano:'2017', desn:'0,11', exce_peso:'0,08', gee_pessoa:'14,07522' },
  { ano:'2018', desn:'0,09', exce_peso:'0,09', gee_pessoa:'13,74363' },
  { ano:'2019', desn:'0,11', exce_peso:'0,11', gee_pessoa:'14,05499' },
];
const parseN = v => parseFloat(v.replace(',', '.'));
const dadosLinha = {
  desn:       dadosJson.map(d => Math.round(parseN(d.desn) * 100)),
  exce_peso:  dadosJson.map(d => Math.round(parseN(d.exce_peso) * 100)),
  gee_pessoa: dadosJson.map(d => parseN(d.gee_pessoa)),
};

const temas = {
  desnutricao: {
    linhaTitle: 'Evolução da Desnutrição',
    linhaSubtitle: 'Prevalência de desnutrição aguda por 1.000 crianças',
    mapaSubtitle: 'Índice de desnutrição por região',
    tabelaSubtitle: 'Ranking por indicador de desnutrição',
    tabelaCol3: 'Índice Desnutrição',
    tabelaCol4: 'Casos registrados',
    barrasTitle: 'Comparativo Regional — Desnutrição',
    barrasSubtitle: 'Indicadores de desnutrição por macrorregião (2019)',
    linha: {
      datasets: [
        { label: 'Desnutrição aguda',      data: dadosLinha.desn, borderColor: '#2e7d52', bg: 'rgba(46,125,82,0.08)',    dash: [] },
        { label: 'Baixo peso para idade',  data: [22.1,21.5,20.8,20.0,19.4,18.7,18.1,17.2,16.5,15.8,15.1,14.3], borderColor: '#7ecba1', bg: 'rgba(126,203,161,0.06)', dash: [5,3] },
      ]
    },
    barras: {
      labels: ['CO', 'N', 'NE', 'S/SE'],
      datasets: [
        { label: 'Média desnutrição (%)', data: [11.63, 18.87, 12.04, 8.92], bg: 'rgba(46,125,82,0.80)' },
      ]
    },
    mapa: [
      { lat: -3.7,  lng: -38.5, nome: 'Fortaleza',      idx: 0.82, cor: '#e74c3c' },
      { lat: -8.0,  lng: -34.9, nome: 'Recife',          idx: 0.79, cor: '#e74c3c' },
      { lat: -12.9, lng: -38.4, nome: 'Salvador',        idx: 0.71, cor: '#f39c12' },
      { lat: -1.4,  lng: -48.4, nome: 'Belém',           idx: 0.77, cor: '#e74c3c' },
      { lat: -15.8, lng: -47.9, nome: 'Brasília',        idx: 0.45, cor: '#2ecc71' },
      { lat: -23.5, lng: -46.6, nome: 'São Paulo',       idx: 0.38, cor: '#2ecc71' },
      { lat: -22.9, lng: -43.2, nome: 'Rio de Janeiro',  idx: 0.44, cor: '#2ecc71' },
      { lat: -30.0, lng: -51.2, nome: 'Porto Alegre',    idx: 0.31, cor: '#27ae60' },
      { lat: -19.9, lng: -43.9, nome: 'Belo Horizonte',  idx: 0.42, cor: '#2ecc71' },
      { lat: -9.9,  lng: -67.8, nome: 'Rio Branco',      idx: 0.68, cor: '#f39c12' },
    ],
    mapaLabel: 'Índice Desnutrição',
    indiceRange: [0.20, 0.95],
    casosRange:  [80, 850],
  },

  excesso: {
    linhaTitle: 'Evolução do Excesso de Peso',
    linhaSubtitle: 'Prevalência de sobrepeso e obesidade por 1.000 crianças',
    mapaSubtitle: 'Índice de excesso de peso por região',
    tabelaSubtitle: 'Ranking por indicador de excesso de peso',
    tabelaCol3: 'Índice Excesso Peso',
    tabelaCol4: 'Casos registrados',
    barrasTitle: 'Comparativo Regional — Excesso de Peso',
    barrasSubtitle: 'Indicadores de excesso de peso por macrorregião (2019)',
    linha: {
      datasets: [
        { label: 'Sobrepeso', data: dadosLinha.exce_peso, borderColor: '#e67e22', bg: 'rgba(230,126,34,0.08)', dash: [] },
        { label: 'Obesidade', data: [4.1,4.4,4.8,5.2,5.7,6.1,6.6,7.0,7.5,7.9,8.4,8.9],             borderColor: '#e74c3c', bg: 'rgba(231,76,60,0.06)',  dash: [5,3] },
      ]
    },
    barras: {
      labels: ['CO', 'N', 'NE', 'S/SE'],
      datasets: [
        { label: 'Média excesso de peso (%)', data: [9.96, 9.75, 11.83, 10.00], bg: 'rgba(230,126,34,0.80)' },
      ]
    },
    mapa: [
      { lat: -3.7,  lng: -38.5, nome: 'Fortaleza',      idx: 0.41, cor: '#2ecc71' },
      { lat: -8.0,  lng: -34.9, nome: 'Recife',          idx: 0.38, cor: '#2ecc71' },
      { lat: -12.9, lng: -38.4, nome: 'Salvador',        idx: 0.44, cor: '#2ecc71' },
      { lat: -1.4,  lng: -48.4, nome: 'Belém',           idx: 0.39, cor: '#2ecc71' },
      { lat: -15.8, lng: -47.9, nome: 'Brasília',        idx: 0.68, cor: '#f39c12' },
      { lat: -23.5, lng: -46.6, nome: 'São Paulo',       idx: 0.81, cor: '#e74c3c' },
      { lat: -22.9, lng: -43.2, nome: 'Rio de Janeiro',  idx: 0.77, cor: '#e74c3c' },
      { lat: -30.0, lng: -51.2, nome: 'Porto Alegre',    idx: 0.84, cor: '#e74c3c' },
      { lat: -19.9, lng: -43.9, nome: 'Belo Horizonte',  idx: 0.72, cor: '#e74c3c' },
      { lat: -9.9,  lng: -67.8, nome: 'Rio Branco',      idx: 0.35, cor: '#27ae60' },
    ],
    mapaLabel: 'Índice Excesso de Peso',
    indiceRange: [0.15, 0.88],
    casosRange:  [120, 980],
  },

  dupla: {
    linhaTitle: 'Evolução da Dupla Carga Nutricional',
    linhaSubtitle: 'Coexistência de desnutrição e excesso de peso por 1.000 crianças',
    mapaSubtitle: 'Índice de dupla carga por região',
    tabelaSubtitle: 'Ranking por índice de dupla carga nutricional',
    tabelaCol3: 'Índice Dupla Carga',
    tabelaCol4: 'Municípios afetados',
    barrasTitle: 'Comparativo Regional — Dupla Carga',
    barrasSubtitle: 'Indicadores de dupla carga por macrorregião (2019)',
    linha: {
      datasets: [
        { label: 'Índice Dupla Carga',  data: [14.8,15.1,15.6,16.0,16.4,16.9,17.3,17.5,17.8,18.1,18.4,18.7], borderColor: '#6a4b9a', bg: 'rgba(106,75,154,0.08)',  dash: [] },
        { label: 'Municípios em risco', data: [9.2,9.8,10.3,10.9,11.4,12.0,12.5,12.9,13.4,13.8,14.2,14.6],   borderColor: '#9c6fd6', bg: 'rgba(156,111,214,0.06)', dash: [5,3] },
      ]
    },
    barras: {
      labels: ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'],
      datasets: [
        { label: 'Dupla Carga Leve (%)',     data: [18.4,21.2,14.6,12.3,10.8], bg: 'rgba(106,75,154,0.75)' },
        { label: 'Dupla Carga Moderada (%)', data: [12.1,14.8,9.3,7.8,6.4],    bg: 'rgba(156,111,214,0.80)' },
        { label: 'Dupla Carga Grave (%)',    data: [6.3,8.1,4.2,3.1,2.4],      bg: 'rgba(231,76,60,0.70)' },
        { label: 'Pop. em Transição (%)',    data: [24.7,28.3,19.8,17.2,15.6], bg: 'rgba(248,196,60,0.80)' },
      ]
    },
    mapa: [
      { lat: -3.7,  lng: -38.5, nome: 'Fortaleza',      idx: 0.74, cor: '#e74c3c' },
      { lat: -8.0,  lng: -34.9, nome: 'Recife',          idx: 0.71, cor: '#e74c3c' },
      { lat: -12.9, lng: -38.4, nome: 'Salvador',        idx: 0.68, cor: '#f39c12' },
      { lat: -1.4,  lng: -48.4, nome: 'Belém',           idx: 0.66, cor: '#f39c12' },
      { lat: -15.8, lng: -47.9, nome: 'Brasília',        idx: 0.58, cor: '#f39c12' },
      { lat: -23.5, lng: -46.6, nome: 'São Paulo',       idx: 0.61, cor: '#f39c12' },
      { lat: -22.9, lng: -43.2, nome: 'Rio de Janeiro',  idx: 0.63, cor: '#f39c12' },
      { lat: -30.0, lng: -51.2, nome: 'Porto Alegre',    idx: 0.49, cor: '#2ecc71' },
      { lat: -19.9, lng: -43.9, nome: 'Belo Horizonte',  idx: 0.55, cor: '#f39c12' },
      { lat: -9.9,  lng: -67.8, nome: 'Rio Branco',      idx: 0.62, cor: '#f39c12' },
    ],
    mapaLabel: 'Índice Dupla Carga',
    indiceRange: [0.25, 0.90],
    casosRange:  [60, 700],
  }
};

let tabAtual  = 'nutri';
let temaAtual = 'desnutricao';

const tabColors = { nutri: '#2e7d52', clima: '#1a5f8a', integ: '#6a4b9a' };

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ── Charts ── */
const chartLinhaInst = new Chart(document.getElementById('chartLinha'), {
  type: 'line',
  data: { labels: anos, datasets: [] },
  options: {
    responsive: true, maintainAspectRatio: false, animation: { duration: 500 },
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'DM Sans', size: 11 } } },
      y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'DM Sans', size: 11 }, callback: v => v + '%' }, min: 0, max: 15 }
    }
  }
});

const chartBarrasInst = new Chart(document.getElementById('chartBarras'), {
  type: 'bar',
  data: { labels: [], datasets: [] },
  options: {
    responsive: true, maintainAspectRatio: false, animation: { duration: 500 },
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 11 } } },
      y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'DM Sans', size: 11 }, callback: v => v + '%' }, min: 0, max: 20 }
    }
  }
});


/* ── Clima data ── */
const temasClima = {
  gee: {
    linha: { data: dadosLinha.gee_pessoa, label: 'GEE per capita (tCO₂eq/hab)' },
    barras: {
      labels: ['CO', 'N', 'NE', 'S/SE'],
      datasets: [
        { label: 'Média GEE (tCO₂eq/hab)', data: [56.19744, -9.502312, 7.785395, 11.85305] },
      ]
    },
    mapa: [
      { lat: -15.8, lng: -47.9, nome: 'Brasília',       idx: 6.8, cor: '#e74c3c' },
      { lat: -23.5, lng: -46.6, nome: 'São Paulo',       idx: 5.9, cor: '#e74c3c' },
      { lat: -30.0, lng: -51.2, nome: 'Porto Alegre',    idx: 5.4, cor: '#f39c12' },
      { lat: -19.9, lng: -43.9, nome: 'Belo Horizonte',  idx: 4.8, cor: '#f39c12' },
      { lat: -22.9, lng: -43.2, nome: 'Rio de Janeiro',  idx: 4.5, cor: '#f39c12' },
      { lat: -12.9, lng: -38.4, nome: 'Salvador',        idx: 3.1, cor: '#2ecc71' },
      { lat: -8.0,  lng: -34.9, nome: 'Recife',          idx: 2.7, cor: '#2ecc71' },
      { lat: -3.7,  lng: -38.5, nome: 'Fortaleza',       idx: 2.4, cor: '#2ecc71' },
      { lat: -1.4,  lng: -48.4, nome: 'Belém',           idx: 2.1, cor: '#27ae60' },
      { lat: -9.9,  lng: -67.8, nome: 'Rio Branco',      idx: 1.8, cor: '#27ae60' },
    ],
    indiceRange: [1.0, 9.0],
    casosRange:  [10, 500],
  }
};

const barPaletteClima = ['#1a5f8a','#72c3f0','#fcc419','#f06595'];

const chartLinhaC = new Chart(document.getElementById('chartLinhaC'), {
  type: 'line',
  data: { labels: anos, datasets: [] },
  options: {
    responsive: true, maintainAspectRatio: false, animation: { duration: 500 },
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'DM Sans', size: 11 } } },
      y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'DM Sans', size: 11 }, callback: v => v + 't' }, min: 0, max: 20 }
    }
  }
});

const chartBarrasC = new Chart(document.getElementById('chartBarrasC'), {
  type: 'bar',
  data: { labels: [], datasets: [] },
  options: {
    responsive: true, maintainAspectRatio: false, animation: { duration: 500 },
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 11 } } },
      y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'DM Sans', size: 11 } }, min: -20, max: 60 }
    }
  }
});


let mapClimaInicializado = false;
let mapClimaInstance;

let mapaClimaLayer = null;

function getCorClima(val) {
  if (val == null) return '#e8e8e8';
  if (val > 4)   return '#e74c3c';
  if (val >= 2)  return '#ffc107';
  return '#4caf7d';
}

function inicializarMapaClima() {
  mapClimaInstance = L.map('map-c', { zoomControl: true, scrollWheelZoom: true, attributionControl: false });

  const legendaClima = L.control({ position: 'bottomleft' });
  legendaClima.onAdd = () => {
    const div = L.DomUtil.create('div', 'mapa-legenda');
    div.innerHTML =
      `<div class="legenda-item"><span class="legenda-cor" style="background:#4caf7d"></span>&lt; 2Kt</div>` +
      `<div class="legenda-item"><span class="legenda-cor" style="background:#ffc107"></span>2Kt – 4Kt</div>` +
      `<div class="legenda-item"><span class="legenda-cor" style="background:#e74c3c"></span>&gt; 4Kt</div>` +
      `<div class="legenda-item"><span class="legenda-cor" style="background:#e8e8e8;border:1px solid #ccc"></span>Sem dados</div>`;
    return div;
  };
  legendaClima.addTo(mapClimaInstance);
}

function renderMapaClima() {
  const lookup = {};
  dadosMunicipios.forEach(r => {
    if (r.municipality_code && r.gee_pessoa !== '.' && r.gee_pessoa !== '')
      lookup[String(r.municipality_code)] = parseFloat(r.gee_pessoa.replace(',', '.'));
  });
  geoMunicipiosPromise.then(data => {
    if (mapaClimaLayer) mapaClimaLayer.remove();
    mapaClimaLayer = L.geoJSON(data, {
      style: feature => {
        const val = lookup[feature.properties.id];
        return { fillColor: getCorClima(val ?? null), color: '#fff', weight: 0.2, fillOpacity: 0.85 };
      },
      onEachFeature: (feature, layer) => {
        const val = lookup[feature.properties.id];
        const valStr = val != null ? val.toFixed(2) : 'Sem dados';
        layer.bindPopup(`<strong>${feature.properties.name}</strong><br>GEE per capita: ${valStr}`);
        layer.on('mouseover', function() { this.setStyle({ fillOpacity: 0.4 }); });
        layer.on('mouseout',  function() { this.setStyle({ fillOpacity: 0.85 }); });
      }
    }).addTo(mapClimaInstance);
    mapClimaInstance.fitBounds(mapaClimaLayer.getBounds());
  });
}

function aplicarTemaClima() {
  const t   = temasClima.gee;
  const cor = '#1a5f8a';

  chartLinhaC.data.datasets = [{
    label: t.linha.label, data: t.linha.data,
    borderColor: cor, backgroundColor: 'rgba(26,95,138,0.08)',
    tension: 0.4, pointRadius: 4, pointBackgroundColor: cor,
    fill: true, borderWidth: 2
  }];
  chartLinhaC.update();

  chartBarrasC.data.labels = t.barras.labels;
  chartBarrasC.data.datasets = t.barras.datasets.map((ds, i) => ({
    label: ds.label, data: ds.data,
    backgroundColor: barPaletteClima[i], borderRadius: 5
  }));
  chartBarrasC.update();

  const rowsC = dadosMunicipios
    .filter(r => r.prioridade_geepessoa && r.prioridade_geepessoa !== '.')
    .sort((a, b) => parseInt(a.prioridade_geepessoa) - parseInt(b.prioridade_geepessoa));
  const tbodyC = rowsC.map(r => {
    const gee = parseFloat(r.gee_pessoa.replace(',', '.')).toFixed(2);
    return `<tr>
      <td><strong>#${r.prioridade_geepessoa}</strong></td>
      <td>${r.municipality}</td>
      <td>${r.state}</td>
      <td>${gee}</td>
    </tr>`;
  }).join('');
  document.getElementById('tabelaClima').innerHTML =
    `<thead><tr><th>Posição</th><th>Município</th><th>Estado</th><th>tCO₂e/pessoa</th></tr></thead><tbody>${tbodyC}</tbody>`;

  renderMapaClima();
}

/* ── Map ── */
const mapInstance = L.map('map', { zoomControl: true, scrollWheelZoom: true, attributionControl: false });

const geoMunicipiosPromise = fetch('data/municipios-geo.json').then(r => r.json());

let mapaNutriLayer = null;
let legendaNutriDiv = null;

const legendaNutri = L.control({ position: 'bottomleft' });
legendaNutri.onAdd = () => { legendaNutriDiv = L.DomUtil.create('div', 'mapa-legenda'); return legendaNutriDiv; };
legendaNutri.addTo(mapInstance);

const _legendaNutriHtml = {
  excesso:    `<div class="legenda-item"><span class="legenda-cor" style="background:#4caf7d"></span>&lt; 5%</div><div class="legenda-item"><span class="legenda-cor" style="background:#ffc107"></span>5% – 10%</div><div class="legenda-item"><span class="legenda-cor" style="background:#e74c3c"></span>&gt; 10%</div>`,
  desnutricao:`<div class="legenda-item"><span class="legenda-cor" style="background:#4caf7d"></span>&lt; 5%</div><div class="legenda-item"><span class="legenda-cor" style="background:#ffc107"></span>5% – 10%</div><div class="legenda-item"><span class="legenda-cor" style="background:#e74c3c"></span>&gt; 10%</div>`,
  dupla:      `<div class="legenda-item"><span class="legenda-cor" style="background:#1b4332"></span>Muito bom</div><div class="legenda-item"><span class="legenda-cor" style="background:#4caf7d"></span>Bom</div><div class="legenda-item"><span class="legenda-cor" style="background:#ffc107"></span>Regular</div><div class="legenda-item"><span class="legenda-cor" style="background:#e74c3c"></span>Ruim</div><div class="legenda-item"><span class="legenda-cor" style="background:#7b1d1d"></span>Muito ruim</div>`,
};

const _corDupla = { 'Verde escuro': '#1b4332', 'Verde': '#4caf7d', 'Amarelo': '#ffc107', 'Vermelho': '#e74c3c', 'Vermelho escuro': '#7b1d1d' };
const _labelDupla = { 'Verde escuro': 'Muito bom', 'Verde': 'Bom', 'Amarelo': 'Regular', 'Vermelho': 'Ruim', 'Vermelho escuro': 'Muito ruim' };

function getCorNutri(val) {
  if (val == null) return '#e8e8e8';
  if (val < 5)    return '#4caf7d';
  if (val <= 10)  return '#ffc107';
  return '#e74c3c';
}

function renderMapaNutri(tema) {
  const lookup = {};
  if (tema === 'dupla') {
    dadosMunicipios.forEach(r => {
      if (r.municipality_code && r.desn_exce_pesso_niveis && r.desn_exce_pesso_niveis !== '.')
        lookup[String(r.municipality_code)] = r.desn_exce_pesso_niveis;
    });
  } else {
    const col = tema === 'excesso' ? 'p_exce_peso' : 'p_desn';
    dadosMunicipios.forEach(r => {
      if (r.municipality_code && r[col] !== '.')
        lookup[String(r.municipality_code)] = parseFloat(r[col].replace(',', '.')) * 100;
    });
  }

  if (legendaNutriDiv) legendaNutriDiv.innerHTML = _legendaNutriHtml[tema] || '';

  const label = { excesso: 'Excesso de peso', desnutricao: 'Desnutrição', dupla: 'Dupla carga' }[tema];

  geoMunicipiosPromise.then(data => {
    if (mapaNutriLayer) mapaNutriLayer.remove();
    mapaNutriLayer = L.geoJSON(data, {
      style: feature => {
        const val = lookup[feature.properties.id];
        const cor = tema === 'dupla' ? (_corDupla[val] || '#e8e8e8') : getCorNutri(val ?? null);
        return { fillColor: cor, color: '#fff', weight: 0.2, fillOpacity: 0.85 };
      },
      onEachFeature: (feature, layer) => {
        const val   = lookup[feature.properties.id];
        const valStr = tema === 'dupla'
          ? (_labelDupla[val] || 'Sem dados')
          : (val != null ? val.toFixed(2) + '%' : 'Sem dados');
        layer.bindPopup(`<strong>${feature.properties.name}</strong><br>${label}: ${valStr}`);
        layer.on('mouseover', function() { this.setStyle({ fillOpacity: 0.4 }); });
        layer.on('mouseout',  function() { this.setStyle({ fillOpacity: 0.85 }); });
      }
    }).addTo(mapInstance);
    mapInstance.fitBounds(mapaNutriLayer.getBounds());
  });
}

/* ── Table ── */
let dadosMunicipios = [];

function atualizarTabela(tema) {
  let html;
  if (tema === 'excesso' || tema === 'desnutricao') {
    const col = tema === 'excesso' ? 'prioridade_exce_peso' : 'prioridade_desn';
    const rows = dadosMunicipios
      .filter(r => r[col] && r[col] !== '.')
      .sort((a, b) => parseInt(a[col]) - parseInt(b[col]));
    const tbody = rows.map(r =>
      `<tr>
        <td><strong>#${r[col]}</strong></td>
        <td>${r.municipality}</td>
        <td>${r.state}</td>
      </tr>`
    ).join('');
    html = `<thead><tr><th>Posição</th><th>Município</th><th>Estado</th></tr></thead><tbody>${tbody}</tbody>`;
  } else if (tema === 'dupla') {
    const rows = dadosMunicipios
      .filter(r => r.prioridade_dupla && r.prioridade_dupla !== '.')
      .sort((a, b) => parseInt(a.prioridade_dupla) - parseInt(b.prioridade_dupla));
    const tbody = rows.map(r =>
      `<tr>
        <td><strong>#${r.prioridade_dupla}</strong></td>
        <td>${r.municipality}</td>
        <td>${r.state}</td>
      </tr>`
    ).join('');
    html = `<thead><tr><th>Posição</th><th>Município</th><th>Estado</th></tr></thead><tbody>${tbody}</tbody>`;
  } else {
    html = `<thead><tr><th>Posição</th><th>Município</th><th>Estado</th></tr></thead><tbody></tbody>`;
  }
  document.getElementById('tabelaMunicipios').innerHTML = html;
}

/* ── Apply theme ── */
function aplicarTema(tema) {
  const t   = temas[tema];
  const cor = tabColors[tabAtual];

  const linhaDs = t.linha.datasets[0];
  chartLinhaInst.data.datasets = [{
    label: linhaDs.label, data: linhaDs.data,
    borderColor: cor, backgroundColor: hexToRgba(cor, 0.08),
    tension: 0.4, pointRadius: 4, pointBackgroundColor: cor,
    fill: true, borderWidth: 2, borderDash: []
  }];
  chartLinhaInst.update();

  const barrasDs = t.barras.datasets[0];
  chartBarrasInst.data.labels   = t.barras.labels;
  chartBarrasInst.data.datasets = [{
    label: barrasDs.label, data: barrasDs.data,
    backgroundColor: hexToRgba(cor, 0.8), borderRadius: 5
  }];
  chartBarrasInst.update();

  atualizarTabela(tema);
  renderMapaNutri(tema);
}

const matrizDados = [
  [2,  20, 3 ],
  [3,  52, 14],
  [0,  3,  2 ],
];

const matrizCores = [
  ['#27ae60','#a8ddb8','#fde8d8'],
  ['#a8ddb8','#fef9c3','#ffc8b0'],
  ['#fde8d8','#ffc8b0','#c0392b'],
];

const matrizTextoCores = [
  ['#fff',    '#1a3d28','#7a3010'],
  ['#1a3d28','#5a4a00','#7a2000'],
  ['#7a3010','#7a2000','#fff'   ],
];

function renderMatriz() {
  const labels = ['Redução', 'Sem mudança', 'Aumento'];
  let html = `<table class="matriz-table">
    <thead>
      <tr>
        <th colspan="2" rowspan="2" class="matriz-corner"></th>
        <th colspan="3" class="matriz-header-top">Excesso de Peso</th>
      </tr>
      <tr>
        ${labels.map(l => `<th class="matriz-header-col">${l}</th>`).join('')}
      </tr>
    </thead>
    <tbody>`;

  labels.forEach((rowLabel, i) => {
    html += `<tr>`;
    if (i === 0) html += `<th rowspan="3" class="matriz-header-row-group">Desnutrição</th>`;
    html += `<th class="matriz-header-row">${rowLabel}</th>`;
    matrizDados[i].forEach((val, j) => {
      html += `<td class="matriz-cell" style="background:${matrizCores[i][j]};color:${matrizTextoCores[i][j]};">${val}%</td>`;
    });
    html += `</tr>`;
  });

  html += `</tbody></table>`;
  document.getElementById('matrizDupla').innerHTML = html;
}

function switchNutri(tema, btn) {
  document.querySelectorAll('.nutri-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  temaAtual = tema;

  const isDupla = tema === 'dupla';
  document.getElementById('col-linha').style.display  = isDupla ? 'none' : '';
  document.getElementById('col-barras').style.display = isDupla ? 'none' : '';
  document.getElementById('col-matriz').style.display = isDupla ? '' : 'none';
  if (isDupla) renderMatriz();

  const infoIcon = document.getElementById('infoIconDupla');
  infoIcon.style.display = '';
  if (!infoIcon._ttInit) {
    new bootstrap.Tooltip(infoIcon);
    infoIcon._ttInit = true;
  }

  aplicarTema(tema);
}

/* ── Table search ── */
function buscarTabela(inputId, tableId) {
  const termo = document.getElementById(inputId).value.trim().toLowerCase();
  const rows  = document.querySelectorAll(`#${tableId} tbody tr`);
  let primeiro = null;
  rows.forEach(tr => {
    tr.classList.remove('table-row-highlight');
    if (termo && tr.cells[1] && tr.cells[1].textContent.toLowerCase().includes(termo)) {
      tr.classList.add('table-row-highlight');
      if (!primeiro) primeiro = tr;
    }
  });
  if (primeiro) {
    const container  = document.getElementById(tableId).closest('.table-scroll');
    const headerH    = document.querySelector(`#${tableId} thead`).offsetHeight;
    const rowTop     = primeiro.offsetTop - headerH;
    container.scrollTo({ top: rowTop, behavior: 'smooth' });
  }
}

fetch('data/municipios.json')
  .then(r => r.json())
  .then(data => {
    dadosMunicipios = data;
    aplicarTema('excesso');
    const infoIcon = document.getElementById('infoIconDupla');
    infoIcon.style.display = '';
    new bootstrap.Tooltip(infoIcon);
    infoIcon._ttInit = true;
  });
