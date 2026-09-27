import React from 'react';

interface AvailabilityGaugeProps {
  available: number;
  capacity: number;
  thresholdPercent?: number; // default 25%
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const AvailabilityGauge: React.FC<AvailabilityGaugeProps> = ({
  available,
  capacity,
  thresholdPercent = 25,
  size = 'md',
  showDetails = true,
}) => {
  const safeCapacity = Math.max(1, capacity);
  const safeAvailable = Math.max(0, Math.min(available, safeCapacity));
  const percentRemaining = (safeAvailable / safeCapacity) * 100;
  const isLow = percentRemaining < thresholdPercent;
  const isFull = safeAvailable === 0;

  // Gauge sizing configurations
  const config = {
    sm: { radius: 24, strokeWidth: 5, svgSize: 60, fontSize: 'text-xs', subSize: 'text-[9px]' },
    md: { radius: 36, strokeWidth: 7, svgSize: 92, fontSize: 'text-sm font-semibold', subSize: 'text-[10px]' },
    lg: { radius: 52, strokeWidth: 10, svgSize: 132, fontSize: 'text-lg font-bold', subSize: 'text-xs' },
  }[size];

  const circumference = 2 * Math.PI * config.radius;
  // Arc calculation (from top, -90 deg)
  const strokeDashoffset = circumference - (percentRemaining / 100) * circumference;

  // Colors based on user requirement:
  // "When the available sheets column is less than 25% of class capacity, show a gauge with orange color."
  // Healthy availability uses Sac State Green (#043927 / #056344) with CSUS Gold highlights
  const strokeColor = isLow ? '#f97316' : '#043927'; // Vibrant Orange (#f97316) vs CSUS Sac State Green (#043927)
  const trackColor = isLow ? 'rgba(249, 115, 22, 0.18)' : 'rgba(4, 57, 39, 0.15)';
  const glowShadow = isLow ? 'drop-shadow(0 0 6px rgba(249, 115, 22, 0.4))' : 'drop-shadow(0 0 4px rgba(4, 57, 39, 0.25))';

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: config.svgSize, height: config.svgSize }}>
        <svg
          width={config.svgSize}
          height={config.svgSize}
          className="transform -rotate-90"
          style={{ filter: glowShadow }}
          aria-label={`Seat availability: ${safeAvailable} of ${safeCapacity} seats available (${Math.round(percentRemaining)}%)`}
        >
          {/* Background track circle */}
          <circle
            cx={config.svgSize / 2}
            cy={config.svgSize / 2}
            r={config.radius}
            fill="transparent"
            stroke={trackColor}
            strokeWidth={config.strokeWidth}
          />
          {/* Active progress arc */}
          <circle
            cx={config.svgSize / 2}
            cy={config.svgSize / 2}
            r={config.radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
          <span className={`${config.fontSize} ${isLow ? 'text-orange-600 dark:text-orange-400 font-extrabold' : 'text-csus-green dark:text-csus-gold font-bold'}`}>
            {safeAvailable}
          </span>
          <span className={`${config.subSize} text-slate-500 font-medium`}>
            /{safeCapacity}
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-1.5 flex flex-col items-center">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium tracking-tight ${
              isFull
                ? 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/60'
                : isLow
                ? 'bg-orange-100 text-orange-800 border border-orange-200 font-semibold dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800/80 animate-pulse'
                : 'bg-csus-green-50 text-csus-green border border-csus-green-200 dark:bg-csus-green-dark dark:text-csus-gold dark:border-csus-gold/30'
            }`}
          >
            {isFull ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                Full (0 left)
              </>
            ) : isLow ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
                <span>Low: &lt;25% left ({Math.round(percentRemaining)}%)</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-csus-green dark:bg-csus-gold"></span>
                <span>{Math.round(percentRemaining)}% seats open</span>
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
};
