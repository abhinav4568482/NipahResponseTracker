import { useMemo } from "react";

interface RiskScoreProps {
  score: number;
  regionName: string;
}

export default function RiskScore({ score, regionName }: RiskScoreProps) {
  const riskCategory = useMemo(() => {
    if (score > 0.55) return { label: "HIGH RISK", color: "bg-red-500 text-red-500" };
    if (score >= 0.45) return { label: "MEDIUM RISK", color: "bg-orange-500 text-orange-500" };
    return { label: "LOW RISK", color: "bg-green-500 text-green-500" };
  }, [score]);

  const recommendationText = useMemo(() => {
    if (score > 0.55) return "Immediate intervention required";
    if (score >= 0.45) return "Monitor situation closely";
    return "Continue routine surveillance";
  }, [score]);

  return (
    <div className="mb-6 bg-gray-100 p-4 rounded">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Current Risk Score</h3>
        <span className="text-xs text-gray-500">{regionName}</span>
      </div>
      
      <div className="flex items-center justify-center p-4">
        <div className={`w-36 h-36 rounded-full flex items-center justify-center ${riskCategory.color.split(' ')[0]} text-white text-4xl font-bold border-4 border-white`}>
          {score.toFixed(2)}
        </div>
      </div>
      
      <div className="text-center">
        <span className={`font-medium ${riskCategory.color.split(' ')[1]}`}>{riskCategory.label}</span>
        <p className="text-sm text-gray-700 mt-1">{recommendationText}</p>
      </div>
    </div>
  );
}
