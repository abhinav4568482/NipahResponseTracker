import { useState } from "react";
import RiskScore from "./RiskScore";
import InterventionScenario from "./InterventionScenario";
import { Region, ActiveIntervention, RiskProjection } from "@/types";
import { interventions } from "@/data/interventions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { jsPDF } from "jspdf";
import { Bar } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

interface ResultsPanelProps {
  riskScore: number;
  selectedRegion: Region | null;
  activeInterventions: ActiveIntervention[];
  onAddIntervention: (intervention: ActiveIntervention) => void;
  onRemoveIntervention: (id: string) => void;
  currentMonth: number;
  riskProjection: RiskProjection;
}

export default function ResultsPanel({
  riskScore,
  selectedRegion,
  activeInterventions,
  onAddIntervention,
  onRemoveIntervention,
  currentMonth,
  riskProjection
}: ResultsPanelProps) {
  const [selectedInterventionId, setSelectedInterventionId] = useState<string>("");
  const [isMobileVisible, setIsMobileVisible] = useState(false);
  
  const toggleMobileVisibility = () => {
    setIsMobileVisible(!isMobileVisible);
  };

  const handleAddIntervention = () => {
    if (!selectedInterventionId) return;
    
    const intervention = interventions.find(i => i.id === selectedInterventionId);
    if (intervention) {
      const activeIntervention: ActiveIntervention = {
        ...intervention,
        appliedAt: currentMonth
      };
      
      onAddIntervention(activeIntervention);
      setSelectedInterventionId("");
    }
  };

  const handleInterventionChange = (value: string) => {
    setSelectedInterventionId(value);
  };

  // Calculate total risk reduction
  const calculateRiskReduction = () => {
    if (riskProjection.baseRisk.length === 0 || riskProjection.interventionRisk.length === 0) {
      return 0;
    }
    
    const originalRisk = riskProjection.baseRisk[currentMonth - 1] || riskScore;
    const reducedRisk = riskProjection.interventionRisk[currentMonth - 1] || riskScore;
    
    if (originalRisk === 0) return 0;
    
    const reduction = ((originalRisk - reducedRisk) / originalRisk) * 100;
    return Math.max(0, reduction);
  };

  const postInterventionRisk = riskProjection.interventionRisk[currentMonth - 1] || riskScore;
  const riskReduction = calculateRiskReduction();
  
  // Chart data configuration for before/after comparison
  const chartData = {
    labels: ['Without Interventions', 'With Interventions'],
    datasets: [
      {
        label: 'Risk Score',
        data: [
          riskProjection.baseRisk[0] || riskScore,
          riskProjection.interventionRisk[0] || riskScore
        ],
        backgroundColor: ['rgba(244, 67, 54, 0.6)', 'rgba(255, 152, 0, 0.6)'],
        borderColor: ['#f44336', '#ff9800'],
        borderWidth: 1
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const, // Horizontal bar chart
    plugins: {
      legend: {
        display: false, // Hide legend since we have labels
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Risk Score: ${context.parsed.x.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        min: 0,
        max: 1,
        title: {
          display: true,
          text: 'Risk Score'
        }
      },
      y: {
        title: {
          display: false
        }
      }
    }
  };

  // Generate PDF report
  const generateReport = () => {
    if (!selectedRegion) return;

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Nipah Virus Risk Assessment Report', 20, 20);
    
    // Region info
    doc.setFontSize(16);
    doc.text(`Region: ${selectedRegion.name}`, 20, 30);
    
    // Current risk score
    doc.setFontSize(14);
    doc.text(`Risk Score: ${riskScore.toFixed(2)}`, 20, 40);
    
    // Risk classification
    let riskCategory = "Low";
    if (riskScore > 0.55) riskCategory = "High";
    else if (riskScore >= 0.45) riskCategory = "Medium";
    
    doc.text(`Risk Classification: ${riskCategory}`, 20, 50);
    
    // Interventions
    doc.text("Applied Interventions:", 20, 60);
    if (activeInterventions.length === 0) {
      doc.text("None", 25, 70);
    } else {
      activeInterventions.forEach((intervention, index) => {
        doc.text(`- ${intervention.name}`, 25, 70 + (index * 10));
      });
    }
    
    // Risk reduction
    if (activeInterventions.length > 0) {
      const yPos = 70 + (activeInterventions.length * 10) + 10;
      doc.text(`Post-Intervention Risk: ${postInterventionRisk.toFixed(2)}`, 20, yPos);
      doc.text(`Risk Reduction: ${riskReduction.toFixed(1)}%`, 20, yPos + 10);
    }
    
    // Save the PDF
    doc.save(`nipah-risk-report-${selectedRegion.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div 
      className={`w-full md:w-96 bg-white shadow-md flex flex-col h-full overflow-hidden ${isMobileVisible ? 'block' : 'hidden md:flex'}`} 
      id="results-panel"
    >
      <div className="p-4 bg-orange-500 text-white flex justify-between items-center">
        <h2 className="font-medium">Risk Assessment</h2>
        <button 
          className="text-white hover:bg-white/20 p-1 rounded md:hidden" 
          onClick={toggleMobileVisibility}
        >
          <i className="ri-arrow-right-s-line"></i>
        </button>
      </div>
      
      <div className="overflow-y-auto flex-1 p-4">
        {/* Risk Score Card */}
        <RiskScore 
          score={riskScore} 
          regionName={selectedRegion?.name || ""} 
        />
        
        {/* Risk Comparison Graph */}
        <div className="mb-6 bg-gray-100 p-4 rounded">
          <h3 className="font-medium mb-3">Risk Comparison</h3>
          <div style={{ height: "200px" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
        
        {/* Intervention Scenario Builder */}
        <div className="mb-6 bg-gray-100 p-4 rounded">
          <h3 className="font-medium mb-3">Intervention Scenarios</h3>
          
          <div className="flex flex-col space-y-2 mb-4">
            <label className="text-sm font-medium">Add Intervention</label>
            <Select value={selectedInterventionId} onValueChange={handleInterventionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select intervention type" />
              </SelectTrigger>
              <SelectContent>
                {interventions.map(intervention => (
                  <SelectItem key={intervention.id} value={intervention.id}>
                    {intervention.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              className="bg-primary text-white"
              onClick={handleAddIntervention}
              disabled={!selectedInterventionId}
            >
              <i className="ri-add-line mr-1"></i> Add Intervention
            </Button>
          </div>
          
          {/* Active Interventions List */}
          {activeInterventions.length > 0 ? (
            <div className="border rounded divide-y">
              {activeInterventions.map(intervention => (
                <InterventionScenario 
                  key={intervention.id}
                  intervention={intervention}
                  onRemove={() => onRemoveIntervention(intervention.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-center py-3">
              No interventions applied yet
            </div>
          )}
          
          {/* Post-Intervention Risk */}
          {activeInterventions.length > 0 && (
            <div className="mt-4 p-3 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span>Original Risk:</span>
                <span className="font-medium text-red-500">{riskScore.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Post-Intervention:</span>
                <span className="font-medium text-orange-500">{postInterventionRisk.toFixed(2)}</span>
              </div>
              <div className="mt-2 text-xs bg-orange-500 text-white p-1 text-center rounded">
                {riskReduction.toFixed(1)}% Risk Reduction
              </div>
            </div>
          )}
        </div>
        
        {/* Report Actions */}
        <div className="flex space-x-2">
          <Button 
            className="flex-1 bg-primary text-white hover:bg-primary-dark"
            onClick={generateReport}
            disabled={!selectedRegion}
          >
            <i className="ri-file-pdf-line mr-2"></i> Generate Report
          </Button>
          <Button variant="outline" className="bg-gray-200 hover:bg-gray-300">
            <i className="ri-save-line"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
