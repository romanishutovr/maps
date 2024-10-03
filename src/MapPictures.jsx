import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Используем обновленный плагин для кластеризации маркеров
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const icons = [
  { name: 'Default', url: '/free-icon-location-11768987.png' },
  { name: 'Star', url: '/star_10171019.png' },
  { name: 'Hart', url: '/favorite_15049585.png' },
];

const MapPictures = () => {
  const [zoomLevel, setZoomLevel] = useState(1); // Начальный уровень зума
  const [markers, setMarkers] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(icons[0]); // Default icon
  const [iconInput, setIconInput] = useState('');
  const [filteredIcons, setFilteredIcons] = useState(icons);
  const position = [0, 0]; // Центр для изображения
  const bounds = [[-90, -180], [90, 180]]; // Указать границы изображения (нижний левый и верхний правый углы)


  // Настройка кастомной иконки маркера с изменяемым размером
  const createIcon = (zoom, iconUrl) => {
    return new L.Icon({
      iconUrl: iconUrl,
      iconSize: [25 + zoom, 41 + zoom], // Изменение размера в зависимости от зума
      iconAnchor: [12 + zoom / 2, 41 + zoom],
    });
  };


  // Внутри вашего компонента:
  const ImageOverlay = () => {
    const map = useMap(); // Получаем экземпляр карты

    useEffect(() => {
      const imageUrl = '/image.png'; // Укажите путь к вашему изображению
      const imageOverlay = L.imageOverlay(imageUrl, bounds).addTo(map);
      
      // Установка ограничений на движение карты
      map.setMaxBounds(bounds); // Устанавливаем максимальные границы карты

      // Чистим эффект, когда компонент размонтируется
      return () => {
        map.removeLayer(imageOverlay);
        map.setMaxBounds(null); // Сбрасываем максимальные границы
      };
    }, [map]);

    return null;
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
        setMarkers((current) => [...current, { lat, lng, icon: selectedIcon }]); // Добавление нового маркера
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
    <MapContainer 
      center={position} 
      zoom={1} 
      style={{ height: '500px', width: '500px' }} // Измените на 100% высоты и ширины
      maxZoom={5}
      scrollWheelZoom={false} // Отключаем зум при скролле для лучшего опыта
    >
      <MarkerClusterGroup
        showCoverageOnHover={false} 
        spiderfyOnMaxZoom={false} 
        zoomToBoundsOnClick={true} 
        maxClusterRadius={40} 
      >
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]} icon={createIcon(zoomLevel, marker.icon.url)}
          eventHandlers={{
            contextmenu: () => handleRemoveMarker(index), // Remove marker on right-click
          }}
          >
            <Popup>
              Новый маркер на координатах: {marker.lat}, {marker.lng}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
      <ImageOverlay />
      <MapEvents />
      <AddMarkerOnClick />
    </MapContainer>
    </div>
  );
};

export default MapPictures;
