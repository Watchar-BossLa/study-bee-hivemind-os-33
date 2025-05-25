
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface InterventionAnalyticsProps {
  analytics: any;
}

const InterventionAnalytics: React.FC<InterventionAnalyticsProps> = ({ analytics }) => {
  if (!analytics) return null;

  const { interventionTypes, effectivenessOverTime } = analytics;

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  const pieData = interventionTypes.map((type: any, index: number) => ({
    name: type.type.replace('_', ' ').split(' ').map((word: string) => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    value: type.count,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Effectiveness Over Time */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Intervention Effectiveness Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={effectivenessOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value) => [`${value}%`, 'Effectiveness']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="effectiveness" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Effectiveness %"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Intervention Types Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Intervention Types Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Success Rates by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Success Rates by Intervention Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={interventionTypes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="type" 
                tickFormatter={(value) => value.replace('_', ' ').split(' ').map((word: string) => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                labelFormatter={(value) => value.replace('_', ' ').split(' ').map((word: string) => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
                formatter={(value) => [`${value}%`, 'Success Rate']}
              />
              <Legend />
              <Bar 
                dataKey="successRate" 
                fill="#82ca9d" 
                name="Success Rate %"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Metrics Summary */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {interventionTypes.reduce((sum: number, type: any) => sum + type.count, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Interventions</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {Math.round(interventionTypes.reduce((sum: number, type: any) => 
                  sum + (type.successRate * type.count), 0) / 
                  interventionTypes.reduce((sum: number, type: any) => sum + type.count, 0))}%
              </p>
              <p className="text-sm text-muted-foreground">Avg Success Rate</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {interventionTypes.find((type: any) => type.type === 'break_suggestion')?.successRate || 0}%
              </p>
              <p className="text-sm text-muted-foreground">Best Performing</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(effectivenessOverTime.slice(-3).reduce((sum: any, day: any) => 
                  sum + day.effectiveness, 0) / 3)}%
              </p>
              <p className="text-sm text-muted-foreground">3-Day Avg</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterventionAnalytics;
