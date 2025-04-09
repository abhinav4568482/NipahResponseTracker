import { useState, useEffect } from "react";
import { RiskParameters, Region } from "@/types";
import ParameterSlider from "./ParameterSlider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Indian states and districts
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

// District map - organized by state
const districtsByState: {[key: string]: string[]} = {
  "Kerala": ["Kozhikode", "Malappuram", "Kannur", "Wayanad", "Thrissur", "Palakkad", "Ernakulam", "Idukki"],
  "West Bengal": ["Siliguri", "Kolkata", "Howrah", "Darjeeling", "Jalpaiguri", "Cooch Behar", "Alipurduar"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirapalli", "Tirunelveli", "Erode"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Belagavi", "Kalaburagi", "Hubballi", "Shivamogga"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati", "Guntur", "Nellore", "Kurnool", "Kakinada"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur", "Nagaon", "Bongaigaon"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar"]
};

// Default districts for other states
const defaultDistricts = ["District 1", "District 2", "District 3"];

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
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const region = regions.find(r => r.id === selectedId);
    if (region) {
      onRegionSelect(region);
    }
  };
  
  // Update available districts when state selection changes
  useEffect(() => {
    if (selectedState) {
      setAvailableDistricts(districtsByState[selectedState] || defaultDistricts);
      // Reset selected district
      setSelectedDistrict("");
    } else {
      setAvailableDistricts([]);
    }
  }, [selectedState]);
  
  // Update selected region when state/district selection changes
  useEffect(() => {
    if (selectedState && selectedDistrict) {
      // Find matching region in the regions array
      const regionName = `${selectedDistrict} (${selectedState})`;
      const matchingStateRegion = regions.find(r => r.name === selectedState);
      const matchingDistrictRegion = regions.find(r => r.name === regionName || r.name.includes(selectedDistrict));
      
      // Prioritize more specific district match over state match
      const regionToSelect = matchingDistrictRegion || matchingStateRegion;
      
      if (regionToSelect) {
        onRegionSelect(regionToSelect);
      }
    }
  }, [selectedState, selectedDistrict, regions, onRegionSelect]);

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
          
          {/* State/District Selection */}
          <div className="space-y-3 mb-3">
            <div>
              <Label htmlFor="state-select" className="text-xs font-medium mb-1 block">State</Label>
              <Select 
                value={selectedState} 
                onValueChange={setSelectedState}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {indianStates.map(state => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="district-select" className="text-xs font-medium mb-1 block">District</Label>
              <Select 
                value={selectedDistrict} 
                onValueChange={setSelectedDistrict}
                disabled={!selectedState}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder={selectedState ? "Select a district" : "Select state first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableDistricts.map(district => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border-t border-neutral-medium pt-3 mt-3">
            <h4 className="text-xs font-medium mb-1">Direct Selection</h4>
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
            <div className="mt-2 text-xs text-neutral-darker flex items-center">
              <MapPin className="h-3 w-3 mr-1" /> Or click directly on the map
            </div>
          </div>
        </div>

        {/* Parameter Sliders */}
        <ParameterSlider 
          name="bat-density"
          label="Bat Density (B)"
          value={parameters.batDensity}
          onChange={(value) => onParameterChange('batDensity', value)}
          weight={0.25}
        />
        
        <ParameterSlider 
          name="pig-farming"
          label="Pig Farming Intensity (P)"
          value={parameters.pigFarmingIntensity}
          onChange={(value) => onParameterChange('pigFarmingIntensity', value)}
          weight={0.20}
        />
        
        <ParameterSlider 
          name="fruit-consumption"
          label="Fruit Consumption Practices (F)"
          value={parameters.fruitConsumptionPractices}
          onChange={(value) => onParameterChange('fruitConsumptionPractices', value)}
          weight={0.15}
        />
        
        <ParameterSlider 
          name="human-population"
          label="Human Population Density (H)"
          value={parameters.humanPopulationDensity}
          onChange={(value) => onParameterChange('humanPopulationDensity', value)}
          weight={0.15}
        />
        
        <ParameterSlider 
          name="healthcare"
          label="Healthcare Infrastructure (C)"
          value={parameters.healthcareInfrastructure}
          onChange={(value) => onParameterChange('healthcareInfrastructure', value)}
          weight={0.15}
          inverted={true}
        />
        
        <ParameterSlider 
          name="environment"
          label="Environmental Degradation (E)"
          value={parameters.environmentalDegradation}
          onChange={(value) => onParameterChange('environmentalDegradation', value)}
          weight={0.10}
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
          <DialogContent className="dialog-content">
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
