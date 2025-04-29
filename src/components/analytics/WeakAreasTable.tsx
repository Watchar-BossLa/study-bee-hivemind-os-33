
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WeakAreaRecommendation } from '@/types/analytics';

interface WeakAreasTableProps {
  data: WeakAreaRecommendation[];
}

const WeakAreasTable: React.FC<WeakAreasTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Areas for Improvement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No areas for improvement identified yet. Complete more assessments to get insights.</p>
        </CardContent>
      </Card>
    );
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return (
      <Badge className={colors[priority as keyof typeof colors]}>
        {priority}
      </Badge>
    );
  };

  const getResourceTypeBadge = (type: string) => {
    const colors = {
      video: 'bg-blue-100 text-blue-800',
      article: 'bg-purple-100 text-purple-800',
      quiz: 'bg-amber-100 text-amber-800',
      flashcards: 'bg-green-100 text-green-800'
    };
    return (
      <Badge className={colors[type as keyof typeof colors]}>
        {type}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Areas for Improvement</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Topic</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Recommended Resources</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.topic}>
                <TableCell className="font-medium">{item.topic}</TableCell>
                <TableCell>{item.subject_id}</TableCell>
                <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {item.recommended_resources.map((resource, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {getResourceTypeBadge(resource.type)}
                        <span className="text-sm">{resource.title}</span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Button size="sm">Study Now</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WeakAreasTable;
