interface ControlerProps {
  name: string;
  label: string;
  value: number;
  setValue: (newValue: number) => void;
  unit: string;
  min: number;
  max: number;
}
export default function Controler({
  name,
  label,
  value,
  setValue,
  min,
  max,
  unit
}: ControlerProps): JSX.Element {
  return (
    <div className="flex space-x-1 align-baseline">
      <label htmlFor={name}>{label}: </label>
      <input
        type="range"
        name={name}
        id={name}
        value={value}
        onChange={(event) => setValue(Math.floor(event.target.valueAsNumber))}
        min={min}
        max={max}
      />

      <p>
        {value} {unit}
      </p>
    </div>
  );
}
