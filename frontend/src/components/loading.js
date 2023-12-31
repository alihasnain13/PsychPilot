import React from 'react';
import '../styles/Loading.css'; // Import the CSS for styling

function Loading( {prop} ) {
    return (
        <div className='background'>
            <div className="loading-container">
                <span className='welcome-message'><h1>{prop}</h1></span>

                {/* <svg 
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{
        margin: 'auto',
        background: 'rgb(241, 242, 243)',
        display: 'block',
        shapeRendering: 'auto',
      }}
      width="200px"
      height="200px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <g transform="translate(50 50)">
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0;45"
            keyTimes="0;1"
            dur="0.2s"
            repeatCount="indefinite"
          ></animateTransform>
          <path
            d="M29.491524206117255 -5.5 L37.491524206117255 -5.5 L37.491524206117255 5.5 L29.491524206117255 5.5 A30 30 0 0 1 24.742744050198738 16.964569457146712 L24.742744050198738 16.964569457146712 L30.399598299691117 22.621423706639092 L22.621423706639096 30.399598299691114 L16.964569457146716 24.742744050198734 A30 30 0 0 1 5.5 29.491524206117255 L5.5 29.491524206117255 L5.5 37.491524206117255 L-5.499999999999997 37.491524206117255 L-5.499999999999997 29.491524206117255 A30 30 0 0 1 -16.964569457146705 24.742744050198738 L-16.964569457146705 24.742744050198738 L-22.621423706639085 30.399598299691117 L-30.399598299691117 22.621423706639092 L-24.742744050198738 16.964569457146712 A30 30 0 0 1 -29.491524206117255 5.500000000000009 L-29.491524206117255 5.500000000000009 L-37.491524206117255 5.50000000000001 L-37.491524206117255 -5.500000000000001 L-29.491524206117255 -5.500000000000002 A30 30 0 0 1 -24.742744050198738 -16.964569457146705 L-24.742744050198738 -16.964569457146705 L-30.399598299691117 -22.621423706639085 L-22.621423706639092 -30.399598299691117 L-16.964569457146712 -24.742744050198738 A30 30 0 0 1 -5.500000000000011 -29.491524206117255 L-5.500000000000011 -29.491524206117255 L-5.500000000000012 -37.491524206117255 L5.499999999999998 -37.491524206117255 L5.5 -29.491524206117255 A30 30 0 0 1 16.964569457146702 -24.74274405019874 L16.964569457146702 -24.74274405019874 L22.62142370663908 -30.39959829969112 L30.399598299691117 -22.6214237066391 L24.742744050198738 -16.964569457146716 A30 30 0 0 1 29.491524206117255 -5.500000000000013 M0 -20A20 20 0 1 0 0 20 A20 20 0 1 0 0 -20"
            fill="#74007a"
          ></path>
        </g>
      </g>
    </svg> */}

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    style={{
                        margin: 'auto',
                        background: 'rgba(241, 242, 243,0)',
                        display: 'block',
                        shapeRendering: 'auto',
                    }}
                    width="200px"
                    height="200px"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid"
                >






                    {/* Add the gradient definition */}
                    <defs>
                        <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3E2477" />
                            <stop offset="100%" stopColor="#C31C7E" />
                        </linearGradient>
                    </defs>

                    <path
                        fill="none"
                        stroke="url(#myGradient)" // Use the gradient
                        strokeWidth="6"
                        strokeDasharray="42.76482137044271 42.76482137044271"
                        d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
                        strokeLinecap="round"
                        style={{ transform: 'scale(1)', transformOrigin: '50px 50px' }}
                    >
                        <animate
                            attributeName="stroke-dashoffset"
                            repeatCount="indefinite"
                            dur="1.5384615384615383s"
                            keyTimes="0;1"
                            values="0;256.58892822265625"
                        />
                    </path>
                </svg>
            </div>
        </div>
    );
}

export default Loading;