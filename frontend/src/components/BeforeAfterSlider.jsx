import React, { useState } from 'react';

export default function BeforeAfterSlider({
  originalUrl,
  enhancedUrl,
  labelBefore = 'Original',
  labelAfter = 'Studio AI',
}) {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-md select-none border-2 border-amber-200 bg-slate-100">
      {/* Background Layer: Enhanced Studio Image */}
      <img
        src={enhancedUrl}
        alt={labelAfter}
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* Foreground Layer: Original Image (Clipped by slider position) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={originalUrl}
          alt={labelBefore}
          className="absolute inset-0 w-full h-full object-contain max-w-none"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Vertical divider line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        {/* Circular drag knob */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-xl border-2 border-saffron-600 flex items-center justify-center text-xs font-black text-saffron-600">
          ↔
        </div>
      </div>

      {/* Floating Labels */}
      <div className="absolute top-3 left-3 z-30 pointer-events-none">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-sm">
          {labelBefore}
        </span>
      </div>
      <div className="absolute top-3 right-3 z-30 pointer-events-none">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-saffron-600 text-white shadow">
          {labelAfter} ✨
        </span>
      </div>

      {/* Accessible range input overlay */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPos}
        onChange={(e) => setSliderPos(Number(e.target.value))}
        className="absolute inset-0 opacity-0 cursor-ew-resize z-40 w-full h-full"
        aria-label="Before and after image comparison slider"
      />
    </div>
  );
}
