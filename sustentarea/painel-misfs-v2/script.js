let estadosObj, capitaisObj, indicadoresObj;

window.onload = () => {
  Promise.all([
    fetch('data/estados.json').then((res) => res.json()),
    fetch('data/capitais.json').then((res) => res.json()),
    fetch('data/indicadores.json').then((res) => res.json())
  ]).then(([estadosData, capitaisData, indicadoresData]) => {
    estadosObj = sortByKey(estadosData, 'misfsr_rank');
    capitaisObj = sortByKey(capitaisData, 'misfsr_rank');
    indicadoresObj = indicadoresData;

    init();
  });
};

const DIMENSIONS = {
  social: ['S01', 'S02', 'S03', 'S04', 'S051', 'S052', 'S06', 'S07', 'S08', 'S09', 'S10'],
  nutricional: ['N01', 'N02', 'N03', 'N04', 'N05', 'N06', 'N07', 'N08', 'N09', 'N10'],
  ambiental: ['AE01', 'AE02', 'AE031', 'AE032', 'AE04', 'AE05', 'AE06', 'AE07', 'AE08', 'AE09', 'AE10', 'AE11', 'AE12'],
  economico: ['E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07', 'E08', 'E09', 'E10', 'E11', 'E12']
};

// E08 (preço dos alimentos) só existe para capitais
function economicoCodes(typeRadio) {
  return typeRadio === 'estados' ? DIMENSIONS.economico.filter((c) => c !== 'E08') : DIMENSIONS.economico;
}

function allCodes(typeRadio) {
  return [].concat(DIMENSIONS.social, DIMENSIONS.nutricional, DIMENSIONS.ambiental, economicoCodes(typeRadio));
}

const NEGATIVE_COLOR = 'rgba(173,181,189,.7)';
const NEGATIVE_COLOR_HOVER = 'rgba(173,181,189,1)';

// Capital de cada estado, para selecionar a capital ao clicar no estado no modo Capitais
const UF_TO_CAPITAL = {
  AC: 'RIO BRANCO', AL: 'MACEIÓ', AP: 'MACAPÁ', AM: 'MANAUS',
  BA: 'SALVADOR', CE: 'FORTALEZA', DF: 'BRASÍLIA', ES: 'VITÓRIA',
  GO: 'GOIANIA', MA: 'SÃO LUIS', MT: 'CUIABÁ', MS: 'CAMPO GRANDE',
  MG: 'BELO HORIZONTE', PA: 'BELÉM', PB: 'JOÃO PESSOA', PR: 'CURITIBA',
  PE: 'RECIFE', PI: 'TERESINA', RJ: 'RIO DE JANEIRO', RN: 'NATAL',
  RS: 'PORTO ALEGRE', RO: 'PORTO VELHO', RR: 'BOA VISTA', SC: 'FLORIANÓPOLIS',
  SP: 'SÃO PAULO', SE: 'ARACAJU', TO: 'PALMAS'
};

const CAPITAL_TO_UF = Object.fromEntries(Object.entries(UF_TO_CAPITAL).map(([uf, capital]) => [capital, uf]));

// Agrupa os indicadores de direção positiva primeiro, depois os de direção negativa (*)
function groupByDir(codes) {
  const positivos = codes.filter((c) => indicadoresObj[c].dir !== '-');
  const negativos = codes.filter((c) => indicadoresObj[c].dir === '-');
  return positivos.concat(negativos);
}

// Ordem/agrupamento usado nos gráficos radiais e replicado nas tabelas de detalhamento
function chartCodes(dimensionKey, typeRadio) {
  const codes = dimensionKey === 'economico' ? economicoCodes(typeRadio) : DIMENSIONS[dimensionKey];
  return groupByDir(codes);
}

function dimColors(codes, color, hoverColor) {
  return {
    backgroundColor: codes.map((c) => (indicadoresObj[c].dir === '-' ? NEGATIVE_COLOR : color)),
    hoverBackgroundColor: codes.map((c) => (indicadoresObj[c].dir === '-' ? NEGATIVE_COLOR_HOVER : hoverColor))
  };
}

// Pinta o círculo da escala radial (por trás dos dados) com a cor principal da dimensão
function circleBgPlugin(color) {
  return {
    id: 'circleBg',
    beforeDraw(chart) {
      const scale = chart.scales.r;
      if (!scale) return;
      const ctx = chart.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.arc(scale.xCenter, scale.yCenter, scale.drawingArea, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    }
  };
}

function init() {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

  let typeRadio = 'estados';
  let selectedLayer = null;
  let selectedType = null;
  let selectedCapitalStateLayer = null;
  let statesLayer, capitalsLayer;
  const capitalMarkers = {};

  const socialChartCodes = chartCodes('social', typeRadio);
  const socialColors = dimColors(socialChartCodes, 'rgba(112,173,71,.7)', 'rgba(112,173,71,1)');
  let socialChart = new Chart(document.getElementById('socialChart'), {
    type: 'polarArea',
    data: {
      labels: socialChartCodes.map((c) => wrapLabel(indicadorLabel(c))),
      datasets: [{
        borderWidth: 1,
        backgroundColor: socialColors.backgroundColor,
        hoverBackgroundColor: socialColors.hoverBackgroundColor
      }]
    },
    plugins: [circleBgPlugin('rgba(112,173,71,.15)')],
    options: {
      maintainAspectRatio: false,
      scales: { r: { min: 0, max: 100, ticks: { font: { size: 9 }, color: '#999' }, pointLabels: { display: true, centerPointLabels: true, font: { size: 9 }, color: '#999' } } },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => Math.round(context.raw) } } }
    }
  });

  const nutricionalChartCodes = chartCodes('nutricional', typeRadio);
  const nutricionalColors = dimColors(nutricionalChartCodes, 'rgba(237,125,49,.7)', 'rgba(237,125,49,1)');
  let nutricionalChart = new Chart(document.getElementById('nutricionalChart'), {
    type: 'polarArea',
    data: {
      labels: nutricionalChartCodes.map((c) => wrapLabel(indicadorLabel(c))),
      datasets: [{
        borderWidth: 1,
        backgroundColor: nutricionalColors.backgroundColor,
        hoverBackgroundColor: nutricionalColors.hoverBackgroundColor
      }]
    },
    plugins: [circleBgPlugin('rgba(237,125,49,.15)')],
    options: {
      maintainAspectRatio: false,
      scales: { r: { min: 0, max: 100, ticks: { font: { size: 9 }, color: '#999' }, pointLabels: { display: true, centerPointLabels: true, font: { size: 9 }, color: '#999' } } },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => Math.round(context.raw) } } }
    }
  });

  const ambientalChartCodes = chartCodes('ambiental', typeRadio);
  const ambientalColors = dimColors(ambientalChartCodes, 'rgba(91,155,213,.7)', 'rgba(91,155,213,1)');
  let ambientalChart = new Chart(document.getElementById('ambientalChart'), {
    type: 'polarArea',
    data: {
      labels: ambientalChartCodes.map((c) => wrapLabel(indicadorLabel(c))),
      datasets: [{
        borderWidth: 1,
        backgroundColor: ambientalColors.backgroundColor,
        hoverBackgroundColor: ambientalColors.hoverBackgroundColor
      }]
    },
    plugins: [circleBgPlugin('rgba(91,155,213,.15)')],
    options: {
      maintainAspectRatio: false,
      scales: { r: { min: 0, max: 100, ticks: { font: { size: 9 }, color: '#999' }, pointLabels: { display: true, centerPointLabels: true, font: { size: 9 }, color: '#999' } } },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => Math.round(context.raw) } } }
    }
  });

  const economicoChartCodes = chartCodes('economico', typeRadio);
  const economicoColors = dimColors(economicoChartCodes, 'rgba(255,192,0,.7)', 'rgba(255,192,0,1)');
  let economicoChart = new Chart(document.getElementById('economicoChart'), {
    type: 'polarArea',
    data: {
      labels: economicoChartCodes.map((c) => wrapLabel(indicadorLabel(c))),
      datasets: [{
        borderWidth: 1,
        backgroundColor: economicoColors.backgroundColor,
        hoverBackgroundColor: economicoColors.hoverBackgroundColor
      }]
    },
    plugins: [circleBgPlugin('rgba(255,192,0,.15)')],
    options: {
      maintainAspectRatio: false,
      scales: { r: { min: 0, max: 100, ticks: { font: { size: 9 }, color: '#999' }, pointLabels: { display: true, centerPointLabels: true, font: { size: 9 }, color: '#999' } } },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => Math.round(context.raw) } } }
    }
  });

  buildIndicadorTable('socialIndicadoresBody', socialChartCodes);
  buildIndicadorTable('nutricionalIndicadoresBody', nutricionalChartCodes);
  buildIndicadorTable('ambientalIndicadoresBody', ambientalChartCodes);
  buildIndicadorTable('economicoIndicadoresBody', economicoChartCodes);

  // --- Estilos do mapa ---
  const clusterColors = { A: '#AF9A86', B: '#84B1AD', C: '#C18E86', D: '#9AA5B2' };
  const clusterColorsStrong = { A: '#8C6E52', B: '#4F8F8A', C: '#A65D52', D: '#6E7F91' };
  const stateCluster = {
    RO: 'A', GO: 'A', MS: 'A', MT: 'A', TO: 'A',
    SC: 'B', DF: 'B', ES: 'B', RS: 'B', PR: 'B', MG: 'B', RJ: 'B', SP: 'B',
    AP: 'D', RR: 'D', PA: 'D', AM: 'D', AC: 'D',
    PB: 'C', RN: 'C', BA: 'C', CE: 'C', PE: 'C', PI: 'C', AL: 'C', SE: 'C', MA: 'C'
  };
  function stateStyle(feature) {
    return { fillColor: clusterColors[stateCluster[feature.properties.sigla]] || '#dcdcdc', weight: 0.6, color: '#fff', fillOpacity: 1 };
  }
  function stateHoverStyle(feature) {
    return { fillColor: clusterColorsStrong[stateCluster[feature.properties.sigla]] || '#dcdcdc', weight: 1.2, color: '#fff', fillOpacity: 1 };
  }
  function stateSelectedStyle(feature) {
    return { fillColor: clusterColorsStrong[stateCluster[feature.properties.sigla]] || '#dcdcdc', weight: 1.8, color: '#3a3a3a', fillOpacity: 1 };
  }

  const clusterLabels = {
    A: 'Cinturão agropecuário',
    B: 'Polo de desenvolvimento central',
    C: 'Eixo de desenvolvimento latente',
    D: 'Fronteira de vulnerabilidade'
  };
  document.getElementById('clusterLegend').innerHTML = Object.keys(clusterLabels).map((k) => (
    '<div class="d-flex align-items-start' + (k === 'D' ? '' : ' mb-1') + '">'
    + '<span class="d-inline-block me-2 flex-shrink-0" style="width: 10px; height: 10px; border-radius: 2px; margin-top: 2px; background-color: ' + clusterColorsStrong[k] + ';"></span>'
    + '<span class="text-secondary"><strong style="color: ' + clusterColorsStrong[k] + ';">Cluster ' + k + ':</strong> ' + clusterLabels[k] + '</span>'
    + '</div>'
  )).join('');
  function toTitleCase(str) {
    return str.toLowerCase().split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  // --- Mapa Leaflet (apenas os estados, sem camada de tiles) ---
  const map = L.map('brasilMap', {
    attributionControl: false,
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    touchZoom: false,
    keyboard: false,
    dragging: false,
    minZoom: 3,
    maxZoom: 9
  });

  const statesFeatureCollection = {
    type: 'FeatureCollection',
    features: estadosObj
      .filter((e) => e.geometry)
      .map((e) => ({ type: 'Feature', properties: { name: e.nome, sigla: e.sigla }, geometry: e.geometry }))
  };

  statesLayer = L.geoJSON(statesFeatureCollection, {
    style: stateStyle,
    onEachFeature: (feature, layer) => {
      const nome = feature.properties.name.toUpperCase();
      const sigla = feature.properties.sigla;
      layer.bindTooltip(feature.properties.sigla, { permanent: true, direction: 'center', className: 'state-label' });
      layer.on({
        mouseover: () => {
          if (typeRadio === 'estados' && layer !== selectedLayer) layer.setStyle(stateHoverStyle(feature));
          if (typeRadio === 'capitais') {
            if (layer !== selectedCapitalStateLayer) layer.setStyle(stateHoverStyle(feature));
            const marker = capitalMarkers[UF_TO_CAPITAL[sigla]];
            if (marker) marker.openTooltip();
          }
        },
        mouseout: () => {
          if (typeRadio === 'estados' && layer !== selectedLayer) layer.setStyle(stateStyle(feature));
          if (typeRadio === 'capitais') {
            if (layer !== selectedCapitalStateLayer) layer.setStyle(stateStyle(feature));
            const marker = capitalMarkers[UF_TO_CAPITAL[sigla]];
            if (marker && marker !== selectedLayer) marker.closeTooltip();
          }
        },
        click: () => {
          if (typeRadio === 'estados') {
            selectByName(nome);
          } else {
            const capitalNome = UF_TO_CAPITAL[sigla];
            if (capitalNome) selectByName(capitalNome);
          }
        }
      });
    }
  }).addTo(map);

  const brasilBounds = statesLayer.getBounds();
  map.fitBounds(brasilBounds, { padding: [10, 10] });
  map.setZoom(map.getZoom() + 1);
  map.setMaxBounds(brasilBounds.pad(0.25));
  map.setMinZoom(map.getZoom());
  map.setMaxZoom(map.getZoom());

  // Pane próprio para os marcadores de capital ficarem acima das siglas dos estados (tooltipPane)
  map.createPane('capitalsPane');
  map.getPane('capitalsPane').style.zIndex = 660;

  // Pane próprio para a legenda: acima do preenchimento dos estados, mas abaixo dos tooltips (siglas/labels de capital)
  map.createPane('legendPane');
  const legendPaneEl = map.getPane('legendPane');
  legendPaneEl.style.zIndex = 450;
  legendPaneEl.style.left = '0';
  legendPaneEl.style.top = '0';
  legendPaneEl.style.pointerEvents = 'none';

  // panes do Leaflet não têm tamanho próprio (nem "100%" funciona, pois o leaflet-map-pane também é 0x0);
  // por isso usamos o tamanho real do mapa em pixels, senão o "bottom" da legenda não tem referência.
  // Medido de novo depois de um frame porque, no primeiro carregamento, o container do mapa às vezes
  // ainda não tem largura definitiva no momento em que este script roda.
  function sizeLegendPane() {
    const rect = document.getElementById('brasilMap').getBoundingClientRect();
    legendPaneEl.style.width = rect.width + 'px';
    legendPaneEl.style.height = rect.height + 'px';
  }
  sizeLegendPane();
  requestAnimationFrame(sizeLegendPane);
  legendPaneEl.appendChild(document.getElementById('clusterLegend'));

  function capitalDotStyle() {
    return { pane: 'capitalsPane', radius: 2.5, fillColor: '#6c757d', color: '#fff', weight: 1.5, fillOpacity: 0.9, interactive: false };
  }

  capitalsLayer = L.layerGroup();
  capitaisObj.forEach((c) => {
    const marker = L.circleMarker([c.lat, c.lng], capitalDotStyle());
    marker.bindTooltip(toTitleCase(c.nome), { direction: 'left', offset: [-8, 0], className: 'capital-name-marker' });
    capitalMarkers[c.nome] = marker;
    capitalsLayer.addLayer(marker);
  });

  function setMapMode(mode) {
    clearSelection();
    document.getElementById('brasilMap').classList.toggle('capitais-mode', mode === 'capitais');
    if (mode === 'estados') {
      if (map.hasLayer(capitalsLayer)) map.removeLayer(capitalsLayer);
    } else {
      if (!map.hasLayer(capitalsLayer)) capitalsLayer.addTo(map);
    }
  }

  function clearSelection() {
    if (selectedCapitalStateLayer) {
      selectedCapitalStateLayer.setStyle(stateStyle(selectedCapitalStateLayer.feature));
      selectedCapitalStateLayer = null;
    }
    if (!selectedLayer) return;
    if (selectedType === 'estado') {
      selectedLayer.setStyle(stateStyle(selectedLayer.feature));
    } else if (selectedType === 'capital') {
      selectedLayer.setStyle(capitalDotStyle());
      selectedLayer.closeTooltip();
    }
    selectedLayer = null;
    selectedType = null;
  }

  function highlightOnMap(nome) {
    clearSelection();
    if (typeRadio === 'estados') {
      statesLayer.eachLayer((layer) => {
        if (layer.feature.properties.name.toUpperCase() === nome) {
          layer.setStyle(stateSelectedStyle(layer.feature));
          layer.bringToFront();
          selectedLayer = layer;
          selectedType = 'estado';
        }
      });
    } else {
      const marker = capitalMarkers[nome];
      if (marker) {
        marker.setStyle({ radius: 3, fillColor: '#6c757d', weight: 2 });
        marker.openTooltip();
        selectedLayer = marker;
        selectedType = 'capital';

        const sigla = CAPITAL_TO_UF[nome];
        statesLayer.eachLayer((layer) => {
          if (layer.feature.properties.sigla === sigla) {
            layer.setStyle(stateSelectedStyle(layer.feature));
            layer.bringToFront();
            selectedCapitalStateLayer = layer;
          }
        });
      }
    }
  }

  function applySelection(idx) {
    idx = parseInt(idx, 10);
    let typeObj = typeRadio == 'estados' ? estadosObj : capitaisObj;
    let thisObj = typeObj[idx];
    if (!thisObj || thisObj.misfsr === undefined) return;
    const pfx = typeRadio == 'estados' ? 'e_' : 'c_';

    document.getElementById('misfsrPts').innerHTML = Math.round(thisObj.misfsr);
    document.getElementById('socialPts').innerHTML = Math.round(thisObj.social);
    document.getElementById('nutricionalPts').innerHTML = Math.round(thisObj.nutricional);
    document.getElementById('ambientalPts').innerHTML = Math.round(thisObj.ambiental);
    document.getElementById('economicoPts').innerHTML = Math.round(thisObj.economico);

    socialChart.data.datasets[0].data = chartCodes('social', typeRadio).map((c) => thisObj[c].p);
    socialChart.update();
    nutricionalChart.data.datasets[0].data = chartCodes('nutricional', typeRadio).map((c) => thisObj[c].p);
    nutricionalChart.update();
    ambientalChart.data.datasets[0].data = chartCodes('ambiental', typeRadio).map((c) => thisObj[c].p);
    ambientalChart.update();
    economicoChart.data.datasets[0].data = chartCodes('economico', typeRadio).map((c) => thisObj[c].p);
    economicoChart.update();

    allCodes(typeRadio).forEach((i) => {
      const info = indicadoresObj[i];
      document.getElementById('ind' + i).innerHTML = nFrmt(thisObj[i].v);
      document.getElementById('rank' + i).innerHTML = thisObj[i].rank ? thisObj[i].rank + 'º' : '-';
      document.getElementById('med' + i).innerHTML = nFrmt(info[pfx + 'm']) + ' (' + nFrmt(info[pfx + 'min']) + ' - ' + nFrmt(info[pfx + 'max']) + ')';
    });

    document.querySelectorAll('.btn-indicador').forEach((btn) => {
      btn.classList.remove('d-none');
    });
    document.querySelectorAll('.title-indicador').forEach((t) => {
      t.innerHTML = thisObj.nome;
    });

    document.querySelectorAll('#filterTableBody tr.selected').forEach((tr) => tr.classList.remove('selected'));
    const row = document.querySelector('#filterTableBody tr[data-idx="' + idx + '"]');
    if (row) {
      row.classList.add('selected');
      row.scrollIntoView({ block: 'center' });
    }
    highlightOnMap(thisObj.nome);
  }

  function selectByName(nome) {
    let typeObj = typeRadio == 'estados' ? estadosObj : capitaisObj;
    let idx = typeObj.findIndex((o) => o.nome === nome);
    if (idx === -1) return;
    applySelection(idx);
  }

  function setEconomicoDisplay(typeRadio) {
    const econChartCodes = chartCodes('economico', typeRadio);
    const econColors = dimColors(econChartCodes, 'rgba(255,192,0,.7)', 'rgba(255,192,0,1)');
    economicoChart.data.labels = econChartCodes.map((c) => wrapLabel(indicadorLabel(c)));
    economicoChart.data.datasets[0].backgroundColor = econColors.backgroundColor;
    economicoChart.data.datasets[0].hoverBackgroundColor = econColors.hoverBackgroundColor;
    buildIndicadorTable('economicoIndicadoresBody', econChartCodes);
  }

  document.getElementById('estadosRadio').addEventListener('click', (e) => {
    typeRadio = 'estados';
    document.getElementById('filterTableHeader').innerHTML = 'Estado';
    toTableRows(estadosObj);
    setEconomicoDisplay(typeRadio);
    clearData(socialChart, nutricionalChart, ambientalChart, economicoChart);
    setMapMode('estados');
  });

  document.getElementById('capitaisRadio').addEventListener('click', (e) => {
    typeRadio = 'capitais';
    document.getElementById('filterTableHeader').innerHTML = 'Capital';
    toTableRows(capitaisObj);
    setEconomicoDisplay(typeRadio);
    clearData(socialChart, nutricionalChart, ambientalChart, economicoChart);
    setMapMode('capitais');
  });

  document.getElementById('filterTableBody').addEventListener('click', (e) => {
    const row = e.target.closest('tr[data-idx]');
    if (row) applySelection(row.dataset.idx);
  });

  toTableRows(estadosObj);
}

function clearData(socialChart, nutricionalChart, ambientalChart, economicoChart) {
  document.getElementById('misfsrPts').innerHTML = '-';
  document.getElementById('socialPts').innerHTML = '-';
  document.getElementById('nutricionalPts').innerHTML = '-';
  document.getElementById('ambientalPts').innerHTML = '-';
  document.getElementById('economicoPts').innerHTML = '-';

  socialChart.data.datasets[0].data = [];
  socialChart.update();
  nutricionalChart.data.datasets[0].data = [];
  nutricionalChart.update();
  ambientalChart.data.datasets[0].data = [];
  ambientalChart.update();
  economicoChart.data.datasets[0].data = [];
  economicoChart.update();

  document.querySelectorAll('.btn-indicador').forEach((btn) => {
    btn.classList.add('d-none');
  });
}

function toTableRows(obj) {
  let html = '';
  for (var key in obj) {
    const o = obj[key];
    if (o.misfsr === undefined) continue;
    html += '<tr data-idx="' + key + '">'
      + '<td>' + o.misfsr_rank + 'º</td>'
      + '<td>' + o.nome + '</td>'
      + '<td>' + (o.regiao || '-') + '</td>'
      + '<td class="text-center">' + Math.round(o.misfsr) + '</td>'
      + '</tr>';
  }
  document.getElementById('filterTableBody').innerHTML = html;
  document.querySelector('.ranking-table-wrap').scrollTop = 0;
}

function sortByKey(array, key) {
  return array.sort(function(a, b) {
    var x = a[key];
    var y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

function nFrmt(number) {
  if (number === null || number === undefined) return '-';
  return number.toFixed(1).toString().replace('.', ',');
}

function indicadorLabel(code) {
  const info = indicadoresObj[code];
  return info.nome + (info.dir === '-' ? '*' : '');
}

function indicadorDescricao(code) {
  const info = indicadoresObj[code];
  return info.descricao + (info.un ? ' (' + info.un + ')' : '') + (info.dir === '-' ? '*' : '');
}

function wrapLabel(text) {
  const words = text.split(' ');
  if (text.length <= 14 || words.length <= 1) return text;
  let bestSplit = 1, bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length);
    if (diff < bestDiff) { bestDiff = diff; bestSplit = i; }
  }
  return [words.slice(0, bestSplit).join(' '), words.slice(bestSplit).join(' ')];
}

function buildIndicadorTable(tbodyId, codes) {
  const html = codes.map((c) => {
    return '<tr><th>' + indicadorLabel(c) + '</th><td>' + indicadorDescricao(c) + '</td>'
      + '<td class="text-center"><span id="ind' + c + '"></span></td>'
      + '<td class="text-center"><span id="med' + c + '"></span></td>'
      + '<td class="text-center"><span id="rank' + c + '"></span></td></tr>';
  }).join('');
  document.getElementById(tbodyId).innerHTML = html;
}
