import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Worm, Save, Upload, Download } from "lucide-react";
import { regions } from "@/data/regions";
import { RiskParameters } from "@/types";

// Generated list of Indian states
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

interface CustomRegionData {
  state: string;
  district: string;
  parameters: RiskParameters;
}

export default function AppHeader() {
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [customData, setCustomData] = useState<CustomRegionData[]>([]);
  const [currentParameters, setCurrentParameters] = useState<RiskParameters>({
    batDensity: 0.5,
    pigFarmingIntensity: 0.5,
    fruitConsumptionPractices: 0.5,
    humanPopulationDensity: 0.5,
    healthcareInfrastructure: 0.5,
    environmentalDegradation: 0.5
  });
  
  useEffect(() => {
    // Initialize saved data from localStorage if available
    const savedData = localStorage.getItem('normsCustomData');
    if (savedData) {
      try {
        setCustomData(JSON.parse(savedData));
      } catch (e) {
        console.error("Error loading saved data:", e);
      }
    }
  }, []);
  
  useEffect(() => {
    // When state selection changes, update the available districts
    if (selectedState) {
      setAvailableDistricts(districtsByState[selectedState] || defaultDistricts);
      // Reset selected district
      setSelectedDistrict("");
    } else {
      setAvailableDistricts([]);
      setSelectedDistrict("");
    }
  }, [selectedState]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (Array.isArray(data)) {
            setCustomData(data);
            localStorage.setItem('normsCustomData', JSON.stringify(data));
            alert("Data loaded successfully!");
          } else {
            alert("Invalid data format. Expected an array of region data.");
          }
        } catch (error) {
          alert("Error parsing JSON file: " + error);
        }
      };
      reader.readAsText(file);
    }
  };
  
  const handleParameterChange = (param: keyof RiskParameters, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
      setCurrentParameters(prev => ({
        ...prev,
        [param]: numValue
      }));
    }
  };
  
  const handleSaveParameters = () => {
    if (!selectedState || !selectedDistrict) {
      alert("Please select both state and district");
      return;
    }
    
    // Create new entry or update existing
    const newData = [...customData];
    const existingIndex = newData.findIndex(
      item => item.state === selectedState && item.district === selectedDistrict
    );
    
    if (existingIndex >= 0) {
      newData[existingIndex].parameters = {...currentParameters};
    } else {
      newData.push({
        state: selectedState,
        district: selectedDistrict,
        parameters: {...currentParameters}
      });
    }
    
    setCustomData(newData);
    
    // Save to localStorage
    localStorage.setItem('normsCustomData', JSON.stringify(newData));
    alert("Parameters saved for " + selectedDistrict + ", " + selectedState);
  };
  
  const handleExport = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      // Export the custom data
      const jsonString = JSON.stringify(customData, null, 2);
      
      // Create blob and download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'norms-custom-regions.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsExporting(false);
    }, 1000);
  };
  
  const loadSavedParameters = () => {
    if (!selectedState || !selectedDistrict) {
      alert("Please select both state and district");
      return;
    }
    
    const savedData = customData.find(
      item => item.state === selectedState && item.district === selectedDistrict
    );
    
    if (savedData) {
      setCurrentParameters(savedData.parameters);
    } else {
      alert("No saved data found for " + selectedDistrict + ", " + selectedState);
    }
  };
  
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Worm className="h-6 w-6" />
          <h1 className="text-xl font-medium">NORMS</h1>
          <span className="text-sm text-blue-200 hidden md:inline">Nipah Outbreak Risk Mapping & Response Simulator</span>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-transparent"
                disabled={isLoading}
              >
                <Upload className="w-4 h-4 mr-1" /> Load Data
              </Button>
            </DialogTrigger>
            <DialogContent className="dialog-content sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Data Management</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="edit" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit">Edit Parameters</TabsTrigger>
                  <TabsTrigger value="import">Import/Export</TabsTrigger>
                </TabsList>
                
                <TabsContent value="edit" className="mt-4">
                  <div className="space-y-4">
                    <div className="state-district-select grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="state-select">State</Label>
                        <Select 
                          value={selectedState} 
                          onValueChange={setSelectedState}
                        >
                          <SelectTrigger>
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
                        <Label htmlFor="district-select">District</Label>
                        <Select 
                          value={selectedDistrict} 
                          onValueChange={setSelectedDistrict}
                          disabled={!selectedState}
                        >
                          <SelectTrigger>
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
                    
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={loadSavedParameters}
                        disabled={!selectedState || !selectedDistrict}
                      >
                        Load Saved Parameters
                      </Button>
                    </div>
                    
                    <div className="parameter-inputs grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="parameter-input-group">
                        <Label htmlFor="bat-density">Bat Density (B)</Label>
                        <Input 
                          id="bat-density"
                          type="number" 
                          min="0" 
                          max="1" 
                          step="0.01"
                          value={currentParameters.batDensity}
                          onChange={(e) => handleParameterChange('batDensity', e.target.value)}
                        />
                      </div>
                      
                      <div className="parameter-input-group">
                        <Label htmlFor="pig-farming">Pig Farming Intensity (P)</Label>
                        <Input 
                          id="pig-farming"
                          type="number" 
                          min="0" 
                          max="1" 
                          step="0.01"
                          value={currentParameters.pigFarmingIntensity}
                          onChange={(e) => handleParameterChange('pigFarmingIntensity', e.target.value)}
                        />
                      </div>
                      
                      <div className="parameter-input-group">
                        <Label htmlFor="fruit-consumption">Fruit Consumption (F)</Label>
                        <Input 
                          id="fruit-consumption"
                          type="number" 
                          min="0" 
                          max="1" 
                          step="0.01"
                          value={currentParameters.fruitConsumptionPractices}
                          onChange={(e) => handleParameterChange('fruitConsumptionPractices', e.target.value)}
                        />
                      </div>
                      
                      <div className="parameter-input-group">
                        <Label htmlFor="human-population">Human Population (H)</Label>
                        <Input 
                          id="human-population"
                          type="number" 
                          min="0" 
                          max="1" 
                          step="0.01"
                          value={currentParameters.humanPopulationDensity}
                          onChange={(e) => handleParameterChange('humanPopulationDensity', e.target.value)}
                        />
                      </div>
                      
                      <div className="parameter-input-group">
                        <Label htmlFor="healthcare">Healthcare Infrastructure (C)</Label>
                        <Input 
                          id="healthcare"
                          type="number" 
                          min="0" 
                          max="1" 
                          step="0.01"
                          value={currentParameters.healthcareInfrastructure}
                          onChange={(e) => handleParameterChange('healthcareInfrastructure', e.target.value)}
                        />
                      </div>
                      
                      <div className="parameter-input-group">
                        <Label htmlFor="environment">Environmental Degradation (E)</Label>
                        <Input 
                          id="environment"
                          type="number" 
                          min="0" 
                          max="1" 
                          step="0.01"
                          value={currentParameters.environmentalDegradation}
                          onChange={(e) => handleParameterChange('environmentalDegradation', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter className="mt-6">
                    <Button 
                      onClick={handleSaveParameters}
                      disabled={!selectedState || !selectedDistrict}
                    >
                      <Save className="w-4 h-4 mr-1" /> Save Parameters
                    </Button>
                  </DialogFooter>
                </TabsContent>
                
                <TabsContent value="import" className="mt-4">
                  <div className="space-y-4">
                    <div className="import-section">
                      <h3 className="text-lg font-medium mb-2">Import Data</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Upload a JSON file with custom region parameters.
                      </p>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                        <p className="text-sm text-gray-500">
                          Drag and drop files here or click to browse
                        </p>
                        <input 
                          type="file" 
                          className="hidden" 
                          id="file-upload"
                          accept=".json"
                          onChange={handleFileUpload}
                        />
                        <label 
                          htmlFor="file-upload" 
                          className="mt-2 inline-block px-4 py-2 bg-primary text-white rounded cursor-pointer"
                        >
                          Browse Files
                        </label>
                      </div>
                    </div>
                    
                    <div className="export-section mt-8">
                      <h3 className="text-lg font-medium mb-2">Export Data</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Export your custom region parameters as a JSON file.
                      </p>
                      <Button 
                        onClick={handleExport}
                        disabled={customData.length === 0 || isExporting}
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-1" /> Export Custom Parameters
                      </Button>
                    </div>
                    
                    <div className="saved-data mt-8">
                      <h3 className="text-lg font-medium mb-2">Saved Regions</h3>
                      {customData.length > 0 ? (
                        <div className="border rounded overflow-hidden max-h-48 overflow-y-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-2 text-left">State</th>
                                <th className="px-4 py-2 text-left">District</th>
                              </tr>
                            </thead>
                            <tbody>
                              {customData.map((item, idx) => (
                                <tr key={idx} className="border-t">
                                  <td className="px-4 py-2">{item.state}</td>
                                  <td className="px-4 py-2">{item.district}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No custom regions saved yet.</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
          
          <Button 
            size="sm" 
            variant="outline"
            className="bg-white/20 hover:bg-white/30 text-white border-transparent"
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download className="w-4 h-4 mr-1" /> Export
          </Button>
        </div>
      </div>
    </header>
  );
}
