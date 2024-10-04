import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, Popup, useMap,Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-fullscreen';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
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

const MapPictures = () => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [markers, setMarkers] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(icons[0]);
  const [filteredIcons, setFilteredIcons] = useState(icons);
  const position = [49.98251522092236, 36.22808754444123];
  const bounds = [[-90, -180], [90, 180]];

  const [currentPolygon, setCurrentPolygon] = useState([]);
  const [polygons, setPolygons] = useState([]);
  useEffect(() => {
    console.log(currentPolygon, polygons);
  }, [currentPolygon, polygons]);


  useEffect(() => {
    console.log(markers);
  }, [markers]);

  const createIcon = (zoom, iconUrl) => {
    return new L.Icon({
      iconUrl: iconUrl,
      iconSize: [20 + zoom, 20 + zoom],
      iconAnchor: [10 + zoom / 2,2 + zoom],
    });
  };

  const ImageOverlay = () => {
    const map = useMap();

    useEffect(() => {
      const imageUrl = '/image.png';
      const imageOverlay = L.imageOverlay(imageUrl, bounds).addTo(map);
      map.setMaxBounds(bounds);


      return () => {
        map.removeLayer(imageOverlay);
        map.setMaxBounds(null);
      };
    }, [map]);

    return null;
  };

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
        if(selectedIcon.type === 'zone') return
        const { lat, lng } = e.latlng;
        setMarkers((current) => [...current, { lat, lng, icon: selectedIcon }]);
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

  const AddPolygonOnClick = () => {
    useMapEvents({
      click(e) {
        if(selectedIcon.type !== 'zone') return
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

  return (
    <div style={{ display:"flex" }}>

<MapContainer
       fullscreenControl={true}
        center={position}
        zoom={1}
        style={{ height: '650px', width: '800px', marginRight:"20px" }}
        maxZoom={5}
      >
        <MarkerClusterGroup
          showCoverageOnHover={false}
          spiderfyOnMaxZoom={false}
          zoomToBoundsOnClick={true}
          maxClusterRadius={40}
        >
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
          {polygons.map((polygon, index) => (
            <Polygon key={index} positions={polygon} color="blue" fillOpacity={0} dashArray="5, 5"  />
          ))}
          
          {currentPolygon.length > 0 && (
            <Polygon positions={currentPolygon} color="red" fillOpacity={0.3} dashArray="5, 5" />
          )}
        </MarkerClusterGroup>
        <ImageOverlay />
        <MapEvents />
        <AddMarkerOnClick />
        <AddPolygonOnClick />
      </MapContainer>
      <div>
      <ul style={{ listStyleType: 'none', padding: 0,width:"200px" }}>
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
      </div>

    </div>
  );
};

export default MapPictures;
