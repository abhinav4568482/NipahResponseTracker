import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

interface ParameterSliderProps {
  name: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  weight: number;
  inverted?: boolean;
}

export default function ParameterSlider({ 
  name, 
  label, 
  value, 
  onChange, 
  weight, 
  inverted = false 
}: ParameterSliderProps) {
  const [localValue, setLocalValue] = useState<number>(value);

  // Sync with parent component value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSliderChange = (newValue: number[]) => {
    setLocalValue(newValue[0]);
    onChange(newValue[0]);
  };

  return (
    <div className="mb-4 bg-gray-100 p-4 rounded parameter-control">
      <div className="flex justify-between items-center mb-1">
        <label className="font-medium text-sm" htmlFor={name}>{label}</label>
        <div className="flex items-center">
          <span className="text-xs bg-primary text-white px-2 py-0.5 rounded mr-1">w: {weight}</span>
          {inverted && <span className="text-xs text-neutral-dark">(inverted)</span>}
          <span className="text-sm font-mono ml-1" id={`${name}-value`}>{localValue.toFixed(2)}</span>
        </div>
      </div>
      
      <Slider
        id={name}
        min={0}
        max={1}
        step={0.01}
        value={[localValue]}
        onValueChange={handleSliderChange}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-neutral-dark mt-1">
        <span>{inverted ? "Poor" : "Low"}</span>
        <span>{inverted ? "Good" : "High"}</span>
      </div>
    </div>
  );
}
