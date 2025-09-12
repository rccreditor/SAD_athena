import { useState } from "react";
import { ArrowLeft, Clock, User, Building2, MessageCircle, Filter, Search, MoreVertical, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data
const mockTickets = [
  {
    id: "TKT-001",
    title: "Unable to access course materials",
    description: "Students are reporting that they cannot access video lectures in the Advanced Mathematics course. The error appears when clicking on any video content.",
    status: "open",
    priority: "high",
    organization: "Creditor Academy",
    organizationId: "1",
    createdBy: "Dr. Sarah Wilson",
    createdAt: "2024-01-15T09:30:00Z",
    updatedAt: "2024-01-15T09:30:00Z",
    category: "Technical Issue",
    replies: []
  },
  {
    id: "TKT-002",
    title: "Billing discrepancy in December invoice",
    description: "Our December invoice shows charges for 150 active users, but our records indicate we only had 120 active users during that period.",
    status: "in-progress",
    priority: "medium",
    organization: "Organization : 2",
    organizationId: "2",
    createdBy: "Mike Johnson",
    assignedTo: "billing-team",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-15T08:45:00Z",
    category: "Billing",
    replies: []
  },
  {
    id: "TKT-003",
    title: "Request for custom branding options",
    description: "We would like to customize the LMS interface with our university colors and logo. Is this feature available in our current plan?",
    status: "pending",
    priority: "low",
    organization: "Organization : 3",
    organizationId: "3",
    createdBy: "Emma Thompson",
    createdAt: "2024-01-13T11:15:00Z",
    updatedAt: "2024-01-14T16:20:00Z",
    category: "Feature Request",
    replies: []
  },
  {
    id: "TKT-004",
    title: "Bulk user import failing",
    description: "When trying to import 500+ users via CSV, the process fails after processing about 100 users. We need this resolved urgently for the new semester.",
    status: "resolved",
    priority: "high",
    organization: "Organization : 4",
    organizationId: "4",
    createdBy: "Robert Chen",
    assignedTo: "tech-team",
    createdAt: "2024-01-12T16:45:00Z",
    updatedAt: "2024-01-13T14:30:00Z",
    category: "Technical Issue",
    replies: []
  },
  {
    id: "TKT-005",
    title: "Performance issues during peak hours",
    description: "Students are experiencing slow loading times and timeouts when accessing the platform between 2-4 PM. This is affecting our afternoon classes significantly.",
    status: "open",
    priority: "medium",
    organization: "Organization : 5",
    organizationId: "5",
    createdBy: "Lisa Rodriguez",
    createdAt: "2024-01-16T08:30:00Z",
    updatedAt: "2024-01-16T08:30:00Z",
    category: "Performance",
    replies: []
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case "open": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "in-progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "resolved": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "closed": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "low": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function Support() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [organizationFilter, setOrganizationFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newReply, setNewReply] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesOrganization = organizationFilter === "all" || ticket.organization === organizationFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesOrganization;
  });

  // Get unique organizations for filter dropdown
  const uniqueOrganizations = [...new Set(mockTickets.map(ticket => ticket.organization))].sort();

  const handleStatusChange = (ticketId, newStatus) => {
    // In a real app, this would update the backend
    console.log(`Updating ticket ${ticketId} status to ${newStatus}`);
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  const handleSendReply = () => {
    if (!newReply.trim() || !selectedTicket) return;
    
    // In a real app, this would send to backend
    const reply = {
      id: `r${Date.now()}`,
      content: newReply,
      author: "Super Admin",
      authorType: "admin",
      createdAt: new Date().toISOString()
    };
    
    setSelectedTicket({
      ...selectedTicket,
      replies: [...selectedTicket.replies, reply]
    });
    setNewReply("");
    setShowReplyForm(false);
  };


  if (selectedTicket) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => {
                setSelectedTicket(null);
                setShowReplyForm(false);
              }}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Tickets</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{selectedTicket.id}</h1>
              <p className="text-muted-foreground">Created {formatDate(selectedTicket.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={() => setShowReplyForm(!showReplyForm)}
              variant={showReplyForm ? "secondary" : "default"}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {showReplyForm ? "Cancel Reply" : "Reply"}
            </Button>
            <Select 
              value={selectedTicket.status} 
              onValueChange={(value) => handleStatusChange(selectedTicket.id, value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleStatusChange(selectedTicket.id, "open")}>
                  Set to Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(selectedTicket.id, "in-progress")}>
                  Set to In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(selectedTicket.id, "pending")}>
                  Set to Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(selectedTicket.id, "resolved")}>
                  Set to Resolved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(selectedTicket.id, "closed")}>
                  Set to Closed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedTicket.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getStatusColor(selectedTicket.status)}>
                        {selectedTicket.status.replace('-', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(selectedTicket.priority)}>
                        {selectedTicket.priority} priority
                      </Badge>
                      <Badge variant="outline">{selectedTicket.category}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedTicket.description}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organization Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedTicket.organization}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedTicket.createdBy}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Last updated {formatDate(selectedTicket.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Select 
                  value={selectedTicket.status} 
                  onValueChange={(value) => handleStatusChange(selectedTicket.id, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Change Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Reply Form - Only shown when Reply button is clicked */}
            {showReplyForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Send className="h-5 w-5" />
                    <span>Reply to Ticket</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Type your reply as Super Admin..."
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      className="min-h-[120px]"
                    />
                    <div className="flex items-center justify-between">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="h-4 w-4 mr-2" />
                        Attach File
                      </Button>
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => setShowReplyForm(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSendReply} disabled={!newReply.trim()}>
                          <Send className="h-4 w-4 mr-2" />
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">Manage customer support requests and inquiries</p>
        </div>
        <Button>
          Create Ticket
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets, organizations, or users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {uniqueOrganizations.map((org) => (
                  <SelectItem key={org} value={org}>{org}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-4 pr-4">
          {filteredTickets.map((ticket) => (
            <Card 
              key={ticket.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedTicket(ticket)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-mono text-sm text-muted-foreground">{ticket.id}</span>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace('-', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{ticket.title}</h3>
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {ticket.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Building2 className="h-4 w-4" />
                        <span>{ticket.organization}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{ticket.createdBy}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(ticket.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{ticket.replies.length} replies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {filteredTickets.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || organizationFilter !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "No support tickets have been created yet"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}