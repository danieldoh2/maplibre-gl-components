import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { PMTilesLayerControl, PMTilesLayerAdapter} from '../../src';
import '../../src/lib/styles/pmtiles-layer.css';
import '../../src/lib/styles/common.css';
import { LayerControl } from 'maplibre-gl-layer-control';
import 'maplibre-gl-layer-control/style.css';
import { PMTilesQuickLayersControl } from '../../src/lib/core/PMTilesQuickLayersControl';


import {
  Colorbar,
  Legend,
  HtmlControl,
  BasemapControl,
  TerrainControl,
  SearchControl,
  VectorDatasetControl,
  InspectControl,
  ViewStateControl,
} from '../../src';

const BASEMAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

const map = new maplibregl.Map({
  container: 'map',
  style: BASEMAP_STYLE,
 center: [-119.4179, 36.7783],
  zoom: 12,
});

// Add navigation control
map.addControl(new maplibregl.NavigationControl(), 'top-left');

// Add globe control
map.addControl(new maplibregl.GlobeControl(), 'top-left');

// Add terrain control - toggle 3D terrain using free AWS Terrarium tiles
const terrainControl = new TerrainControl({
  exaggeration: 1.0,
  hillshade: true,
});
map.addControl(terrainControl, 'top-right');

// Listen for terrain changes
terrainControl.on('terrainchange', (event) => {
  console.log('Terrain', event.state.enabled ? 'enabled' : 'disabled');
});

// Add basemap control - fetches from xyzservices by default
const basemapControl = new BasemapControl({
  defaultBasemap: 'OpenStreetMap.Mapnik',
  showSearch: true,
  collapsible: true,
  displayMode: 'dropdown',
  // filterGroups: ['OpenStreetMap', 'CartoDB', 'OpenTopoMap', 'Esri', 'Google'],
  filterGroups: ['OpenStreetMap', 'OpenTopoMap', 'Google'],

  excludeBroken: true,
  maxHeight: 400,
});
map.addControl(basemapControl, 'top-right');

// Listen for basemap changes
basemapControl.on('basemapchange', (event) => {
  console.log('Basemap changed to:', event.basemap?.name);
});

// Add search control - allows searching for places
const searchControl = new SearchControl({
  placeholder: 'Search for a place...',
  flyToZoom: 14,
  showMarker: true,
  markerColor: '#e74c3c',
  collapsed: true,
});
map.addControl(searchControl, 'top-left');

// Listen for search result selection
searchControl.on('resultselect', (event) => {
  console.log('Selected place:', event.result?.name, 'at', event.result?.lng, event.result?.lat);
});



// Add PMTiles Layer control with sample data pre-filled
// Using Protomaps Florence example from the MapLibre docs



// const pmtilesControl = new PMTilesLayerControl({
//   collapsed: false,
//   defaultUrl: 'https://pmtiles.io/protomaps(vector)ODbL_firenze.pmtiles',
//   // defaultUrl: 'https://pub-c15989b388764a34beb256902bc67bc9.r2.dev/arden.pmtiles',

//   defaultOpacity: 0.8,
//   defaultFillColor: 'steelblue',
//   defaultLineColor: '#333',
//   loadDefaultUrl: true,
// });

// THE ADAPTER IS CREATED HERE TO CONNECT THE BRIDGE BETWEEN THE PMTILES LAYER CONTROL AND THE LAYER CONTROL (VISIBLE ASPECTS)
// Create an adapter to integrate PMTiles layers with the layer control


// const pmtilesAdapter = new PMTilesLayerAdapter(pmtilesControl, {
//   name: 'Florence PMTiles',
// });

// // Add layer control with the PMTiles adapter
// const layerControl = new LayerControl({
//   collapsed: true,
//   layers: [],
//   panelWidth: 340,
//   panelMinWidth: 240,
//   panelMaxWidth: 450,
//   basemapStyleUrl: BASEMAP_STYLE,
//   customLayerAdapters: [pmtilesAdapter],

// });


// // TESTING NEW QUICK LAYERS
const pmtilesControl = new PMTilesQuickLayersControl()



const pmtilesAdapter = new PMTilesLayerAdapter(pmtilesControl, {
  name: 'Florence PMTiles',
});

// Add layer control with the PMTiles adapter
const layerControl = new LayerControl({
  collapsed: true,
  layers: [],
  panelWidth: 340,
  panelMinWidth: 240,
  panelMaxWidth: 450,
  basemapStyleUrl: BASEMAP_STYLE,
  customLayerAdapters: [pmtilesAdapter],

});







map.addControl(layerControl, 'top-right');

map.addControl(pmtilesControl, 'top-right');

// Listen for layer events
pmtilesControl.on('layeradd', (event) => {
  console.log('PMTiles layer added:', event.url, 'id:', event.layerId);
});

pmtilesControl.on('layerremove', (event) => {
  console.log('PMTiles layer removed:', event.layerId);
});

pmtilesControl.on('error', (event) => {
  console.error('PMTiles layer error:', event.error);
});
