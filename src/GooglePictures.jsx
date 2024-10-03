import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  height: '500px',
  width: '500px',
};

const center = {
  lat: 51.505, // Начальная широта
  lng: -0.09,  // Начальная долгота
};

const GooglePictures = () => {
  const [markers, setMarkers] = useState([]); // Состояние для хранения маркеров

  // Функция для добавления маркера при клике на карту
  const onMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkers((current) => [...current, { lat, lng }]); // Добавляем новый маркер
  };

  const onMarkerRightClick = (index) => {
    setMarkers((current) => current.filter((_, i) => i !== index)); // Удаляем маркер по индексу
  };

  return (
    <LoadScript googleMapsApiKey=""> {/* Замените YOUR_API_KEY на ваш ключ */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        onClick={onMapClick} // Обработчик клика по карте
      >
        {markers.map((marker, index) => (
          <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} 
          onRightClick={() => onMarkerRightClick(index)}/> // Отображение маркеров
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default GooglePictures;
