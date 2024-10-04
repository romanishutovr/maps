import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const icons = [
  { name: 'Antena', url: '/antena.png', type: 'antena' },
  { name: 'Person', url: '/Person.png', type: 'Person' },
  { name: 'Equipment', url: '/Equipment.png', type: 'Equipment' },
  { name: 'Zone', url: '/free-icon-location-11768987.png', type: 'zone' },
];

// Define the base layers
const baseLayers = [
  { name: 'OpenStreetMap', url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' },
  { name: 'Esri.WorldImagery', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' }
];

const MapComponent = () => {
  const [zoomLevel, setZoomLevel] = useState(19);
  const position = [41.67720, -93.71894];
  const [markers, setMarkers] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(icons[0]);
  const [filteredIcons, setFilteredIcons] = useState(icons);
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const cursorCoordsRef = useRef(null);
  const [cursorCoords, setCursorCoords] = useState(null);
  const [activeLayer, setActiveLayer] = useState(baseLayers[0].url); // Initialize with the first layer

  const createIcon = (zoom, iconUrl) => {
    return new L.Icon({
      iconUrl: iconUrl,
      iconSize: [10 + zoom, 10 + zoom],
      iconAnchor: [5 + zoom / 1,2 + zoom],
    });
  };

  const MapEvents = () => {
    useMapEvents({
      zoomend: (e) => {
        setZoomLevel(e.target.getZoom());
      },
    });
    return null;
  };

  const TrackMouseMovement = () => {
    useMapEvents({
      mousemove: (e) => {
        cursorCoordsRef.current = e.latlng;
        setCursorCoords(e.latlng);
      },
    });
    return null;
  };

  const AddMarkerOnClick = () => {
    useMapEvents({
      click(e) {
        if (selectedIcon.type === 'zone') return;
        const { lat, lng } = e.latlng;
        setMarkers((current) => [...current, { lat, lng, icon: selectedIcon }]);
      },
    });
    return null;
  };

  const AddPolygonOnClick = () => {
    useMapEvents({
      click(e) {
        if (selectedIcon.type !== 'zone') return;
        const { lat, lng } = e.latlng;
        setCurrentPolygon((current) => [...current, [lat, lng]]);
      },
      contextmenu() {
        if (currentPolygon.length > 0) {
          setPolygons((current) => [...current, currentPolygon]);
          setCurrentPolygon([]);
        }
      },
    });
    return null;
  };

  const handleRemoveMarker = (index) => {
    setMarkers((current) => current.filter((_, i) => i !== index));
  };

  const handleIconSelect = (icon) => {
    setSelectedIcon(icon);
    setFilteredIcons(icons);
  };

  // Handle layer change
  const handleLayerChange = (event) => {
    setActiveLayer(event.target.value);
  };

  return (
    <div style={{display:"flex"}}>
      <MapContainer 
  center={position} 
  zoom={zoomLevel} 
  fullscreenControl={true}  
  style={{ height: '650px', width: '800px', marginRight:"20px" }}
  
>
  <TileLayer url={activeLayer} />
  <MarkerClusterGroup showCoverageOnHover={false} zoomToBoundsOnClick={true} maxClusterRadius={40}>
    {markers.map((marker, index) => (
      <Marker
        key={index}
        position={[marker.lat, marker.lng]}
        icon={createIcon(zoomLevel, marker.icon.url)}
        eventHandlers={{
          contextmenu: () => handleRemoveMarker(index),
        }}
      >
        <Popup>
              <div style={{display:"flex", alignItems: "center"}}>
                <img src={marker.icon.url} alt={marker.icon.name} style={{width:"40px", height:"40px", marginRight:"20px"}}>
                </img>
                <div>
                <p> Some {marker.icon.name}</p>
                <p>Short description </p>
                </div>
              </div>
              </Popup>
      </Marker>
    ))}
  </MarkerClusterGroup>
  {polygons.map((polygon, index) => (
    <Polygon key={index} positions={polygon} color="blue" fillOpacity={0} dashArray="5, 5" />
  ))}
  
  {currentPolygon.length > 0 && (
    <Polygon positions={currentPolygon} color="red" fillOpacity={0.3} dashArray="5, 5" />
  )}

  <MapEvents />
  <TrackMouseMovement />
  <AddMarkerOnClick />
  <AddPolygonOnClick />
</MapContainer>
      <div>
      <ul style={{ listStyleType: 'none', padding: 0, width:"200px" }}>
        {filteredIcons.map((icon, index) => (
          <li
            key={index}
            onClick={() => handleIconSelect(icon)}
            style={{
              display:"flex",
              alignItems: "center",
              cursor: 'pointer',
              padding: '5px',
              border: '1px solid #ccc',
              marginTop: '5px',
              borderColor: selectedIcon.name === icon.name ? 'green' : '#ccc',
              backgroundColor: selectedIcon.name === icon.name ? '#f0fff0' : 'transparent',
            }}
          >
            <img src={icon.url} alt={icon.name} style={{ width: '20px', marginRight: '5px' }} />
            {icon.name}
          </li>
        ))}
      </ul>
      
      <div style={{ display:"flex", flexDirection:"row",alignItems: "center" }} >
        <p style={{ height:"20px", marginRight:"10px"}} >Select layer:</p>
      <select style={{  marginRight:"20px"}} onChange={handleLayerChange} value={activeLayer}>
        {baseLayers.map((layer) => (
          <option key={layer.name} value={layer.url}>
            {layer.name}
          </option>
        ))}
      </select>
      {cursorCoords && (
        <div >
          lonlat [{cursorCoords.lat.toFixed(5)}, {cursorCoords.lng.toFixed(5)}]
        </div>
      )}
      </div>
      </div>
      
    </div>
  );
};

export default MapComponent;
