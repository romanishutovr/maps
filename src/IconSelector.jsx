import React from 'react';

const IconSelector = ({ icons, selectedIcon, handleIconSelect }) => {
  return (
    <ul style={{ listStyleType: 'none', padding: 0, width: "200px" }}>
      {icons.map((icon, index) => (
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
            borderColor: selectedIcon?.name === icon?.name ? 'green' : '#ccc',
            backgroundColor: selectedIcon?.name === icon?.name ? '#f0fff0' : 'transparent',
          }}
        >
          <img src={icon?.url} alt={icon?.name} style={{ width: '20px', marginRight: '5px' }} />
          {icon?.name}
        </li>
      ))}
    </ul>
  );
};

export default IconSelector;
