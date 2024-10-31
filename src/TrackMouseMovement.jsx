import { useMapEvents } from "react-leaflet";
import { useState } from "react";
export const TrackMouseMovement = () => {
  const [currentPosition, setCurrentPosition] = useState(null);

useMapEvents({
mousemove: (e) => {
setCurrentPosition(e.latlng.lat.toString().slice(0,10) + ", " + e.latlng.lng.toString().slice(0,10));
},
    
  });
  return (
    <div style={{ position: "absolute", bottom: 10, left: 200,  zIndex:999, padding:"5px 30px", borderRadius:"5px", backgroundColor:"#81848C", width:"200px" }}>
      lonlat = [{currentPosition}]
    </div>
  );
};