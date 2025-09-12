import { useEffect, useState } from "react";
import { api, Organization } from "@/lib/api";
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
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  Search,
  MoreHorizontal,
  Users,
  BookOpen,
  HardDrive,
  Calendar,
  Eye,
  UserX
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Organizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrgs, setFilteredOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Organization dashboard URLs mapping
  const organizationDashboards: Record<string, string> = {
    '1': 'https://lmsathena.com/login', // Creditor Academy
    // Add more organization dashboard URLs here as needed
    // '2': 'https://org2-dashboard.com/login',
    // '3': 'https://org3-dashboard.com/login',
    // etc.
  };

  const handleViewDetail = (orgId: string) => {
    const dashboardUrl = organizationDashboards[orgId];
    if (dashboardUrl) {
      // Open external dashboard in new tab
      window.open(dashboardUrl, '_blank');
    } else {
      // Fallback to internal route if no external URL is configured
      navigate(`/organizations/${orgId}`);
    }
  };

  const handleSuspendService = async (orgId: string) => {
    try {
      await api.updateOrganizationStatus(orgId, 'Suspended');
      // Update local state to reflect the change
      setOrganizations(prevOrgs => 
        prevOrgs.map(org => 
          org.id === orgId ? { ...org, status: 'Suspended' } : org
        )
      );
      setFilteredOrgs(prevOrgs => 
        prevOrgs.map(org => 
          org.id === orgId ? { ...org, status: 'Suspended' } : org
        )
      );
    } catch (error) {
      console.error("Failed to suspend organization:", error);
    }
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await api.getOrganizations();
        setOrganizations(data);
        setFilteredOrgs(data);
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  useEffect(() => {
    const filtered = organizations.filter(org =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.subscriptionType.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrgs(filtered);
  }, [searchQuery, organizations]);


  const getSubscriptionBadge = (type: Organization['subscriptionType']) => {
    return type === 'Annual' 
      ? <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Annual</Badge>
      : <Badge variant="outline">Monthly</Badge>;
  };


  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-80" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
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
            <Building2 className="h-8 w-8 text-primary" />
            <span>Organizations</span>
          </h1>
          <p className="text-muted-foreground">
            Manage all client organizations and their subscriptions
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search organizations by name or subscription type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline" className="text-muted-foreground">
              {filteredOrgs.length} organizations
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Organizations Table */}
      <Card className="bg-gradient-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">All Organizations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px] w-full">
            <Table>
            <TableHeader>
              <TableRow className="border-b border-border/50">
                <TableHead className="font-semibold w-16">Sr.No</TableHead>
                <TableHead className="font-semibold">Organization</TableHead>
                <TableHead className="font-semibold">Subscription</TableHead>
                <TableHead className="font-semibold">Users</TableHead>
                <TableHead className="font-semibold">Used tokens</TableHead>
                <TableHead className="font-semibold">Storage</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrgs.map((org, index) => (
                <TableRow 
                  key={org.id} 
                  className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="font-medium text-muted-foreground">
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{org.name}</div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      {getSubscriptionBadge(org.subscriptionType)}
                      <div className="text-sm text-muted-foreground">
                        ${org.subscriptionType === 'Annual' ? '9,999' : '999'}/
                        {org.subscriptionType === 'Annual' ? 'year' : 'month'}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-2">
                      <div className="font-medium flex items-center space-x-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{org.totalUsers.toLocaleString()}</span>
                        <span className="text-muted-foreground">/ {org.maxUsers}</span>
                      </div>
                      <div className="space-y-1">
                        <Progress 
                          value={(org.totalUsers / org.maxUsers) * 100} 
                          className="h-2"
                          max={100}
                        />
                        <div className="text-xs text-muted-foreground flex justify-between">
                          <span>{org.instructors} instructors • {org.learners} learners</span>
                          <span className={`font-medium ${
                            org.totalUsers >= org.maxUsers 
                              ? 'text-destructive' 
                              : org.totalUsers >= org.maxUsers * 0.9 
                                ? 'text-yellow-600' 
                                : 'text-muted-foreground'
                          }`}>
                            {((org.totalUsers / org.maxUsers) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                   <TableCell>
                     <div className="space-y-1">
                       <div className="font-medium flex items-center space-x-1">
                         <HardDrive className="h-4 w-4 text-muted-foreground" />
                         <span>{org.usedTokens.toLocaleString()} / {org.allotedTokens.toLocaleString()}</span>
                       </div>
                       <div className="text-sm text-muted-foreground">
                         {((org.usedTokens / org.allotedTokens) * 100).toFixed(1)}% used
                       </div>
                     </div>
                   </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium flex items-center space-x-1">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        <span>{org.storageUsed} GB</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {((org.storageUsed / 500) * 100).toFixed(1)}% of limit
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem 
                          onClick={() => handleViewDetail(org.id)}
                          className="cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Detail
                        </DropdownMenuItem>
                        {org.status !== 'Suspended' && (
                          <DropdownMenuItem 
                            onClick={() => handleSuspendService(org.id)}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Suspend Service
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </ScrollArea>
          
          {filteredOrgs.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No organizations found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search criteria" : "No organizations have been created yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}