const ZentryxLogo = () => (
    <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl mb-4 shadow-lg overflow-hidden">
      {/* Clock face background */}
      <div className="absolute inset-2 bg-white rounded-full shadow-inner">
        {/* Clock hands */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Hour hand */}
          <div className="absolute w-0.5 h-3 bg-slate-700 rounded-full transform -rotate-45 origin-bottom"></div>
          {/* Minute hand */}
          <div className="absolute w-0.5 h-4 bg-blue-600 rounded-full transform rotate-12 origin-bottom"></div>
        </div>
        {/* Clock center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-slate-800 rounded-full"></div>
        {/* Clock markers */}
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-slate-400"></div>
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-slate-400"></div>
        <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-1 h-0.5 bg-slate-400"></div>
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-1 h-0.5 bg-slate-400"></div>
      </div>
      {/* Outer ring with time indicators */}
      <div className="absolute inset-0 border-2 border-blue-500 rounded-2xl"></div>
    </div>
  );

  export default ZentryxLogo;