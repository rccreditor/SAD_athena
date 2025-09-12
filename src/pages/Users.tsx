import { useEffect, useState } from "react";
import { api, User, Organization } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users as UsersIcon,
  Search,
  MoreHorizontal,
  GraduationCap,
  User as UserIcon,
  Shield,
  Ban,
  RotateCcw,
  CheckCircle,
  Settings
} from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [organizationFilter, setOrganizationFilter] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, orgsData] = await Promise.all([
          api.getUsers(organizationFilter === "all" ? undefined : organizationFilter),
          api.getOrganizations()
        ]);
        setUsers(usersData);
        setFilteredUsers(usersData);
        setOrganizations(orgsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [organizationFilter]);

  useEffect(() => {
    let filtered = users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.organizationName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
    
    setFilteredUsers(filtered);
  }, [searchQuery, roleFilter, users]);

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-accent/10 text-accent hover:bg-accent/20">Active</Badge>;
      case 'Suspended':
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">Suspended</Badge>;
      case 'Inactive':
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'Admin':
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20" variant="outline">
          <Shield className="h-3 w-3 mr-1" />
          Admin
        </Badge>;
      case 'Instructor':
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/20" variant="outline">
          <GraduationCap className="h-3 w-3 mr-1" />
          Instructor
        </Badge>;
      case 'Learner':
        return <Badge variant="outline">
          <UserIcon className="h-3 w-3 mr-1" />
          Learner
        </Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    try {
      await api.updateUserRole(userId, newRole);
      // Update local state
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error("Failed to update user role");
      console.error("Failed to update user role:", error);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: User['status']) => {
    try {
      await api.updateUserStatus(userId, newStatus);
      // Update local state
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      );
      setUsers(updatedUsers);
      toast.success(`User ${newStatus.toLowerCase()}`);
    } catch (error) {
      toast.error("Failed to update user status");
      console.error("Failed to update user status:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
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
            <UsersIcon className="h-8 w-8 text-primary" />
            <span>Global User Management</span>
          </h1>
          <p className="text-muted-foreground">
            Search and manage all users across all organizations
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admins</SelectItem>
                <SelectItem value="Instructor">Instructors</SelectItem>
                <SelectItem value="Learner">Learners</SelectItem>
              </SelectContent>
            </Select>
            
            
            <Badge variant="outline" className="text-muted-foreground">
              {filteredUsers.length} users
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-gradient-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">All Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px] w-full">
            <Table>
            <TableHeader>
              <TableRow className="border-b border-border/50">
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="font-semibold">Organization</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-medium text-foreground">{user.organizationName}</div>
                  </TableCell>
                  
                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="cursor-pointer">
                            <Settings className="h-4 w-4 mr-2" />
                            Change Role
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handleRoleChange(user.id, 'Admin')}
                              disabled={user.role === 'Admin'}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handleRoleChange(user.id, 'Instructor')}
                              disabled={user.role === 'Instructor'}
                            >
                              <GraduationCap className="h-4 w-4 mr-2" />
                              Instructor
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handleRoleChange(user.id, 'Learner')}
                              disabled={user.role === 'Learner'}
                            >
                              <UserIcon className="h-4 w-4 mr-2" />
                              Learner
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        
                        <DropdownMenuSeparator />
                        
                        {user.status !== 'Active' && (
                          <DropdownMenuItem 
                            className="cursor-pointer text-accent"
                            onClick={() => handleStatusChange(user.id, 'Active')}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Activate User
                          </DropdownMenuItem>
                        )}
                        
                        {user.status === 'Active' && (
                          <DropdownMenuItem 
                            className="cursor-pointer text-destructive"
                            onClick={() => handleStatusChange(user.id, 'Suspended')}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem className="cursor-pointer">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset Password
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </ScrollArea>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
              <p className="text-muted-foreground">
              {searchQuery || roleFilter !== "all" || organizationFilter !== "all"
                ? "Try adjusting your search criteria or filters" 
                : "No users have been created yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}