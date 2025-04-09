import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ActiveIntervention } from "@/types";

interface InterventionScenarioProps {
  intervention: ActiveIntervention;
  onRemove: () => void;
}

export default function InterventionScenario({ 
  intervention, 
  onRemove 
}: InterventionScenarioProps) {
  const impactValue = Math.abs(intervention.impact.effect);
  
  return (
    <div className="p-3 flex justify-between items-center">
      <div>
        <div className="font-medium">{intervention.name}</div>
        <div className="text-xs text-gray-500">Est. impact: -{impactValue.toFixed(2)}</div>
      </div>
      <Button 
        variant="ghost" 
        size="sm"
        className="text-red-500 hover:bg-gray-200 h-8 w-8 p-0"
        onClick={onRemove}
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
}
