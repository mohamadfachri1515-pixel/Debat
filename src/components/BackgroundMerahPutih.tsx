import React from 'react';

export const BackgroundMerahPutih: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-slate-950">
      {/* Dynamic Animated Gradients */}
      <div 
        className="absolute -top-[20%] -left-[10%] w-[65vw] h-[65vw] rounded-full opacity-35 blur-[120px] animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.7) 0%, rgba(185, 28, 28, 0.2) 60%, transparent 80%)',
          animationDuration: '10s'
        }}
      />
      
      <div 
        className="absolute top-[40%] -right-[15%] w-[55vw] h-[55vw] rounded-full opacity-30 blur-[130px] animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(226, 232, 240, 0.15) 50%, transparent 75%)',
          animationDuration: '14s'
        }}
      />

      <div 
        className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[50vw] rounded-full opacity-25 blur-[140px]"
        style={{
          background: 'radial-gradient(circle, rgba(185, 28, 28, 0.5) 0%, rgba(15, 23, 42, 0.8) 70%, transparent 90%)',
        }}
      />

      {/* Subtle Geometric Overlay Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px), radial-gradient(rgba(220, 38, 38, 0.6) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px'
        }}
      />

      {/* Subtle Red & White Ribbons / Wave Light */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-white to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />

      {/* Floating subtle red-white particles */}
      <div className="absolute top-1/4 left-1/12 w-2 h-2 rounded-full bg-red-500/30 blur-[1px] animate-bounce" style={{ animationDuration: '6s' }} />
      <div className="absolute top-2/3 right-1/12 w-3 h-3 rounded-full bg-white/25 blur-[1px] animate-bounce" style={{ animationDuration: '8s', animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-3/4 w-2 h-2 rounded-full bg-red-400/25 blur-[1px] animate-bounce" style={{ animationDuration: '7s', animationDelay: '2s' }} />
    </div>
  );
};
