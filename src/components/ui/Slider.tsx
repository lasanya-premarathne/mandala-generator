interface SliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  valueLabel?: string;
  onChange: (value: number) => void;
}

export function Slider({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  minLabel,
  maxLabel,
  valueLabel,
  onChange,
}: SliderProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-neutral-700">
          {label}
        </label>
        <span className="text-sm tabular-nums text-neutral-500">{valueLabel ?? value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
      />
      {(minLabel || maxLabel) && (
        <div className="mt-1 flex justify-between text-xs text-neutral-400">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}
