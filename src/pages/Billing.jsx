import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Search,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Mail,
  Volume2
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";

export default function Billing() {
  const [billingRecords, setBillingRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const data = await api.getBillingRecords();
        setBillingRecords(data);
        setFilteredRecords(data);
      } catch (error) {
        console.error("Failed to fetch billing data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  useEffect(() => {
    let filtered = billingRecords.filter(record => {
      const matchesSearch = record.organizationName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || record.status === statusFilter;
      const matchesSubscription = subscriptionFilter === "all" || record.subscriptionType === subscriptionFilter;
      
      return matchesSearch && matchesStatus && matchesSubscription;
    });
    
    setFilteredRecords(filtered);
  }, [searchQuery, statusFilter, subscriptionFilter, billingRecords]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <Badge className="bg-accent/10 text-accent hover:bg-accent/20">Paid</Badge>;
      case 'Pending':
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">Pending</Badge>;
      case 'Overdue':
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSubscriptionBadge = (type) => {
    return type === 'Annual' 
      ? <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Annual</Badge>
      : <Badge variant="outline">Monthly</Badge>;
  };

  // Calculate metrics
  const totalRevenue = billingRecords.reduce((sum, record) => 
    record.status === 'Paid' ? sum + record.amount : sum, 0
  );
  const pendingRevenue = billingRecords.reduce((sum, record) => 
    record.status === 'Pending' ? sum + record.amount : sum, 0
  );
  const overdueRevenue = billingRecords.reduce((sum, record) => 
    record.status === 'Overdue' ? sum + record.amount : sum, 0
  );
  const monthlySubscriptions = billingRecords.filter(r => r.subscriptionType === 'Monthly').length;
  const annualSubscriptions = billingRecords.filter(r => r.subscriptionType === 'Annual').length;

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <CreditCard className="h-8 w-8 text-primary" />
            <span>Billing & Subscriptions</span>
          </h1>
          <p className="text-muted-foreground">
            Monitor subscriptions, invoices, and payment statuses
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <KpiCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change="18.5%"
          changeType="positive"
          icon={DollarSign}
        />
        
        <KpiCard
          title="Active Subscriptions"
          value={billingRecords.length}
          change="8.7%"
          changeType="positive"
          icon={TrendingUp}
          description={`${monthlySubscriptions} monthly • ${annualSubscriptions} annual`}
        />
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Annual">Annual</SelectItem>
              </SelectContent>
            </Select>
            
            <Badge variant="outline" className="text-muted-foreground">
              {filteredRecords.length} records
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Billing Table */}
      <Card className="bg-gradient-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Billing Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px] w-full">
            <Table>
            <TableHeader>
              <TableRow className="border-b border-border/50">
                <TableHead className="font-semibold">Organization</TableHead>
                <TableHead className="font-semibold">Subscription</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Paid Date</TableHead>
                <TableHead className="font-semibold">Due Date</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow 
                  key={record.id} 
                  className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="font-medium text-foreground">{record.organizationName}</div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      {getSubscriptionBadge(record.subscriptionType)}
                      <div className="text-sm text-muted-foreground">
                        {record.subscriptionType === 'Annual' ? 'Yearly billing' : 'Monthly billing'}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-medium flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>${record.amount.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {getStatusBadge(record.status)}
                  </TableCell>
                  
                  <TableCell>
                    {record.paidDate ? (
                      <div className="space-y-1">
                        <div className="font-medium flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-accent" />
                          <span>{new Date(record.paidDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(record.dueDate).toLocaleDateString()}</span>
                      </div>
                      {record.status === 'Overdue' && (
                        <div className="text-sm text-destructive">
                          {Math.floor((Date.now() - new Date(record.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Mail className="h-3 w-3 mr-1" />
                        Send Reminder
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <CreditCard className="h-3 w-3 mr-1" />
                        View Invoice
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </ScrollArea>
          
          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No billing records found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all" || subscriptionFilter !== "all" 
                  ? "Try adjusting your search criteria or filters" 
                  : "No billing records available"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}