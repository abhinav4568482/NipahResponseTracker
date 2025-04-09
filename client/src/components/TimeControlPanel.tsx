import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { SeasonalEvent } from "@/types";

interface TimeControlPanelProps {
  currentMonth: number;
  onMonthChange: (month: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  seasonalEvents: SeasonalEvent[];
}

export default function TimeControlPanel({
  currentMonth,
  onMonthChange,
  isPlaying,
  onTogglePlay,
  seasonalEvents
}: TimeControlPanelProps) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleSliderChange = (values: number[]) => {
    onMonthChange(values[0]);
  };

  const handleReset = () => {
    onMonthChange(1);
    if (isPlaying) onTogglePlay();
  };

  // Get active seasonal events for current month
  const activeEvents = seasonalEvents.filter(event => 
    event.months.includes(currentMonth)
  );

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Temporal Simulation</h3>
        <div className="flex items-center space-x-1">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={onTogglePlay}
            className="text-neutral-darker hover:text-primary-dark"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleReset}
            className="text-neutral-darker hover:text-primary-dark"
          >
            <RotateCcw size={18} />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-sm font-mono">{monthNames[currentMonth - 1]}</span>
        <Slider
          id="time-slider"
          min={1}
          max={12}
          step={1}
          value={[currentMonth]}
          onValueChange={handleSliderChange}
          className="flex-1"
        />
        <span className="text-sm font-mono">{monthNames[11]}</span>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-1 text-xs">
        {activeEvents.map(event => (
          <div key={event.id} className="py-1 px-2 rounded bg-primary text-white">
            <i className={`${event.icon} mr-1`}></i> {event.name}
          </div>
        ))}
      </div>
    </div>
  );
}
