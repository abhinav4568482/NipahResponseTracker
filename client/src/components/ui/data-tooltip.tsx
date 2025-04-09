import React, { useState } from 'react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DataTooltipProps {
  data: Record<string, any>;
  title?: string;
  children: React.ReactNode;
  showKeys?: boolean;
  formatValue?: (key: string, value: any) => string;
  keyMapping?: Record<string, string>;
  className?: string;
}

/**
 * DataTooltip - A component that shows detailed data on hover
 * 
 * @param data Object containing the data to display
 * @param title Optional title for the tooltip
 * @param children The element that triggers the tooltip
 * @param showKeys Whether to show the keys (defaults to true)
 * @param formatValue Optional function to format values
 * @param keyMapping Optional mapping of technical keys to display names
 * @param className Optional CSS class for the tooltip content
 */
export function DataTooltip({
  data,
  title,
  children,
  showKeys = true,
  formatValue,
  keyMapping = {},
  className,
}: DataTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Default formatter just converts to string
  const defaultFormatter = (key: string, value: any) => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    
    return String(value);
  };
  
  // Use provided formatter or default
  const formatter = formatValue || defaultFormatter;
  
  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          className={`max-w-sm p-3 border bg-white shadow-lg rounded-md ${className}`}
          side="right"
          sideOffset={5}
        >
          {title && (
            <div className="font-medium border-b pb-1 mb-2">{title}</div>
          )}
          <div className="text-sm space-y-1">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                {showKeys && (
                  <span className="text-gray-600 mr-2">
                    {keyMapping[key] || key}:
                  </span>
                )}
                <span className="font-medium">{formatter(key, value)}</span>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}