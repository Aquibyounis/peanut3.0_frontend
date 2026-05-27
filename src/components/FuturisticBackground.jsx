import { useMemo } from 'react';

/**
 * Premium 3D-Parallax Milky Way Galaxy Cyber Background.
 * Renders 180 highly visible, thick, bright glowing stars divided into Far, Mid, and Near layers.
 * Utilizes foolproof inline hex colors (#ff2a5f) and high-density glowing box shadows to ensure
 * absolute visibility across all stacking layers.
 */
export const FuturisticBackground = ({ isChatActive }) => {
  const stars = useMemo(() => {
    const arr = [];
    const starCount = 180;

    for (let i = 0; i < starCount; i++) {
      // 80% of stars lie along two diagonal galactic arms to create a rich intersecting lane
      const randDist = Math.random();
      let leftVal, topVal;
      
      if (randDist < 0.40) {
        // Arm 1: Main Diagonal (Top-Left to Bottom-Right)
        const pct = Math.random() * 120 - 10;
        const spread = (Math.random() - 0.5) * 32;
        leftVal = pct;
        topVal = pct + spread;
      } else if (randDist < 0.80) {
        // Arm 2: Counter Diagonal (Bottom-Left to Top-Right)
        const pct = Math.random() * 120 - 10;
        const spread = (Math.random() - 0.5) * 32;
        leftVal = pct;
        topVal = (100 - pct) + spread;
      } else {
        // Uniform Scattered Field
        leftVal = Math.random() * 100;
        topVal = Math.random() * 100;
      }

      // Constrain coordinates within visible bounds (0% to 100%) to prevent clipping scrollbars
      leftVal = Math.max(0, Math.min(100, leftVal));
      topVal = Math.max(0, Math.min(100, topVal));

      // Parallax layers: Far (0), Mid (1), Near (2)
      // Layer probabilities: Far (55%), Mid (33%), Near (12%)
      const layerRand = Math.random();
      let layer = 0;
      let size = 1;
      let opacity = 0.1;
      let scale = 1;
      let duration = '12s';
      let glow = false;

      if (layerRand < 0.55) {
        // Far background layer (Thicker, brighter)
        layer = 0;
        size = Math.random() * 1.0 + 1.5; // 1.5px to 2.5px
        opacity = Math.random() * 0.20 + 0.30; // 0.30 to 0.50
        scale = 0.85;
        duration = `${Math.random() * 8 + 10}s`; // 10s to 18s
      } else if (layerRand < 0.88) {
        // Mid background layer (Thicker, brighter)
        layer = 1;
        size = Math.random() * 1.0 + 2.5; // 2.5px to 3.5px
        opacity = Math.random() * 0.25 + 0.50; // 0.50 to 0.75
        scale = 1.0;
        duration = `${Math.random() * 5 + 6}s`; // 6s to 11s
      } else {
        // Near foreground layer (Thick, fully brilliant, glowing)
        layer = 2;
        size = Math.random() * 2.0 + 3.5; // 3.5px to 5.5px
        opacity = Math.random() * 0.25 + 0.75; // 0.75 to 1.00 (fully bright)
        scale = 1.20;
        duration = `${Math.random() * 3 + 3.5}s`; // 3.5s to 6.5s
        glow = true; // Every Near star gets a beautiful neon halo
      }

      arr.push({
        id: i,
        left: `${leftVal}%`,
        top: `${topVal}%`,
        size,
        opacity,
        scale,
        glow,
        delay: `${Math.random() * 5}s`,
        duration,
      });
    }
    return arr;
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#000000]">
      {/* 1. Ambient Nebula Glow Background (Pure red cyber theme - intensified glows) */}
      <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-[rgba(255,42,95,0.10)] blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-[rgba(255,42,95,0.10)] blur-[140px] animate-pulse-glow" style={{ animationDelay: '3s' }} />

      {/* 2. Intersecting Milky Way Galaxy Nebula Glow Lanes (Intensified red bands) */}
      <div className="absolute top-[25%] left-[-10%] w-[120vw] h-[25vh] rounded-full bg-[rgba(255,42,95,0.16)] blur-[150px] -rotate-45 opacity-70 animate-pulse-slow" style={{ transformOrigin: 'center center' }} />
      <div className="absolute top-[25%] left-[-10%] w-[120vw] h-[25vh] rounded-full bg-[rgba(255,42,95,0.10)] blur-[150px] rotate-45 opacity-55 animate-pulse-slow" style={{ transformOrigin: 'center center', animationDelay: '2.5s' }} />

      {/* 3. Cybernetic Futuristic Semi-Circles */}
      {/* Outer semi-circle 1 (Top Right) */}
      <div className="absolute -top-[15%] -right-[15%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] border-[1.5px] border-dashed border-brand-red-dim/20 rounded-full animate-rotate-cw animate-pulse-slow" />
      
      {/* Inner semi-circle 1 (Top Right) */}
      <div className="absolute -top-[10%] -right-[10%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] border-2 border-solid border-brand-red-dim/10 rounded-full animate-rotate-ccw" style={{ borderBottomColor: 'transparent', borderLeftColor: 'transparent' }} />
      
      {/* Outer semi-circle 2 (Bottom Left) */}
      <div className="absolute -bottom-[20%] -left-[20%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] border-2 border-dashed border-brand-red-dim/15 rounded-full animate-rotate-ccw animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      
      {/* Inner semi-circle 2 (Bottom Left) */}
      <div className="absolute -bottom-[12%] -left-[12%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] border-[1.5px] border-solid border-brand-red-dim/10 rounded-full animate-rotate-cw" style={{ borderTopColor: 'transparent', borderRightColor: 'transparent' }} />

      {/* Tech Ticks / HUD elements */}
      <div className="absolute top-[30%] left-[5%] w-[180px] h-[180px] border border-brand-red-dim/5 rounded-full animate-rotate-cw opacity-30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-brand-red-dim/30" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-brand-red-dim/30" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-brand-red-dim/30" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-brand-red-dim/30" />
      </div>

      <div className="absolute bottom-[25%] right-[8%] w-[220px] h-[220px] border border-dashed border-brand-red-dim/10 rounded-full animate-rotate-ccw opacity-40">
        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-red/40 rounded-full animate-pulse" />
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-brand-red/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* 4. Milky Way Galaxy Starfield with Parallax Depth and Flickering */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          filter: isChatActive ? 'blur(20px)' : 'none',
          transition: 'filter 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
          willChange: 'filter',
        }}
      >
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute pointer-events-none select-none flex items-center justify-center"
            style={{
              left: star.left,
              top: star.top,
              opacity: star.opacity,
              // 3D Parallax visual depth scale
              transform: `scale(${star.scale})`,
            }}
          >
            <div
              className="rounded-full animate-fade-slow"
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: '#ff2a5f', // Foolproof hardcoded hex
                animationDelay: star.delay,
                animationDuration: star.duration,
                // Noticeable high-contrast glowing halo
                boxShadow: star.glow ? '0 0 12px 3.5px rgba(255, 42, 95, 0.9)' : 'none',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FuturisticBackground;
