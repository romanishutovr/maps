import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Используем обновленный плагин для кластеризации маркеров
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const MapPictures = () => {
  const [zoomLevel, setZoomLevel] = useState(1); // Начальный уровень зума
  const [markers, setMarkers] = useState([]);
  const position = [0, 0]; // Центр для изображения
  const bounds = [[-90, -180], [90, 180]]; // Указать границы изображения (нижний левый и верхний правый углы)

  // Настройка кастомной иконки маркера с изменяемым размером
  const createIcon = (zoom) => {
    return new L.Icon({
      iconUrl: '/free-icon-location-11768987.png',
      iconSize: [25 + zoom * 10, 41 + zoom * 10], // Изменение размера в зависимости от зума
      iconAnchor: [12 + (zoom * 10) / 2, 41 + (zoom * 10)],
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
        setMarkers((current) => [...current, { lat, lng }]); // Добавление нового маркера
      },
    });
    return null;
  };

  return (
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
          <Marker key={index} position={[marker.lat, marker.lng]} icon={createIcon(zoomLevel)}>
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
  );
};

export default MapPictures;
