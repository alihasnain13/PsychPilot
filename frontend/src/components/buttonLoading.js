import React from 'react';

function buttonLoading() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{
        margin: 'auto',
        background: 'none',
        display: 'block',
        shapeRendering: 'auto',
      }}
      width="44px"
      height="44px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <rect x="18.5" y="31" width="13" height="38" fill="#456caa">
        <animate
          attributeName="y"
          repeatCount="indefinite"
          dur="0.970873786407767s"
          calcMode="spline"
          keyTimes="0;0.5;1"
          values="12;31;31"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
          begin="-0.1941747572815534s"
        />
        <animate
          attributeName="height"
          repeatCount="indefinite"
          dur="0.970873786407767s"
          calcMode="spline"
          keyTimes="0;0.5;1"
          values="76;38;38"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
          begin="-0.1941747572815534s"
        />
      </rect>
      <rect x="43.5" y="31" width="13" height="38" fill="#88a2ce">
        <animate
          attributeName="y"
          repeatCount="indefinite"
          dur="0.970873786407767s"
          calcMode="spline"
          keyTimes="0;0.5;1"
          values="16.75;31;31"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
          begin="-0.0970873786407767s"
        />
        <animate
          attributeName="height"
          repeatCount="indefinite"
          dur="0.970873786407767s"
          calcMode="spline"
          keyTimes="0;0.5;1"
          values="66.5;38;38"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
          begin="-0.0970873786407767s"
        />
      </rect>
      <rect x="68.5" y="31" width="13" height="38" fill="#c2d2ee">
        <animate
          attributeName="y"
          repeatCount="indefinite"
          dur="0.970873786407767s"
          calcMode="spline"
          keyTimes="0;0.5;1"
          values="16.75;31;31"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
        />
        <animate
          attributeName="height"
          repeatCount="indefinite"
          dur="0.970873786407767s"
          calcMode="spline"
          keyTimes="0;0.5;1"
          values="66.5;38;38"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
        />
      </rect>
    </svg>
  );
}

export default buttonLoading;