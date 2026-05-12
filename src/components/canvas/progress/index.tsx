interface CanvasProgressProps {
  progressValue?: number;
  maxValue?: number;
  progressLabel?: string;
  showPercentage?: boolean;
}

export default function CanvasProgress({
  progressValue = 0,
  maxValue = 100,
  progressLabel = "Progress",
  showPercentage = false,
}: CanvasProgressProps) {
  const clampedValue = Math.min(Math.max(progressValue, 0), maxValue);
  const percentage = maxValue > 0 ? Math.round((clampedValue / maxValue) * 100) : 0;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          {progressLabel}
        </span>
        {showPercentage && (
          <span className="text-sm text-muted-foreground">{percentage}%</span>
        )}
      </div>
      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={maxValue}
        aria-label={progressLabel}
        className="relative h-3 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
