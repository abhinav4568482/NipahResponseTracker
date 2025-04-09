import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Worm, Info } from "lucide-react";

export default function AppHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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
              >
                <Info className="w-4 h-4 mr-1" /> About
              </Button>
            </DialogTrigger>
            <DialogContent className="dialog-content sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>About NORMS</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <h3 className="text-lg font-medium">Nipah Outbreak Risk Mapping & Response Simulator</h3>
                
                <p className="text-sm text-gray-600">
                  NORMS is a deterministic spatial tool for modeling and visualizing Nipah virus outbreak risk 
                  across India. The tool considers multiple risk factors based on scientific literature to 
                  estimate outbreak potential.
                </p>
                
                <div className="bg-neutral-50 rounded-md p-4">
                  <h4 className="font-medium mb-2">Key Risk Factors:</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>
                      <span className="font-medium">Bat Density (B):</span> Higher populations of Pteropus bats, 
                      the natural reservoir of Nipah virus.
                    </li>
                    <li>
                      <span className="font-medium">Pig Farming Intensity (P):</span> Proximity to pig farms, 
                      which can serve as amplifying hosts.
                    </li>
                    <li>
                      <span className="font-medium">Fruit Consumption Practices (F):</span> Consumption of raw 
                      date palm sap or contaminated fruits.
                    </li>
                    <li>
                      <span className="font-medium">Human Population Density (H):</span> Densely populated areas 
                      increase transmission potential.
                    </li>
                    <li>
                      <span className="font-medium">Healthcare Infrastructure (C):</span> Limited access to healthcare 
                      increases outbreak severity.
                    </li>
                    <li>
                      <span className="font-medium">Environmental Degradation (E):</span> Deforestation and habitat 
                      fragmentation increase bat-human contact.
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 rounded-md p-4">
                  <h4 className="font-medium mb-2">Using the Simulator:</h4>
                  <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-4">
                    <li>Select a state and district from the Parameters Panel</li>
                    <li>Adjust risk parameters using the sliders</li>
                    <li>Save parameters for future reference</li>
                    <li>Explore intervention scenarios in the Results Panel</li>
                    <li>Use the time controls to simulate seasonal effects</li>
                    <li>Export data for further analysis</li>
                  </ol>
                </div>
                
                <p className="text-xs text-gray-500 mt-6">
                  For more information on Nipah virus, please visit the 
                  <a href="https://www.who.int/health-topics/nipah-virus-infection" 
                     className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    World Health Organization
                  </a>.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}