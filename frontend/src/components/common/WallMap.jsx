import React from "react";

const WallMap = ({ onSectorClick, selectedSector }) => {
  return (
    <svg width="424" height="96" viewBox="0 0 424 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <g clipPath="url(#clip0_2_52)">
        <rect width="424" height="96" fill="#626262" fillOpacity="0.2" />

        {/* Secteur Gauche */}
        <g 
          className="cursor-pointer"
          onClick={() => onSectorClick("G")}
          fill={selectedSector === "G" ? "gray" : "black"}
          
        >
          <rect width="12" height="82" />
          <rect x="12" width="5" height="27" />
          <rect x="20" width="10" height="22" />
          <rect x="30" width="99" height="15" />
          <rect x="143" width="11" height="25" />
          <rect x="132.555" y="-7" width="25.9137" height="21.2153" transform="rotate(33.0012 132.555 -7)" />
          <rect x="7" y="2.09013" width="13.6094" height="26.8149" transform="rotate(-21.9635 7 2.09013)" />
          <text x="80" y="50" fill="white" fontSize="12" textAnchor="middle" className="font-bold">Secteur Gauche</text>
        </g>

        {/* Secteur Central */}
        <g 
          className="cursor-pointer"
          onClick={() => onSectorClick("C")}
          fill={selectedSector === "C" ? "gray" : "black"}
        >
          <rect x="267" width="14" height="25" />
          <rect x="154" width="98" height="15" />
          <rect x="256.555" y="-7" width="25.9137" height="21.2153" transform="rotate(33.0012 256.555 -7)" />
          <text x="210" y="50" fill="white" fontSize="12" textAnchor="middle" className="font-bold">Secteur Central</text>
        </g>

        {/* Secteur Droit */}
        <g 
          className="cursor-pointer"
          onClick={() => onSectorClick("D")}
          fill={selectedSector === "D" ? "gray" : "black"}
        >
          <rect x="281" width="37" height="15" />
          <rect x="403" width="11" height="15" />
          <rect x="414" width="10" height="45" />
          <rect x="414" y="69" width="10" height="27" />
          <rect x="407" y="45" width="17" height="24" />
          <rect x="318" width="85" height="7" />
          <text x="350" y="50" fill="white" fontSize="12" textAnchor="middle" className="font-bold">Secteur Droit</text>
        </g>
        <line x1="154.5" y1="14" x2="154.5" stroke="#626262"/>
        <line x1="281.5" y1="14" x2="281.5" stroke="#626262"/>
      </g>
      <defs>
        <clipPath id="clip0_2_52">
          <rect width="424" height="96" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};


export default WallMap;