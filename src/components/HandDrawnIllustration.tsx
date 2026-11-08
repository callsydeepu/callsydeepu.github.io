import React from "react";

interface HandIllustrationProps {
  tension?: number; // 0 to 1
  className?: string;
}

export function HandIllustration({ tension = 0, className = "" }: HandIllustrationProps) {
  // Artistic editorial pen-and-ink hand gripping strings
  // Hand reaching upward and rightward, curled fingers clutching cords
  return (
    <svg
      viewBox="0 0 280 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full select-none overflow-visible ${className}`}
      aria-hidden="true"
    >
      <defs>
        <filter id="hand-ink-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.12" />
        </filter>
        <linearGradient id="skin-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7f5f0" />
          <stop offset="60%" stopColor="#ece9e0" />
          <stop offset="100%" stopColor="#dad5c8" />
        </linearGradient>
      </defs>

      <g filter="url(#hand-ink-shadow)" style={{ transformOrigin: "60px 220px", transform: `rotate(${tension * -2}deg)` }}>
        {/* Forearm / Wrist base */}
        <path
          d="M20 250 C35 210 50 180 75 160 C90 148 105 145 125 152 C145 160 160 185 170 230 C155 245 130 255 20 250 Z"
          fill="url(#skin-gradient)"
          stroke="#111114"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Anatomical wrist tendon ink lines */}
        <path d="M55 235 C65 205 78 185 92 172" stroke="#111114" strokeWidth="1.4" strokeDasharray="1 3" />
        <path d="M95 245 C105 215 118 190 128 178" stroke="#111114" strokeWidth="1.2" opacity="0.7" />

        {/* Palm Body */}
        <path
          d="M75 160 C70 135 85 105 110 95 C135 85 170 95 195 120 C215 140 210 175 185 195 C160 215 130 205 105 185 Z"
          fill="url(#skin-gradient)"
          stroke="#111114"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Thumb - gripping tightly forward */}
        <path
          d="M85 135 C80 115 88 95 105 82 C120 70 140 75 148 90 C155 102 150 115 140 125 C130 135 115 140 100 142"
          fill="url(#skin-gradient)"
          stroke="#111114"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Thumb knuckle & nail */}
        <path d="M125 80 C132 82 138 88 140 95" stroke="#111114" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M112 85 C118 82 124 82 130 84" stroke="#111114" strokeWidth="1.4" />

        {/* Index Finger - curled over the cords */}
        <path
          d="M142 90 C155 70 180 65 200 78 C212 86 218 100 212 115 C206 128 190 132 175 130 C162 128 152 120 145 112"
          fill="url(#skin-gradient)"
          stroke="#111114"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Index knuckle lines & nail */}
        <path d="M185 73 C192 78 198 86 198 94" stroke="#111114" strokeWidth="1.8" />
        <path d="M165 72 C172 75 178 80 180 88" stroke="#111114" strokeWidth="1.4" opacity="0.8" />

        {/* Middle Finger - clutching tightly */}
        <path
          d="M175 108 C192 95 218 95 232 110 C242 122 240 138 230 148 C220 158 202 158 190 152 C180 148 174 138 170 128"
          fill="url(#skin-gradient)"
          stroke="#111114"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Middle knuckle folds */}
        <path d="M212 102 C220 108 226 116 226 124" stroke="#111114" strokeWidth="1.8" />

        {/* Ring Finger */}
        <path
          d="M185 138 C202 128 224 132 232 146 C238 158 234 170 222 178 C210 186 195 182 185 174 C178 168 174 158 172 148"
          fill="url(#skin-gradient)"
          stroke="#111114"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M210 138 C216 144 220 150 220 158" stroke="#111114" strokeWidth="1.5" />

        {/* Pinky Finger */}
        <path
          d="M182 165 C196 158 214 162 220 174 C225 184 220 195 210 200 C200 205 188 200 180 192 C174 186 172 178 172 170"
          fill="url(#skin-gradient)"
          stroke="#111114"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Palm Creases & Editorial Ink Hatching */}
        <path d="M120 140 C135 145 155 142 170 135" stroke="#111114" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M130 158 C145 160 162 155 172 148" stroke="#111114" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M110 168 C125 172 145 170 158 162" stroke="#111114" strokeWidth="1.6" strokeLinecap="round" />

        {/* Fine cross-hatching for depth and vintage editorial character */}
        <g stroke="#111114" strokeWidth="1" opacity="0.6">
          <line x1="60" y1="210" x2="68" y2="216" />
          <line x1="65" y1="205" x2="73" y2="211" />
          <line x1="70" y1="200" x2="78" y2="206" />
          <line x1="140" y1="170" x2="148" y2="176" />
          <line x1="145" y1="166" x2="153" y2="172" />
          <line x1="150" y1="162" x2="158" y2="168" />
        </g>
      </g>
    </svg>
  );
}

