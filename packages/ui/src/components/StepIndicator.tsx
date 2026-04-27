interface StepIndicatorProps {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <div className="flex justify-center gap-1.5 mb-2">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`step-dot ${i <= current ? "active" : ""}`} />
      ))}
    </div>
  );
}
