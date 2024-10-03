
import './App.css';
import MapComponent from './MapComponent';
import MapPictures from './MapPictures';
import {useState} from 'react';

function App() {
  const [selected, setSelected] = useState("map");

  return (
    <div>
      <button onClick={()=>setSelected("map")}>map</button>
      <button onClick={()=>setSelected("image")}>image</button>
      {selected === "map" ? <MapComponent/> : <MapPictures/>}
      
    </div>
  );
}

export default App;




