import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents, useMap,CircleMarker } from 'react-leaflet';
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
  const position = [33.61676, -86.13979];
  const [markers, setMarkers] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(icons[0]);
  const [filteredIcons, setFilteredIcons] = useState(icons);
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const cursorCoordsRef = useRef(null);
  const [cursorCoords, setCursorCoords] = useState(null);
  const [activeLayer, setActiveLayer] = useState(baseLayers[0].url); // Initialize with the first layer
  const [imageOpacity, setImageOpacity] = useState(0.5);
  const [imageSize, setImageSize] = useState({ width: 0.069, height: 0.045 });

  const [overlayPosition, setOverlayPosition] = useState([33.587859999999864, -86.16768999999995]);
  // const [isDragging, setIsDragging] = useState(false);
  // const [startCoords, setStartCoords] = useState(null);
  const [planActive, setPlanActive] = useState(false);
  const mapRef = useRef(null);

  const createIcon = (zoom, iconUrl) => {
    return new L.Icon({
      iconUrl: iconUrl,
      iconSize: [10 + zoom, 10 + zoom],
      iconAnchor: [5 + zoom / 1, 2 + zoom],
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
  
  // // Обработчик начала перетаскивания
  // const handleMouseDown = (e) => {
  //   setIsDragging(true);
  //   setStartCoords(e.latlng);
  // };

  // // Обработчик окончания перетаскивания
  // const handleMouseUp = (e) => {
  //   setIsDragging(false);
  // };

  // // Обработчик перетаскивания
  // const handleMouseMove = (e) => {
  //   if (isDragging) {
  //     const newLat = overlayPosition[0] + (e.latlng.lat - startCoords.lat);
  //     const newLng = overlayPosition[1] + (e.latlng.lng - startCoords.lng);
  //     setOverlayPosition([newLat, newLng]);
  //     setStartCoords(e.latlng); // Обновляем начальные координаты
  //   }
  // };

  // Обработчик перемещения оверлея с помощью клавиш
  const handleKeyDown = (e) => {
    const step = 0.01; // Шаг перемещения
    switch (e.key) {
      case 'ArrowUp':
        setOverlayPosition((prev) => [prev[0] + step, prev[1]]);
        break;
      case 'ArrowDown':
        setOverlayPosition((prev) => [prev[0] - step, prev[1]]);
        break;
      case 'ArrowLeft':
        setOverlayPosition((prev) => [prev[0], prev[1] - step]);
        break;
      case 'ArrowRight':
        setOverlayPosition((prev) => [prev[0], prev[1] + step]);
        break;
        case 'z':
          if (e.ctrlKey) { // Проверяем, нажаты ли Ctrl и Z
            e.preventDefault(); // Предотвращаем стандартное действие браузера
            setCurrentPolygon((prev) => prev.slice(0, -1)); // Удаляем последнюю точку
          }
          break;
      default:
        break;
    }
  };
  

  const ImageOverlay = () => {
    const map = useMap();
    const overlayRef = useRef(null);
    const draggingRef = useRef(false);
    const startCoordsRef = useRef(null);

    useEffect(() => {
        const imageUrl = '/100XC0101_page-0001.jpg';
        const imageBounds = [
            [overlayPosition[0], overlayPosition[1]], // Updated position
            [overlayPosition[0] + imageSize.height, overlayPosition[1] + imageSize.width],
        ];

        if (overlayRef.current) {
            map.removeLayer(overlayRef.current);
        }

        overlayRef.current = L.imageOverlay(imageUrl, imageBounds, {
            opacity: imageOpacity,
            interactive: true,
        }).addTo(map);

        // Mouse down to initiate dragging
        overlayRef.current.getElement().addEventListener('mousedown', (e) => {
            draggingRef.current = true;
            map.dragging.disable(); // Disable map dragging while dragging the overlay
            startCoordsRef.current = map.mouseEventToLatLng(e);
        });

        // Mouse move to handle dragging
        map.on('mousemove', (e) => {
            if (!draggingRef.current) return;

            const currentCoords = e.latlng;
            const latOffset = currentCoords.lat - startCoordsRef.current.lat;
            const lngOffset = currentCoords.lng - startCoordsRef.current.lng;

            setOverlayPosition((prev) => [prev[0] + latOffset, prev[1] + lngOffset]);
            startCoordsRef.current = currentCoords;
        });

        // Mouse up to stop dragging
        map.on('mouseup', () => {
            if (draggingRef.current) {
                draggingRef.current = false;
                map.dragging.enable(); // Re-enable map dragging after overlay drag
            }
        });

        overlayRef.current.bringToFront();

        return () => {
            if (overlayRef.current) {
                map.removeLayer(overlayRef.current);
            }
        };
    }, [map, overlayPosition, imageOpacity, imageSize]);

    return null;
};




  // Обработчик изменения ширины
  const handleWidthChange = (e) => {
    const newWidth = parseFloat(e.target.value);
    setImageSize((prev) => ({
      ...prev,
      width: newWidth,
    }));
  };

  // Обработчик изменения высоты
  const handleHeightChange = (e) => {
    const newHeight = parseFloat(e.target.value);
    setImageSize((prev) => ({
      ...prev,
      height: newHeight,
    }));
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Функции для перемещения оверлея
  const moveOverlay = (latOffset, lngOffset) => {
    setOverlayPosition((prev) => [prev[0] + latOffset, prev[1] + lngOffset]);
  };

  useEffect(() => {console.log(overlayPosition)}, [overlayPosition]);

  return (
    <div style={{ display: "flex" }}>
      <MapContainer
        center={position}
        zoom={zoomLevel}
        fullscreenControl={true}
        style={{ height: '650px', width: '800px', marginRight: "20px", cursor:"default"}}
        whenReady={(map) => {
          mapRef.current = map;
        }}
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src={marker.icon.url} alt={marker.icon.name} style={{ width: "40px", height: "40px", marginRight: "20px" }} />
                  {marker.icon.name}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        {polygons.map((polygon, index) => (
            <Polygon key={index} positions={polygon} color="blue" fillOpacity={0} dashArray="5, 5"  />
          ))}
          
          {currentPolygon.length > 0 && (
          <>
            <Polygon positions={currentPolygon} color="red" fillOpacity={0} dashArray="5, 5" />
            {currentPolygon.map((point, index) => (
              <CircleMarker
                key={index}
                center={point}
                radius={5}
                pathOptions={{ color: 'red' }} // Set circle color to red
              />
            ))}
          </>
        )}
        {planActive && <ImageOverlay />}
        <MapEvents />
        <AddMarkerOnClick />
        <AddPolygonOnClick />
        <TrackMouseMovement />
      </MapContainer>
      <div style={{ marginLeft: "10px" }}>
      <button onClick={() => {
        setPlanActive(!planActive)

      }} style={{ marginTop: '10px' }}>
          {planActive ? 'Disable Plan' : 'Enable Plan'}
        </button>
      {planActive &&<div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="imageOpacity">Image Opacity: </label>
          <input
            id="imageOpacity"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={imageOpacity}
            onChange={(e) => setImageOpacity(parseFloat(e.target.value))}
          />
          <span>{imageOpacity}</span>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="widthRange">Width: </label>
          <input
            id="widthRange"
            type="range"
            min="0.001"
            max="0.1"
            step="0.001"
            value={imageSize.width}
            onChange={handleWidthChange}
            style={{ marginLeft: '10px' }}
          />
          <span style={{ marginLeft: '10px' }}>{imageSize.width}</span>
        </div>
        <div>
          <label htmlFor="heightRange">Height: </label>
          <input
            id="heightRange"
            type="range"
            min="0.001"
            max="0.1"
            step="0.001"
            value={imageSize.height}
            onChange={handleHeightChange}
            style={{ marginLeft: '10px' }}
          />
          <span style={{ marginLeft: '10px' }}>{imageSize.height}</span>
        </div>

        

        {/* Кнопки для перемещения */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
          <button onClick={() => moveOverlay(0.0001, 0)}>Up</button>
          <div style={{ display: 'flex' }}>
            <button onClick={() => moveOverlay(0, -0.0001)}>Left</button>
            <button onClick={() => moveOverlay(0, 0.0001)}>Right</button>
          </div>
          <button onClick={() => moveOverlay(-0.0001, 0)}>Down</button>
        </div>
        </div>}

        <ul style={{ listStyleType: 'none', padding: 0, width: "200px" }}>
          {filteredIcons.map((icon, index) => (
            <li
              key={index}
              onClick={() => handleIconSelect(icon)}
              style={{
                display: "flex",
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

          <div style={{display:"flex",alignItems:"center", height:"20px", margin:"10px"}}>
          <p >Select layer:</p>
          <select style={{ marginRight: "20px" }} onChange={handleLayerChange} value={activeLayer}>
            {baseLayers.map((layer) => (
              <option key={layer.name} value={layer.url}>
                {layer.name}
              </option>
            ))}
          </select>
          </div>
          {cursorCoords && (
            <div>
              lonlat [{cursorCoords.lat.toFixed(5)}, {cursorCoords.lng.toFixed(5)}]
            </div>
          )}
        
      </div>
    </div>
  );
};

export default MapComponent;
