import React, { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const ImageOverlayComponent = () => {
  const [overlayPosition, setOverlayPosition] = useState([
    {lat: 33.6327735188563, lng: -86.09795928261377},
    {lat: 33.588244890412476, lng: -86.16818079875364},
  ]);
  const [opacity, setOpacity] = useState(1); // State for overlay opacity

  const map = useMap();
  const overlayRef = useRef(null);
  const draggingRef = useRef(false);
  const startCoordsRef = useRef(null);
  const corner1Ref = useRef(null);
  const corner2Ref = useRef(null);
  const moveRef = useRef(null);
  const currentPositionsRef = useRef(overlayPosition); // Ref to track the current positions

  const createIcon = (zoom, iconUrl) => {
    return new L.Icon({
      iconUrl: iconUrl,
      iconSize: [20 + zoom, 20 + zoom],
      iconAnchor: [10 + zoom / 2, 2 + zoom],
    });
  };

  useEffect(() => {
    const imageUrl = '/100XC0101_page-0001.jpg';

    const imageBounds = [
      [overlayPosition[0].lat, overlayPosition[0].lng],
      [overlayPosition[1].lat, overlayPosition[1].lng],
    ];

    // Remove existing overlays if they exist
    if (overlayRef.current) {
      map.removeLayer(overlayRef.current);
    }
    if (corner1Ref.current) {
      map.removeLayer(corner1Ref.current);
    }
    if (corner2Ref.current) {
      map.removeLayer(corner2Ref.current);
    }
    if (moveRef.current) {
      map.removeLayer(moveRef.current);
    }

    // Add image overlay with initial opacity
    overlayRef.current = L.imageOverlay(imageUrl, imageBounds, {
      interactive: true,
      opacity: opacity, // Set initial opacity
    }).addTo(map);

    corner1Ref.current = L.marker(
      [overlayPosition[0].lat, overlayPosition[0].lng],
      { icon: createIcon(0, "./up-right-arrow.png"), draggable: true }
    ).addTo(map);

    corner2Ref.current = L.marker(
      [overlayPosition[1].lat, overlayPosition[1].lng],
      { icon: createIcon(0, "./arrow-left.png"), draggable: true }
    ).addTo(map);

    moveRef.current = L.marker(
      overlayRef.current.getBounds().getCenter(),
      { icon: createIcon(0, "./move.png"), draggable: true }
    ).addTo(map);

    const updateOverlayBounds = () => {
      const bounds = [corner1Ref.current.getLatLng(), corner2Ref.current.getLatLng()];
      overlayRef.current.setBounds(bounds);
      currentPositionsRef.current = [
        corner1Ref.current.getLatLng(),
        corner2Ref.current.getLatLng(),
      ];
      console.log(currentPositionsRef.current)
      moveRef.current.setLatLng(overlayRef.current.getBounds().getCenter());
    };

    corner1Ref.current.on('drag', updateOverlayBounds);
    corner2Ref.current.on('drag', updateOverlayBounds);

    const handleMoveDrag = (e) => {
      const currentPosition = e.target.getLatLng();
      const latOffset = currentPosition.lat - overlayRef.current.getBounds().getCenter().lat;
      const lngOffset = currentPosition.lng - overlayRef.current.getBounds().getCenter().lng;

      const newCorner1Position = new L.LatLng(
        currentPositionsRef.current[0].lat + latOffset,
        currentPositionsRef.current[0].lng + lngOffset
      );
      const newCorner2Position = new L.LatLng(
        currentPositionsRef.current[1].lat + latOffset,
        currentPositionsRef.current[1].lng + lngOffset
      );

      corner1Ref.current.setLatLng(newCorner1Position);
      corner2Ref.current.setLatLng(newCorner2Position);
      updateOverlayBounds();
    };

    moveRef.current.on('drag', handleMoveDrag);

    const handleMouseDown = (e) => {
      draggingRef.current = true;
      map.dragging.disable();
      startCoordsRef.current = map.mouseEventToLatLng(e);
    };

    const handleMouseMove = (e) => {
      if (!draggingRef.current) return;

      const currentCoords = e.latlng;
      const latOffset = currentCoords.lat - startCoordsRef.current.lat;
      const lngOffset = currentCoords.lng - startCoordsRef.current.lng;

      const newCorner1Position = new L.LatLng(
        currentPositionsRef.current[0].lat + latOffset,
        currentPositionsRef.current[0].lng + lngOffset
      );
      const newCorner2Position = new L.LatLng(
        currentPositionsRef.current[1].lat + latOffset,
        currentPositionsRef.current[1].lng + lngOffset
      );

      corner1Ref.current.setLatLng(newCorner1Position);
      corner2Ref.current.setLatLng(newCorner2Position);
      updateOverlayBounds();

      startCoordsRef.current = currentCoords;
    };

    const handleMouseUp = () => {
      draggingRef.current = false;
      map.dragging.enable();
    };

    const overlayElement = moveRef.current.getElement();
    overlayElement.addEventListener('mousedown', handleMouseDown);
    map.on('mousemove', handleMouseMove);
    map.on('mouseup', handleMouseUp);

    return () => {
      overlayElement.removeEventListener('mousedown', handleMouseDown);
      map.off('mousemove', handleMouseMove);
      map.off('mouseup', handleMouseUp);
      if (overlayRef.current) {
        map.removeLayer(overlayRef.current);
      }
    };
  }, [map, overlayPosition]); // Removed opacity from dependencies

  // Separate effect for handling opacity changes
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.setOpacity(opacity); // Update overlay opacity without recreating
    }
  }, [opacity]);

  const handleOpacityChange = (event) => {
    const newOpacity = parseFloat(event.target.value); // Get new opacity value from input
    setOpacity(newOpacity);
  };

  const handleSliderMouseDown = () => {
    map.dragging.disable(); // Disable map dragging on slider interaction
  };

  const handleSliderMouseUp = () => {
    map.dragging.enable(); // Re-enable map dragging after slider interaction
  };

  return (
    <div style={{ position: 'absolute', top: '10px', left: '50px', zIndex: 1000 }}>
      <label htmlFor="opacity-slider">Opacity:</label>
      <input
        type="range"
        id="opacity-slider"
        min="0"
        max="1"
        step="0.1"
        value={opacity}
        onChange={handleOpacityChange}
        onMouseDown={handleSliderMouseDown}
        onMouseUp={handleSliderMouseUp}
        style={{ marginLeft: '10px' }}
      />
      
    </div>
  );
};

export default ImageOverlayComponent;
