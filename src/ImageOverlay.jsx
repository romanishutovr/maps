import { useRef, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-path-drag'; // Import the plugin for draggable paths

export const ImageOverlay = () => {
  const [imageOpacity, setImageOpacity] = useState(0.5);
  const [imageSize, setImageSize] = useState({ width: 0.069, height: 0.045 });
  const [overlayPosition, setOverlayPosition] = useState([33.587859999999864, -86.16768999999995]);

  const imageUrl = '/100XC0101_page-0001.jpg';
  const initialBounds = [
    [overlayPosition[0], overlayPosition[1]],
    [overlayPosition[0] + imageSize.height, overlayPosition[1] + imageSize.width],
  ];

  const map = useMap();
  const imageOverlayRef = useRef(null);
  const polygonRef = useRef(null);
  

    if (!map) return;  // Ensure map is defined before proceeding

    // Initialize polygon with draggable paths
    const polygonCoords = [
      [initialBounds[0][0], initialBounds[0][1]],
      [initialBounds[0][0], initialBounds[1][1]],
      [initialBounds[1][0], initialBounds[1][1]],
      [initialBounds[1][0], initialBounds[0][1]],
    ];

    // Create the polygon
    // const polygon = L.polygon(polygonCoords, { color: "red", fillOpacity: 0, dashArray: "5, 5", draggable: true }).addTo(map);
    
    // polygonRef.current = polygon;
    // Create the image overlay
    const imageOverlay = L.imageOverlay(imageUrl, initialBounds, { opacity: imageOpacity, interactive: true }).addTo(map);
    imageOverlayRef.current = imageOverlay;

    // Enable dragging for the polygon
    // polygon.dragging.enable();

    // Handle drag event to update bounds and overlay position
    // polygon.on("drag", () => {
    //   if (!imageOverlay || !map) return; // Add null checks to avoid errors
    //   const latLngs = polygon.getLatLngs()[0];
    //   const newBounds = L.latLngBounds(latLngs);
      
    //   // Update the image overlay bounds
    //   imageOverlay.setBounds(newBounds);
    //   polygonRef.current.opacity = 0

    //   // Calculate new position for the overlay (using the bottom-left corner as reference)
    //   const newOverlayPosition = [newBounds.getSouthWest().lat, newBounds.getSouthWest().lng];

    //   // Update the component state with the new position
    //   setOverlayPosition(newOverlayPosition);
    // });



    // Cleanup on component unmount
    // return () => {
    //   if (imageOverlay) map.removeLayer(imageOverlay);
    //   if (polygon) map.removeLayer(polygon);
    // };

    

  return (
    <div>
      <p>Overlay Position: {JSON.stringify(overlayPosition)}</p>
      <p>Image Size: {JSON.stringify(imageSize)}</p>
    </div>
  );
};
