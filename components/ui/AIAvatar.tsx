'use client';

export default function AIAvatar({ size = 200, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full bg-white/5 blur-xl" />
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 animate-float">
        {/* 身体 - 深色连帽衫 */}
        <path d="M60 170 C60 145, 75 135, 100 135 C125 135, 140 145, 140 170 L140 200 L60 200 Z" fill="#2A2A2A" />
        <path d="M78 140 Q100 150, 122 140 Q115 148, 100 150 Q85 148, 78 140Z" fill="#404040" />
        <path d="M68 95 C68 65, 80 48, 100 48 C120 48, 132 65, 132 95 L132 105 C132 105, 125 95, 100 95 C75 95, 68 105, 68 105 Z" fill="#2A2A2A" />

        {/* 脸部 */}
        <circle cx="100" cy="105" r="38" fill="#FFE0C2" />
        <ellipse cx="75" cy="115" rx="7" ry="4" fill="#FFB5B5" opacity="0.5" />
        <ellipse cx="125" cy="115" rx="7" ry="4" fill="#FFB5B5" opacity="0.5" />

        {/* 眼睛 */}
        <g className="origin-center animate-blink" style={{ transformOrigin: '100px 100px' }}>
          <rect x="78" y="95" width="16" height="14" rx="7" fill="white" stroke="#D4D4D4" strokeWidth="0.5" />
          <circle cx="88" cy="101" r="5" fill="#1A1A1A" />
          <circle cx="90" cy="99" r="1.5" fill="white" />
          <rect x="106" y="95" width="16" height="14" rx="7" fill="white" stroke="#D4D4D4" strokeWidth="0.5" />
          <circle cx="112" cy="101" r="5" fill="#1A1A1A" />
          <circle cx="114" cy="99" r="1.5" fill="white" />
        </g>

        {/* 眼镜 */}
        <rect x="74" y="91" width="22" height="18" rx="4" stroke="#404040" strokeWidth="2" fill="none" />
        <rect x="104" y="91" width="22" height="18" rx="4" stroke="#404040" strokeWidth="2" fill="none" />
        <line x1="96" y1="100" x2="104" y2="100" stroke="#404040" strokeWidth="2" />
        <line x1="74" y1="98" x2="68" y2="96" stroke="#404040" strokeWidth="2" />
        <line x1="126" y1="98" x2="132" y2="96" stroke="#404040" strokeWidth="2" />

        {/* 嘴巴 */}
        <path d="M93 120 Q100 125, 107 120" stroke="#D4845A" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* 头发 */}
        <path d="M72 85 C75 72, 85 65, 100 65 C115 65, 125 72, 128 85" stroke="#1A1A1A" strokeWidth="4" fill="#1A1A1A" strokeLinecap="round" />
        <path d="M78 82 Q82 72, 90 76" stroke="#1A1A1A" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M110 76 Q118 72, 122 82" stroke="#1A1A1A" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* 天线 */}
        <line x1="100" y1="48" x2="100" y2="34" stroke="#737373" strokeWidth="1.5" />
        <circle cx="100" cy="30" r="4" fill="#A3A3A3" />
        <circle cx="100" cy="30" r="2" fill="white" />

        {/* 代码符号 */}
        <text x="88" y="168" fill="#737373" fontSize="13" fontFamily="monospace" fontWeight="bold">{'{ }'}</text>
      </svg>
    </div>
  );
}
