import { useState } from "react";
import { RiskParameters, Region } from "@/types";
import ParameterSlider from "./ParameterSlider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface ParametersPanelProps {
  parameters: RiskParameters;
  onParameterChange: (parameter: keyof RiskParameters, value: number) => void;
  selectedRegion: Region | null;
  onRegionSelect: (region: Region) => void;
  regions: Region[];
}

export default function ParametersPanel({
  parameters,
  onParameterChange,
  selectedRegion,
  onRegionSelect,
  regions
}: ParametersPanelProps) {
  const [isMobileVisible, setIsMobileVisible] = useState(false);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const region = regions.find(r => r.id === selectedId);
    if (region) {
      onRegionSelect(region);
    }
  };

  const toggleMobileVisibility = () => {
    setIsMobileVisible(!isMobileVisible);
  };

  return (
    <div 
      className={`w-full md:w-80 bg-white shadow-md flex flex-col h-full overflow-hidden ${isMobileVisible ? 'block' : 'hidden md:flex'}`} 
      id="parameters-panel"
    >
      <div className="p-4 bg-primary-light text-white flex justify-between items-center">
        <h2 className="font-medium">Risk Parameters</h2>
        <button 
          className="text-white hover:bg-white/20 p-1 rounded md:hidden" 
          onClick={toggleMobileVisibility}
        >
          <i className="ri-arrow-left-s-line"></i>
        </button>
      </div>
      
      <div className="overflow-y-auto flex-1 p-4">
        {/* Region Selection */}
        <div className="mb-6 bg-neutral-light p-4 rounded">
          <h3 className="font-medium mb-2">Region Selection</h3>
          <select 
            className="w-full p-2 border border-neutral-medium rounded bg-white" 
            id="region-select"
            value={selectedRegion?.id || ""}
            onChange={handleRegionChange}
          >
            <option value="" disabled>Select a region</option>
            {regions.map(region => (
              <option key={region.id} value={region.id}>{region.name}</option>
            ))}
          </select>
          <div className="mt-2 text-sm text-neutral-darker">
            Or click directly on the map to select a region
          </div>
        </div>

        {/* Parameter Sliders */}
        <ParameterSlider 
          name="bat-density"
          label="Bat Density"
          value={parameters.batDensity}
          onChange={(value) => onParameterChange('batDensity', value)}
          weight={0.3}
        />
        
        <ParameterSlider 
          name="pig-density"
          label="Pig Density"
          value={parameters.pigDensity}
          onChange={(value) => onParameterChange('pigDensity', value)}
          weight={0.2}
        />
        
        <ParameterSlider 
          name="fruit-exposure"
          label="Fruit Exposure"
          value={parameters.fruitExposure}
          onChange={(value) => onParameterChange('fruitExposure', value)}
          weight={0.2}
        />
        
        <ParameterSlider 
          name="healthcare"
          label="Healthcare Index"
          value={parameters.inverseHealthcare}
          onChange={(value) => onParameterChange('inverseHealthcare', value)}
          weight={0.2}
          inverted={true}
        />
        
        <ParameterSlider 
          name="urban-wildlife"
          label="Urban-Wildlife Interface"
          value={parameters.urbanWildOverlap}
          onChange={(value) => onParameterChange('urbanWildOverlap', value)}
          weight={0.1}
        />

        {/* Advanced Settings Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full bg-neutral-medium hover:bg-neutral-dark text-neutral-darker py-2 px-4 rounded transition mb-4 flex items-center justify-center"
            >
              <Settings className="mr-2 h-4 w-4" /> Advanced Settings
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Advanced Settings</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Advanced configuration options will be available in a future update.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
