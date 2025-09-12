import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export function KpiCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
  className
}: KpiCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card className={cn(
      "relative overflow-hidden bg-gradient-card border-0 shadow-md hover:shadow-lg transition-all duration-300",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground">
              {formatValue(value)}
            </p>
            {description && (
              <p className="text-sm text-foreground">
                {description}
              </p>
            )}
            {change && (
              <div className="flex items-center space-x-1">
                <span className={cn(
                  "text-sm font-medium",
                  changeType === "positive" && "text-accent",
                  changeType === "negative" && "text-destructive",
                  changeType === "neutral" && "text-muted-foreground"
                )}>
                  {changeType === "positive" && "+"}
                  {change}
                </span>
                <span className="text-xs text-muted-foreground">from last month</span>
              </div>
            )}
          </div>
          
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-primary/5" />
        <div className="absolute -right-2 -bottom-2 w-16 h-16 rounded-full bg-primary/10" />
      </CardContent>
    </Card>
  );
}