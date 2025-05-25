
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RiskAssessmentProps {
  riskData: any;
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({ riskData }) => {
  if (!riskData) return null;

  const { highRisk, mediumRisk, lowRisk, trends } = riskData;
  const totalStudents = highRisk + mediumRisk + lowRisk;

  const riskLevels = [
    {
      level: 'High Risk',
      count: highRisk,
      percentage: Math.round((highRisk / totalStudents) * 100),
      color: 'bg-red-500',
      textColor: 'text-red-600',
      icon: AlertTriangle
    },
    {
      level: 'Medium Risk',
      count: mediumRisk,
      percentage: Math.round((mediumRisk / totalStudents) * 100),
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      icon: AlertTriangle
    },
    {
      level: 'Low Risk',
      count: lowRisk,
      percentage: Math.round((lowRisk / totalStudents) * 100),
      color: 'bg-green-500',
      textColor: 'text-green-600',
      icon: AlertTriangle
    }
  ];

  const trendData = [
    {
      status: 'Improving',
      count: trends.improving,
      percentage: Math.round((trends.improving / totalStudents) * 100),
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      status: 'Stable',
      count: trends.stable,
      percentage: Math.round((trends.stable / totalStudents) * 100),
      icon: Minus,
      color: 'text-gray-500'
    },
    {
      status: 'Declining',
      count: trends.declining,
      percentage: Math.round((trends.declining / totalStudents) * 100),
      icon: TrendingDown,
      color: 'text-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Risk Level Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Level Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {riskLevels.map((risk) => {
            const Icon = risk.icon;
            return (
              <div key={risk.level} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${risk.textColor}`} />
                    <span className="font-medium">{risk.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{risk.count}</span>
                    <Badge variant="outline">{risk.percentage}%</Badge>
                  </div>
                </div>
                <Progress 
                  value={risk.percentage} 
                  className="h-2"
                />
              </div>
            );
          })}
          
          <div className="pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold">{totalStudents}</p>
              <p className="text-sm text-muted-foreground">Total Students Assessed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Trends</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {trendData.map((trend) => {
            const Icon = trend.icon;
            return (
              <div key={trend.status} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${trend.color}`} />
                  <div>
                    <p className="font-medium">{trend.status}</p>
                    <p className="text-sm text-muted-foreground">
                      {trend.count} students ({trend.percentage}%)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{trend.count}</p>
                </div>
              </div>
            );
          })}
          
          <div className="pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-green-600">{trends.improving}</p>
                <p className="text-xs text-muted-foreground">Improving</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-600">{trends.stable}</p>
                <p className="text-xs text-muted-foreground">Stable</p>
              </div>
              <div>
                <p className="text-lg font-bold text-red-600">{trends.declining}</p>
                <p className="text-xs text-muted-foreground">At Risk</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors Analysis */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Common Risk Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600 mb-2">67%</div>
              <div className="text-sm text-muted-foreground">Declining Accuracy</div>
              <div className="text-xs text-gray-500 mt-1">Most common factor</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-2">45%</div>
              <div className="text-sm text-muted-foreground">Irregular Study</div>
              <div className="text-xs text-gray-500 mt-1">Pattern inconsistency</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-2">32%</div>
              <div className="text-sm text-muted-foreground">Low Engagement</div>
              <div className="text-xs text-gray-500 mt-1">Session participation</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">28%</div>
              <div className="text-sm text-muted-foreground">Slow Progress</div>
              <div className="text-xs text-gray-500 mt-1">Learning velocity</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessment;
