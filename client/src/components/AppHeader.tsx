import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Worm } from "lucide-react";

export default function AppHeader() {
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const handleLoadData = () => {
    setIsLoading(true);
    
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export
    setTimeout(() => {
      // Create a JSON object with the current state
      const dummyData = { timestamp: new Date().toISOString() };
      
      // Convert to JSON string
      const jsonString = JSON.stringify(dummyData, null, 2);
      
      // Create blob and download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'norms-export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsExporting(false);
    }, 1000);
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
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-transparent"
                disabled={isLoading}
              >
                <i className="ri-upload-line mr-1"></i> Load Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Load Data</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-gray-500 mb-4">
                  Upload a JSON file containing region data and parameters.
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
                  />
                  <label 
                    htmlFor="file-upload" 
                    className="mt-2 inline-block px-4 py-2 bg-primary text-white rounded cursor-pointer"
                  >
                    Browse Files
                  </label>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            size="sm" 
            variant="outline"
            className="bg-white/20 hover:bg-white/30 text-white border-transparent"
            onClick={handleExport}
            disabled={isExporting}
          >
            <i className="ri-download-line mr-1"></i> Export
          </Button>
        </div>
      </div>
    </header>
  );
}
