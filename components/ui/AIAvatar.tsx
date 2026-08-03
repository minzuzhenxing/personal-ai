'use client';

/**
 * 扁平风 AI 卡通形象 - SVG 动画角色
 * 圆脸 + 眼镜 + 连帽衫 + 浮动/眨眼微动画
 */
export default function AIAvatar({ size = 200, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* 发光光环 */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 blur-xl animate-glow" />

      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 animate-float">
        {/* 身体 - 连帽衫 */}
        <path d="M60 170 C60 145, 75 135, 100 135 C125 135, 140 145, 140 170 L140 200 L60 200 Z" fill="#2d3a8c" />
        {/* 连帽衫领口 */}
        <path d="M78 140 Q100 150, 122 140 Q115 148, 100 150 Q85 148, 78 140Z" fill="#3b4bc4" />
        {/* 帽子 */}
        <path d="M68 95 C68 65, 80 48, 100 48 C120 48, 132 65, 132 95 L132 105 C132 105, 125 95, 100 95 C75 95, 68 105, 68 105 Z" fill="#2d3a8c" />

        {/* 脸部 - 圆脸 */}
        <circle cx="100" cy="105" r="38" fill="#FFE0C2" />
        {/* 腮红 */}
        <ellipse cx="75" cy="115" rx="8" ry="5" fill="#FFB5B5" opacity="0.4" />
        <ellipse cx="125" cy="115" rx="8" ry="5" fill="#FFB5B5" opacity="0.4" />

        {/* 眼睛 - 带眨眼动画 */}
        <g className="origin-center animate-blink" style={{ transformOrigin: '100px 100px' }}>
          {/* 左眼 */}
          <rect x="78" y="95" width="16" height="14" rx="7" fill="white" />
          <circle cx="88" cy="101" r="5" fill="#2d3a8c" />
          <circle cx="90" cy="99" r="2" fill="white" />
          {/* 右眼 */}
          <rect x="106" y="95" width="16" height="14" rx="7" fill="white" />
          <circle cx="112" cy="101" r="5" fill="#2d3a8c" />
          <circle cx="114" cy="99" r="2" fill="white" />
        </g>

        {/* 眼镜 */}
        <rect x="74" y="91" width="22" height="18" rx="4" stroke="#5c7cfa" strokeWidth="2" fill="none" />
        <rect x="104" y="91" width="22" height="18" rx="4" stroke="#5c7cfa" strokeWidth="2" fill="none" />
        <line x1="96" y1="100" x2="104" y2="100" stroke="#5c7cfa" strokeWidth="2" />
        <line x1="74" y1="98" x2="68" y2="96" stroke="#5c7cfa" strokeWidth="2" />
        <line x1="126" y1="98" x2="132" y2="96" stroke="#5c7cfa" strokeWidth="2" />

        {/* 嘴巴 - 微笑 */}
        <path d="M92 120 Q100 126, 108 120" stroke="#D4845A" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* 头发刘海 */}
        <path d="M72 85 C75 72, 85 65, 100 65 C115 65, 125 72, 128 85" stroke="#1a1a2e" strokeWidth="4" fill="#1a1a2e" strokeLinecap="round" />
        <path d="M78 82 Q82 72, 90 76" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M110 76 Q118 72, 122 82" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* 帽子上的天线 */}
        <line x1="100" y1="48" x2="100" y2="32" stroke="#5c7cfa" strokeWidth="2" />
        <circle cx="100" cy="28" r="5" fill="#5c7cfa" className="animate-pulse" />
        <circle cx="100" cy="28" r="3" fill="#22d3ee" />

        {/* 连帽衫上的代码符号 */}
        <text x="88" y="168" fill="#5c7cfa" fontSize="14" fontFamily="monospace" fontWeight="bold">{'{ }'}</text>
      </svg>

      {/* 浮动技术图标 */}
      <div className="absolute top-2 -left-2 animate-float" style={{ animationDelay: '0.5s' }}>
        <div className="w-8 h-8 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-xs text-primary-300 font-mono">
          J
        </div>
      </div>
      <div className="absolute top-8 -right-3 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-8 h-8 rounded-lg bg-cyan-400/20 border border-cyan-400/30 flex items-center justify-center text-xs text-cyan-300 font-mono">
          AI
        </div>
      </div>
      <div className="absolute bottom-12 -left-4 animate-float" style={{ animationDelay: '1.5s' }}>
        <div className="w-8 h-8 rounded-lg bg-accent-500/20 border border-accent-500/30 flex items-center justify-center text-xs text-accent-300 font-mono">
          ☁️
        </div>
      </div>
    </div>
  );
}
