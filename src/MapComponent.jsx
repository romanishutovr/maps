import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Используем обновленный плагин для кластеризации маркеров
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const MapComponent = () => {
  const [zoomLevel, setZoomLevel] = useState(13);
  const position = [51.505, -0.09];
  const [markers, setMarkers] = useState([]);

  // Настройка кастомной иконки маркера с изменяемым размером
  const createIcon = (zoom) => {
    return new L.Icon({
      iconUrl: '/free-icon-location-11768987.png',
      iconSize: [25 + zoom, 41 + zoom], // Изменение размера в зависимости от зума
      iconAnchor: [12 + zoom / 2, 41 + zoom],
    });
  };

  // Отслеживание события изменения зума
  const MapEvents = () => {
    useMapEvents({
      zoomend: (e) => {
        setZoomLevel(e.target.getZoom());
      },
    });
    return null;
  };

  const AddMarkerOnClick = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng; // Получение координат клика
        setMarkers((current) => [...current, { lat, lng }]); // Добавление нового маркера
      },
    });
    return null;
  };

  return (
    <MapContainer center={position} zoom={zoomLevel} style={{ height: '500px', width: '500px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MarkerClusterGroup
        showCoverageOnHover={false} 
        spiderfyOnMaxZoom={false} 
        zoomToBoundsOnClick={true} 
        maxClusterRadius={40} 
      >
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]} icon={createIcon(zoomLevel)}>
            <Popup>
              Новый маркер на координатах: {marker.lat}, {marker.lng}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
      <MapEvents />
      <AddMarkerOnClick />
    </MapContainer>
  );
};

export default MapComponent;
