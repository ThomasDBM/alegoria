function addRasterLayers(itowns, view, menuGlobe) {

  // Add one imagery layer to the scene
  // This layer is defined in a json file but it could be defined as a plain js
  // object. See Layer* for more info.
  itowns.Fetcher.json('../../itowns/examples/layers/JSONLayers/Ortho.json').then(function _(config) {
      config.source = new itowns.WMTSSource(config.source);
      var layer = new itowns.ColorLayer('Ortho', config);
      view.addLayer(layer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
  });


                  // Call WMS source on Geoserver for Heatmap
                  const wmsSource = new itowns.WMSSource({
                    url: 'http://localhost:8080/geoserver/cite/wms',
                    version: '1.3.0',
                    name: 'PointGridView',
                    style: '',
                    format: 'image/png',
                    crs: 'EPSG:3857',
                    extent: {
                        west: '-0,05184205',
                        east: '656895,53',
                        south: '0',
                        north: '6984581,76',
                    },
                    transparent: true,
                });
                
                
                // Create the layer
                const colorlayer = new itowns.ColorLayer('HeatMap', {
                    source: wmsSource,
                    visible: false,
                    opacity: 0.6,
                });
    
                // Add the layer
                view.addLayer(colorlayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));


  /*          // USA ORTHO WMTS
  itowns.Fetcher.json('../itowns-photogrammetric-camera/examples/layers/JSONLayers/us.json').then(function _(config) {
      config.source = new itowns.WMTSSource(config.source);
      var layerUS = new itowns.ColorLayer('USGS', config);
      view.addLayer(layerUS).then(menuGlobe.addLayerGUI.bind(menuGlobe));
  });
  */
  // Add two elevation layers.
  // These will deform iTowns globe geometry to represent terrain elevation.
  function addElevationLayerFromConfig(config) {
      config.source = new itowns.WMTSSource(config.source);
      var layer = new itowns.ElevationLayer(config.id, config);
      view.addLayer(layer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
  }
  itowns.Fetcher.json('../../itowns/examples/layers/JSONLayers/WORLD_DTM.json').then(addElevationLayerFromConfig);
  itowns.Fetcher.json('../../itowns/examples/layers/JSONLayers/IGN_MNT_HIGHRES.json').then(addElevationLayerFromConfig);

}
