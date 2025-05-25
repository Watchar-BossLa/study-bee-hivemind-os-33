
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, Clock, Search, Filter, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ActiveInterventionsProps {
  interventions: any[];
}

const ActiveInterventions: React.FC<ActiveInterventionsProps> = ({ interventions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredInterventions = interventions.filter(intervention => {
    const matchesSearch = intervention.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intervention.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || intervention.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || intervention.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'active': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleApprove = (interventionId: string) => {
    console.log('Approving intervention:', interventionId);
    // In real implementation, would call API to approve intervention
  };

  const handleReject = (interventionId: string) => {
    console.log('Rejecting intervention:', interventionId);
    // In real implementation, would call API to reject intervention
  };

  const handleModify = (interventionId: string) => {
    console.log('Modifying intervention:', interventionId);
    // In real implementation, would open modal for modification
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Interventions List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Interventions ({filteredInterventions.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredInterventions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No interventions found matching your criteria.
            </div>
          ) : (
            filteredInterventions.map((intervention) => (
              <div key={intervention.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(intervention.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{intervention.studentName}</h4>
                        <Badge variant={getPriorityColor(intervention.priority) as any}>
                          {intervention.priority}
                        </Badge>
                        <Badge variant="outline">
                          {intervention.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {intervention.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Created: {intervention.createdAt.toLocaleDateString()}</span>
                        <span>Impact: {Math.round(intervention.estimatedImpact * 100)}%</span>
                        <span>Status: {intervention.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {intervention.status === 'pending' && (
                        <>
                          <DropdownMenuItem onClick={() => handleApprove(intervention.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReject(intervention.id)}>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => handleModify(intervention.id)}>
                        Modify
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {intervention.status === 'pending' && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      size="sm" 
                      onClick={() => handleApprove(intervention.id)}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleModify(intervention.id)}
                      className="flex-1"
                    >
                      Modify
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveInterventions;
