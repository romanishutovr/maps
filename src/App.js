
import './App.css';
import MapComponent from './MapComponent';
import MapPictures from './MapPictures';
import GooglePictures from './GooglePictures';
import {useState} from 'react';

function App() {
  const [selected, setSelected] = useState("map");

  return (
    <div>
      <button onClick={()=>setSelected("map")}>map</button>
      <button onClick={()=>setSelected("image")}>image</button>
      <button onClick={()=>setSelected("gp")}>gp</button>
      {selected === "map" && <MapComponent/> }
      {selected === "image" && <MapPictures/>}
      {selected === "gp" &&<GooglePictures/>}

    </div>
  );
}

export default App;




