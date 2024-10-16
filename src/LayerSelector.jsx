import React from 'react';

const LayerSelector = ({ baseLayers, activeLayer, handleLayerChange }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", height: "20px", margin: "10px" }}>
      <p>Select layer:</p>
      <select style={{ marginRight: "20px" }} onChange={handleLayerChange} value={activeLayer}>
        {baseLayers.map((layer) => (
          <option key={layer.name} value={layer.url}>
            {layer.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LayerSelector;
