import { useMapEvents } from 'react-leaflet';

const MapEvents = ({ setZoomLevel, setMarkers, selectedIcon, setCurrentPolygon, currentPolygon, setPolygons }) => {
  useMapEvents({
    zoomend: (e) => setZoomLevel(e.target.getZoom()),
    click: (e) => {
      const { lat, lng } = e.latlng;
      if(!selectedIcon) return;
      if (selectedIcon.type !== 'zone') {
        setMarkers((current) => [...current, { lat, lng, icon: selectedIcon }]);
      } else {
        setCurrentPolygon((current) => [...current, [lat, lng]]);
      }
    },
    contextmenu: () => {
      if (currentPolygon.length > 0) {
        setPolygons((current) => [...current, currentPolygon]);
        setCurrentPolygon([]);
      }
    },
  });
  return null;
};

export default MapEvents;
