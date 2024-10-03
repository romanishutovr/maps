import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Sample icons data
const icons = [
  { name: 'Default', url: '/free-icon-location-11768987.png' },
  { name: 'Star', url: '/star_10171019.png' },
  { name: 'Hart', url: '/favorite_15049585.png' },
];

const MapComponent = () => {
  const [zoomLevel, setZoomLevel] = useState(13);
  const position = [51.505, -0.09];
  const [markers, setMarkers] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(icons[0]); // Default icon
  const [iconInput, setIconInput] = useState('');
  const [filteredIcons, setFilteredIcons] = useState(icons);

  // Настройка кастомной иконки маркера с изменяемым размером
  const createIcon = (zoom, iconUrl) => {
    return new L.Icon({
      iconUrl: iconUrl,
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
        setMarkers((current) => [...current, { lat, lng, icon: selectedIcon }]); // Добавление нового маркера с выбранной иконкой
      },
    });
    return null;
  };

  const handleRemoveMarker = (index) => {
    setMarkers((current) => current.filter((_, i) => i !== index)); // Удаление маркера по индексу
  };

  const handleIconInputChange = (e) => {
    const value = e.target.value;
    setIconInput(value);
    // Фильтрация иконок на основе ввода
    setFilteredIcons(icons.filter(icon => icon.name.toLowerCase().includes(value.toLowerCase())));
  };

  const handleIconSelect = (icon) => {
    setSelectedIcon(icon);
    setIconInput(icon.name); // Обновление ввода с именем выбранной иконки
    setFilteredIcons(icons); // Сброс списка иконок
  };

  return (
    <div>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {filteredIcons.map((icon, index) => (
          <li 
          key={index} 
          onClick={() => handleIconSelect(icon)} 
          style={{
            cursor: 'pointer',
            padding: '5px',
            border: '1px solid #ccc',
            marginTop: '5px',
            borderColor: selectedIcon.name === icon.name ? 'green' : '#ccc', // Green border if selected
            backgroundColor: selectedIcon.name === icon.name ? '#f0fff0' : 'transparent', // Light background if selected
          }}
        >
          <img src={icon.url} alt={icon.name} style={{ width: '20px', marginRight: '5px' }} />
          {icon.name}
        </li>
        ))}
      </ul>
      
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
            <Marker key={index} position={[marker.lat, marker.lng]} icon={createIcon(zoomLevel, marker.icon.url)} 
            eventHandlers={{
              contextmenu: () => handleRemoveMarker(index), // Удаление маркера правым кликом
            }}>
              <Popup>
                Новый маркер на координатах: {marker.lat}, {marker.lng}
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        <MapEvents />
        <AddMarkerOnClick />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
