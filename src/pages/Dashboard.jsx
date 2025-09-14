import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { api } from "@/lib/api";
import {
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  UserCheck,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "MM"));

  // Generate month options for the selected year
  const generateMonthOptions = () => {
    const options = [];
    
    for (let month = 0; month < 12; month++) {
      const date = new Date(selectedYear, month);
      const value = format(date, "MM");
      const label = format(date, "MMM");
      options.push({ value, label });
    }
    
    return options;
  };

  const handlePreviousYear = () => {
    setSelectedYear(prev => prev - 1);
  };

  const handleNextYear = () => {
    setSelectedYear(prev => prev + 1);
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await api.getGlobalMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-8">
        <div className="text-center text-muted-foreground">
          Failed to load dashboard metrics.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-muted min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-foreground">
          Welcome to Athena LMS Super Admin Dashboard. Monitor your platform's performance and manage organizations.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Platform Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">API Response</span>
                <span className="text-sm font-medium text-accent">152ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Storage Used</span>
                <span className="text-sm font-medium text-accent">2.4TB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span>Revenue Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly Subscriptions</span>
                <span className="text-sm font-medium">$89K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Annual Subscriptions</span>
                <span className="text-sm font-medium">$156K</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Other KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        
        <KpiCard
          title="Total Users"
          value={metrics.totalUsers}
          change="8.2%"
          changeType="positive"
          icon={Users}
          description="All users across platform"
        />
        
        <KpiCard
          title="Total Organizations"
          value={metrics.totalOrganizations}
          change="12.5%"
          changeType="positive"
          icon={Building2}
          description="Active client organizations"
        />
        
        <KpiCard
          title="Active Users (30d)"
          value={metrics.activeUsers}
          change="4.8%"
          changeType="positive"
          icon={UserCheck}
          description="Users active in last 30 days"
        />
      </div>

      {/* Monthly Revenue Card - Featured */}
      <Card className="relative overflow-hidden bg-gradient-card border-0 shadow-md hover:shadow-lg transition-all duration-300 md:col-span-2">
        <CardContent className="p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="space-y-4">
                <p className="text-lg font-medium text-muted-foreground uppercase tracking-wide">
                  Monthly Revenue
                </p>
                
                {/* Date selector - horizontal 3x3 grid */}
                <div className="space-y-4">
                  {/* Year selector with arrows */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={handlePreviousYear}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <span className="text-lg font-medium min-w-[4rem] text-center">
                      {selectedYear}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={handleNextYear}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* Month selector - 3x4 grid */}
                  <div className="grid grid-cols-3 gap-2 max-w-xs">
                    {generateMonthOptions().map((option) => (
                      <Button
                        key={option.value}
                        variant={selectedMonth === option.value ? "default" : "outline"}
                        size="sm"
                        className="h-10"
                        onClick={() => setSelectedMonth(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-4xl font-bold text-foreground">
                ${metrics.revenue.toLocaleString()}
              </p>
              <p className="text-base text-foreground">
                Recurring subscription revenue
              </p>
              <div className="flex items-center space-x-1">
                <span className="text-base font-medium text-accent">
                  +18.5%
                </span>
                <span className="text-sm text-muted-foreground">from last month</span>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-primary/5" />
          <div className="absolute -right-3 -bottom-3 w-20 h-20 rounded-full bg-primary/10" />
        </CardContent>
      </Card>
    </div>
  );
}