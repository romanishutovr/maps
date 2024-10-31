import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { mock } from './mockData';

export const MarkerRender = () => {
  const map = useMap();

  // Loop through records to create and add each dot to the map
  for (let i = 0; i < mock.records.length; i += 1) {
    L.circleMarker(
      [mock.records[i].lonlatele[1], mock.records[i].lonlatele[0]],
      {
        radius: 0.01, // Set the radius of the dot
        color: 'blue', // Set the color of the dot
        fillColor: 'blue', // Fill color
        fillOpacity: 1 // Fill opacity
      }
    )
    .bindPopup('marker ' + i)
    .addTo(map);
  }

  return null;
};
