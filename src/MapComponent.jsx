import React, { useState} from 'react';
import { MapContainer, TileLayer, Marker, Polygon, CircleMarker,Popup } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';


import IconSelector from './IconSelector';
import LayerSelector from './LayerSelector';
import ImageOverlayComponent from './ImageOverlayComponent';
import MapEvents from './MapEvents';
import {TrackMouseMovement} from './TrackMouseMovement';
// import {mock} from './mockData';
// import {MarkerRender} from './markers';

const icons = [
  { name: 'Antena', url: '/antena.png', type: 'antena' },
  { name: 'Person', url: '/Person.png', type: 'Person' },
  { name: 'Equipment', url: '/Equipment.png', type: 'Equipment' },
  { name: 'Zone', url: '/free-icon-location-11768987.png', type: 'zone' },
];

const baseLayers = [
  { name: 'OpenStreetMap', url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' },
  { name: 'Esri.WorldImagery', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' },
];

const MapComponent = () => {
  const [zoomLevel, setZoomLevel] = useState(19);
  const position = [33.61676, -86.13979];
  // const position = [mock.records[0].lonlatele[1], mock.records[0].lonlatele[0]];
  const [markers, setMarkers] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [activeLayer, setActiveLayer] = useState(baseLayers[0].url);
  const [planActive, setPlanActive] = useState(false);


  const handleIconSelect = (icon) => setSelectedIcon(icon);

  const handleLayerChange = (event) => setActiveLayer(event.target.value);

    const createIcon = (zoom, iconUrl) => {
      return new L.Icon({
        iconUrl: iconUrl,
        iconSize: [10 + zoom, 10 + zoom],
        iconAnchor: [5 + zoom / 1, 2 + zoom],
      });
    };
    
    const handleRemoveMarker = (index) => {
      setMarkers((current) => current.filter((_, i) => i !== index));
    };
    
    // function generateGridMatrix(baseObj, rows = 10, cols = 500, step = 0.001) {
    //   const matrix = [];
    
    //   for (let i = 0; i < rows; i++) {
    //     for (let j = 0; j < cols; j++) {
    //       // Создаем объект с обновленными координатами
    //       matrix.push({
    //         ...baseObj,
    //         lat: baseObj.lat + i * step,
    //         lng: baseObj.lng + j * step
    //       });
    //     }
    //   }
    
    //   return matrix;
    // }
    
    // Пример использования:
    // const baseObj = {
    //   lat: 33.61827353179906,
    //   lng: -86.14150291551307,
    //   icon: { name: "Person", type: "Person", url: "/Person.png" }
    // };
    
    // const add = (baseObj) => {
    // setMarkers(generateGridMatrix(baseObj).flat())
    // console.log(generateGridMatrix(baseObj))
    // }
    new L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 20,
      maxNativeZoom: 18
  });


  return (
    <div style={{ display: "flex" }}>
      <MapContainer center={position} zoom={zoomLevel} style={{ height: '650px', width: '800px' }} >
        <TileLayer url={activeLayer} maxZoom={22}
    maxNativeZoom={18}/>

        { <MarkerClusterGroup showCoverageOnHover={false} zoomToBoundsOnClick={true}>
          {markers.map((marker, index) => (
            <Marker
            // key={index}
            // position={[marker.lonlatele[1], marker.lonlatele[0]]}
            // icon={createIcon(zoomLevel, "/Person.png")}
            key={index}
            position={[marker.lat, marker.lng]}
            icon={createIcon(zoomLevel, marker.icon.url)}
            eventHandlers={{
              contextmenu: () => handleRemoveMarker(index),
            }}
          >
            <Popup>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src={marker.icon.url} alt={marker.icon.name} style={{ width: "40px", height: "40px", marginRight: "20px" }} />
                {marker.icon.name}
              </div>
            </Popup>
          </Marker>
          ))}
        </MarkerClusterGroup> }
        
        {polygons.map((polygon, index) => (
          <Polygon key={index} positions={polygon} color="blue" />
        ))}
        {currentPolygon.length > 0 && (
          <>
            <Polygon positions={currentPolygon} color="red" />
            {currentPolygon.map((point, index) => (
              <CircleMarker key={index} center={point} radius={5} pathOptions={{ color: 'red' }} />
            ))}
          </>
        )}
        {planActive && (
          <ImageOverlayComponent
          />
        )}
        <MapEvents
          setZoomLevel={setZoomLevel}
          setMarkers={setMarkers}
          selectedIcon={selectedIcon}
          setCurrentPolygon={setCurrentPolygon}
          currentPolygon={currentPolygon}
          setPolygons={setPolygons}
          // setCurrentPosition={setCurrentPosition}
        />
        <TrackMouseMovement />
    {/* <MarkerRender/> */}

      </MapContainer>

      <div style={{ marginLeft: "10px" }}>
        <button onClick={() => setPlanActive(!planActive)}>
          {planActive ? 'Disable Plan' : 'Enable Plan'}
        </button>
        <LayerSelector baseLayers={baseLayers} activeLayer={activeLayer} handleLayerChange={handleLayerChange} />
        <IconSelector icons={icons} selectedIcon={selectedIcon} handleIconSelect={handleIconSelect} />
      </div>
    </div>
  );
};

export default MapComponent;
