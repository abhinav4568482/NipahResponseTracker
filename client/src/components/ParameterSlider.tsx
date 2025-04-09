import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { parameterDescriptions } from "@/data/parameterDescriptions";

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

  // Get parameter key from label to find description
  const paramKey = label.includes('Bat Density') ? 'batDensity' :
                  label.includes('Pig Farming') ? 'pigFarmingIntensity' :
                  label.includes('Fruit Consumption') ? 'fruitConsumptionPractices' :
                  label.includes('Population') ? 'humanPopulationDensity' :
                  label.includes('Healthcare') ? 'healthcareInfrastructure' :
                  label.includes('Environmental') ? 'environmentalDegradation' : '';

  // Get description if available                
  const description = paramKey ? parameterDescriptions[paramKey] : null;

  return (
    <div className="mb-4 bg-gray-100 p-4 rounded parameter-control">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <label className="font-medium text-sm" htmlFor={name}>{label}</label>
          
          {description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-1 text-neutral-dark hover:text-primary focus:outline-none" 
                    aria-label={`Info about ${label}`}>
                    <Info size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-3 bg-white border rounded-md shadow-md">
                  <div className="space-y-2">
                    <h4 className="font-bold">{description.title}</h4>
                    <p className="text-sm">{description.description}</p>
                    
                    <div className="pt-1 mt-1 border-t border-gray-200">
                      <h5 className="text-xs font-bold">Evidence:</h5>
                      <p className="text-xs">{description.evidence}</p>
                    </div>
                    
                    <div className="text-xs pt-1 mt-1 border-t border-gray-200">
                      <h5 className="font-bold">Risk Range:</h5>
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        <div className="bg-green-100 p-1 rounded-l text-center">
                          <span className="block font-bold">Low</span>
                          <span className="text-[10px]">{description.lowRisk}</span>
                        </div>
                        <div className="bg-red-100 p-1 rounded-r text-center">
                          <span className="block font-bold">High</span>
                          <span className="text-[10px]">{description.highRisk}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-neutral-dark pt-1 mt-1 border-t border-gray-200">
                      Source: {description.citation}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
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

      {/* Value range indicator with gradient */}
      <div className="h-1 w-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded mt-1 opacity-50"></div>
    </div>
  );
}
