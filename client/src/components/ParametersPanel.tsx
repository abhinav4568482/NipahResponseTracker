import { useState, useEffect } from "react";
import { RiskParameters, Region } from "@/types";
import ParameterSlider from "./ParameterSlider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Parameter weights interface
interface RiskParameterWeight {
  batDensity: number;
  pigFarmingIntensity: number;
  fruitConsumptionPractices: number;
  humanPopulationDensity: number;
  healthcareInfrastructure: number;
  environmentalDegradation: number;
}

// Interface for custom region data
interface CustomRegionData {
  state: string;
  district: string;
  parameters: RiskParameters;
}

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
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati", "Guntur", "Nellore", "Kurnool", "Kakinada", "Anantapur", "Kadapa", "Eluru", "Ongole"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Bomdila", "Ziro", "Tezu", "Roing", "Yingkiong", "Aalo"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur", "Nagaon", "Bongaigaon", "Tinsukia", "Goalpara", "Karimganj", "Dhubri"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Arrah", "Begusarai", "Chhapra", "Katihar", "Purnia", "Samastipur"],
  "Chhattisgarh": ["Raipur", "Bilaspur", "Bhilai", "Korba", "Durg", "Rajnandgaon", "Raigarh", "Jagdalpur", "Ambikapur", "Dhamtari"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Curchorem", "Canacona", "Bicholim", "Pernem", "Quepem"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand", "Bharuch", "Patan"],
  "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Hisar", "Karnal", "Rohtak", "Sonipat", "Yamunanagar", "Panchkula"],
  "Himachal Pradesh": ["Shimla", "Mandi", "Dharamshala", "Solan", "Kullu", "Hamirpur", "Nahan", "Chamba", "Bilaspur", "Una"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Ramgarh", "Phusro", "Medininagar"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Belagavi", "Kalaburagi", "Hubballi", "Shivamogga", "Tumakuru", "Davanagere", "Ballari", "Vijayapura"],
  "Kerala": ["Kozhikode", "Malappuram", "Kannur", "Wayanad", "Thrissur", "Palakkad", "Ernakulam", "Idukki", "Thiruvananthapuram", "Kollam", "Kottayam"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Rewa", "Ratlam", "Singrauli"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Nanded", "Sangli"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Senapati", "Ukhrul", "Chandel", "Churachandpur", "Tamenglong", "Jiribam", "Kangpokpi"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar", "Baghmara", "Resubelpara", "Khliehriat", "Mawkyrwat", "Ampati"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Kolasib", "Serchhip", "Siaha", "Lawngtlai", "Mamit", "Khawzawl", "Saitual"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Phek", "Mon", "Peren", "Kiphire"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jeypore", "Jharsuguda"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Hoshiarpur", "Mohali", "Batala", "Pathankot", "Moga"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bharatpur", "Sikar", "Alwar", "Bhilwara"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo", "Singtam", "Jorethang", "Nayabazar", "Chungthang", "Ravangla"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirapalli", "Tirunelveli", "Erode", "Tiruppur", "Vellore", "Thanjavur", "Dindigul"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Siddipet"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Belonia", "Khowai", "Ambassa", "Sonamura", "Sabroom", "Santirbazar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Aligarh", "Bareilly", "Moradabad", "Saharanpur"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Pithoragarh", "Ramnagar", "Khatima"],
  "West Bengal": ["Kolkata", "Siliguri", "Howrah", "Darjeeling", "Jalpaiguri", "Cooch Behar", "Alipurduar", "Durgapur", "Asansol", "Kharagpur", "Malda"]
};

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
  
  // Parameter weights for advanced settings
  const [parameterWeights, setParameterWeights] = useState<RiskParameterWeight>({
    batDensity: 0.25,
    pigFarmingIntensity: 0.20,
    fruitConsumptionPractices: 0.15,
    humanPopulationDensity: 0.15,
    healthcareInfrastructure: 0.15,
    environmentalDegradation: 0.10
  });
  
  // Load saved parameters from localStorage if available
  useEffect(() => {
    // Load stored locations and parameters
    const savedData = localStorage.getItem('normsCustomData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as CustomRegionData[];
        // If a location is already selected, try to load its saved parameters
        if (selectedState && selectedDistrict) {
          const savedRegion = parsedData.find(
            item => item.state === selectedState && item.district === selectedDistrict
          );
          
          if (savedRegion) {
            // Update the parameters
            Object.keys(savedRegion.parameters).forEach(key => {
              const paramKey = key as keyof RiskParameters;
              onParameterChange(paramKey, savedRegion.parameters[paramKey]);
            });
          }
        }
      } catch (e) {
        console.error("Error loading saved parameters:", e);
      }
    }
  }, [selectedState, selectedDistrict, onParameterChange]);
  
  // Update available districts when state selection changes
  useEffect(() => {
    if (selectedState) {
      setAvailableDistricts(districtsByState[selectedState] || []);
      // Reset selected district
      setSelectedDistrict("");
    } else {
      setAvailableDistricts([]);
    }
  }, [selectedState]);
  
  // Update selected region when state/district selection changes
  useEffect(() => {
    if (selectedState) {
      // If state is selected but no district, select the state-level region
      const matchingStateRegion = regions.find(r => r.name === selectedState);
      
      if (selectedDistrict) {
        // If both state and district are selected, look for a more specific match
        const regionName = `${selectedDistrict} (${selectedState})`;
        const matchingDistrictRegion = regions.find(r => 
          r.name === regionName || 
          r.name.includes(selectedDistrict) || 
          (r.name.includes(selectedState) && r.name.includes(selectedDistrict))
        );
        
        // Prioritize district-level match
        const regionToSelect = matchingDistrictRegion || matchingStateRegion;
        
        if (regionToSelect) {
          onRegionSelect(regionToSelect);
        } else {
          // If no matching region in the dataset, still update UI to show selection
          console.log(`No matching region for ${selectedDistrict}, ${selectedState}`);
        }
      } else if (matchingStateRegion) {
        // If only state selected, use the state-level region
        onRegionSelect(matchingStateRegion);
      }
    }
  }, [selectedState, selectedDistrict, regions, onRegionSelect]);

  const toggleMobileVisibility = () => {
    setIsMobileVisible(!isMobileVisible);
  };
  
  // Function to update weight in advanced settings
  const handleWeightChange = (param: keyof RiskParameterWeight, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
      setParameterWeights(prev => ({
        ...prev,
        [param]: numValue
      }));
    }
  };
  
  // Function to apply weight changes to risk calculation
  const applyWeightChanges = () => {
    // Store weights in localStorage
    localStorage.setItem('normsWeights', JSON.stringify(parameterWeights));
    // TODO: Update global weights in risk calculation
    alert("Parameter weights saved successfully!");
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
          <div className="space-y-3">
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
            
            <div className="mt-2 text-xs text-neutral-darker flex items-center">
              <MapPin className="h-3 w-3 mr-1" /> You can also click directly on the map
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
              <DialogDescription>
                Customize risk parameter weights for the selected region
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <div className="mb-4">
                <p className="text-sm mb-2">These weights determine how much each parameter contributes to the risk score. The sum of all weights should equal 1.0.</p>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 items-center gap-2">
                  <Label htmlFor="weight-bat" className="text-xs">Bat Density (B)</Label>
                  <Input
                    id="weight-bat"
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={parameterWeights.batDensity}
                    onChange={(e) => handleWeightChange('batDensity', e.target.value)}
                    className="text-right"
                  />
                </div>
                
                <div className="grid grid-cols-2 items-center gap-2">
                  <Label htmlFor="weight-pig" className="text-xs">Pig Farming Intensity (P)</Label>
                  <Input
                    id="weight-pig"
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={parameterWeights.pigFarmingIntensity}
                    onChange={(e) => handleWeightChange('pigFarmingIntensity', e.target.value)}
                    className="text-right"
                  />
                </div>
                
                <div className="grid grid-cols-2 items-center gap-2">
                  <Label htmlFor="weight-fruit" className="text-xs">Fruit Consumption (F)</Label>
                  <Input
                    id="weight-fruit"
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={parameterWeights.fruitConsumptionPractices}
                    onChange={(e) => handleWeightChange('fruitConsumptionPractices', e.target.value)}
                    className="text-right"
                  />
                </div>
                
                <div className="grid grid-cols-2 items-center gap-2">
                  <Label htmlFor="weight-population" className="text-xs">Human Population (H)</Label>
                  <Input
                    id="weight-population"
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={parameterWeights.humanPopulationDensity}
                    onChange={(e) => handleWeightChange('humanPopulationDensity', e.target.value)}
                    className="text-right"
                  />
                </div>
                
                <div className="grid grid-cols-2 items-center gap-2">
                  <Label htmlFor="weight-healthcare" className="text-xs">Healthcare Infrastructure (C)</Label>
                  <Input
                    id="weight-healthcare"
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={parameterWeights.healthcareInfrastructure}
                    onChange={(e) => handleWeightChange('healthcareInfrastructure', e.target.value)}
                    className="text-right"
                  />
                </div>
                
                <div className="grid grid-cols-2 items-center gap-2">
                  <Label htmlFor="weight-environment" className="text-xs">Environmental Degradation (E)</Label>
                  <Input
                    id="weight-environment"
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={parameterWeights.environmentalDegradation}
                    onChange={(e) => handleWeightChange('environmentalDegradation', e.target.value)}
                    className="text-right"
                  />
                </div>
              </div>
              
              <div className="pt-3 border-t mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Weight Total:</span>
                  <span className={`text-sm font-bold ${
                    Math.abs(Object.values(parameterWeights).reduce((a, b) => a + b, 0) - 1) < 0.01 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {Object.values(parameterWeights).reduce((a, b) => a + b, 0).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">The total of all weights should be 1.0 for proper normalization</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                onClick={applyWeightChanges}
                disabled={Math.abs(Object.values(parameterWeights).reduce((a, b) => a + b, 0) - 1) > 0.01}
              >
                Apply Weights
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
