import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Activity, Heart, Droplets, Moon, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { storageUtils } from '../utils/storage';
import { HealthMetric, Goal, MetricType } from '../types/health';
import { format, parseISO, subDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    setMetrics(storageUtils.getHealthMetrics());
    setGoals(storageUtils.getGoals());
  }, []);

  const getLatestMetricValue = (type: MetricType): number | null => {
    const typeMetrics = metrics.filter(m => m.type === type).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return typeMetrics.length > 0 ? typeMetrics[0].value : null;
  };

  const getMetricTrend = (type: MetricType): 'up' | 'down' | 'neutral' => {
    const typeMetrics = metrics.filter(m => m.type === type).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    if (typeMetrics.length < 2) return 'neutral';
    
    const latest = typeMetrics[0].value;
    const previous = typeMetrics[1].value;
    
    if (latest > previous) return 'up';
    if (latest < previous) return 'down';
    return 'neutral';
  };

  const getChartData = (type: MetricType) => {
    const typeMetrics = metrics
      .filter(m => m.type === type)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 entries

    return {
      labels: typeMetrics.map(m => format(parseISO(m.date), 'MMM dd')),
      datasets: [
        {
          label: type.charAt(0).toUpperCase() + type.slice(1),
          data: typeMetrics.map(m => m.value),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const getGoalProgress = (type: MetricType): number => {
    const goal = goals.find(g => g.type === type && g.isActive);
    const latestValue = getLatestMetricValue(type);
    
    if (!goal || latestValue === null) return 0;
    
    return Math.min((latestValue / goal.target) * 100, 100);
  };

  const metricCards = [
    {
      type: 'weight' as MetricType,
      title: 'Weight',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      unit: 'kg'
    },
    {
      type: 'heartRate' as MetricType,
      title: 'Heart Rate',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      unit: 'bpm'
    },
    {
      type: 'waterIntake' as MetricType,
      title: 'Water Intake',
      icon: Droplets,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      unit: 'L'
    },
    {
      type: 'sleep' as MetricType,
      title: 'Sleep',
      icon: Moon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      unit: 'hrs'
    },
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Health Dashboard</h2>
            <p className="text-gray-600">Track your wellness journey and stay motivated</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-lg font-semibold text-gray-900">
              {format(new Date(), 'EEEE, MMM dd')}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map(({ type, title, icon: Icon, color, bgColor, unit }) => {
          const latestValue = getLatestMetricValue(type);
          const trend = getMetricTrend(type);
          const progress = getGoalProgress(type);

          return (
            <div key={type} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${bgColor}`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <div className="flex items-center space-x-1">
                  {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {latestValue !== null ? `${latestValue} ${unit}` : 'No data'}
                </p>
                {progress > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Goal Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Trend</h3>
          <div className="h-64">
            <Line data={getChartData('weight')} options={chartOptions} />
          </div>
        </div>

        {/* Heart Rate Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Heart Rate Trend</h3>
          <div className="h-64">
            <Line data={getChartData('heartRate')} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Goals Overview */}
      {goals.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Active Goals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.filter(g => g.isActive).map(goal => {
              const progress = getGoalProgress(goal.type);
              const isCompleted = progress >= 100;

              return (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 capitalize">{goal.type}</h4>
                    {isCompleted && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Target: {goal.target} {goal.unit}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% complete</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;