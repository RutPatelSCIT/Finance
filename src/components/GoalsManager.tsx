import React, { useState, useEffect } from 'react';
import { Target, Plus, CheckCircle, Circle, Trash2, Edit } from 'lucide-react';
import { storageUtils } from '../utils/storage';
import { Goal, MetricType, HealthMetric } from '../types/health';
import { format, parseISO, differenceInDays } from 'date-fns';

const GoalsManager: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'weight' as MetricType,
    target: '',
    unit: 'kg',
    deadline: '',
  });

  useEffect(() => {
    setGoals(storageUtils.getGoals());
    setMetrics(storageUtils.getHealthMetrics());
  }, []);

  const metricOptions = [
    { value: 'weight', label: 'Weight', unit: 'kg', description: 'Target weight to achieve' },
    { value: 'heartRate', label: 'Resting Heart Rate', unit: 'bpm', description: 'Target resting heart rate' },
    { value: 'steps', label: 'Daily Steps', unit: 'steps', description: 'Daily step goal' },
    { value: 'sleep', label: 'Sleep Duration', unit: 'hours', description: 'Target sleep duration per night' },
    { value: 'waterIntake', label: 'Water Intake', unit: 'L', description: 'Daily water intake goal' },
    { value: 'calories', label: 'Calories Burned', unit: 'kcal', description: 'Daily calorie burn goal' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.target) return;

    const selectedMetric = metricOptions.find(m => m.value === formData.type);
    
    const newGoal: Goal = {
      id: Date.now().toString(),
      type: formData.type,
      target: parseFloat(formData.target),
      unit: selectedMetric?.unit || formData.unit,
      deadline: formData.deadline || undefined,
      isActive: true,
    };

    storageUtils.addGoal(newGoal);
    const updatedGoals = storageUtils.getGoals();
    setGoals(updatedGoals);

    // Reset form
    setFormData({
      type: 'weight',
      target: '',
      unit: 'kg',
      deadline: '',
    });
    setShowAddForm(false);
  };

  const toggleGoalStatus = (goalId: string) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId ? { ...goal, isActive: !goal.isActive } : goal
    );
    storageUtils.saveGoals(updatedGoals);
    setGoals(updatedGoals);
  };

  const deleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    storageUtils.saveGoals(updatedGoals);
    setGoals(updatedGoals);
  };

  const getGoalProgress = (goal: Goal): { progress: number; current: number | null; isCompleted: boolean } => {
    const goalMetrics = metrics
      .filter(m => m.type === goal.type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const current = goalMetrics.length > 0 ? goalMetrics[0].value : null;
    
    if (current === null) {
      return { progress: 0, current: null, isCompleted: false };
    }

    // For most metrics, higher is better (steps, sleep, water)
    // For weight and heart rate, it depends on the goal direction
    let progress = (current / goal.target) * 100;
    
    // Cap at 100% for display purposes
    progress = Math.min(progress, 100);
    
    const isCompleted = progress >= 100;
    
    return { progress, current, isCompleted };
  };

  const getDaysRemaining = (deadline?: string): number | null => {
    if (!deadline) return null;
    return differenceInDays(parseISO(deadline), new Date());
  };

  const activeGoals = goals.filter(g => g.isActive);
  const completedGoals = goals.filter(g => !g.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Goals</h2>
          <p className="text-gray-600">Set and track your health objectives</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Goal</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    const selectedType = e.target.value as MetricType;
                    const selectedMetric = metricOptions.find(m => m.value === selectedType);
                    setFormData(prev => ({ 
                      ...prev, 
                      type: selectedType,
                      unit: selectedMetric?.unit || 'unit'
                    }));
                  }}
                  className="input-field w-full"
                >
                  {metricOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {formData.type && (
                  <p className="text-sm text-gray-500 mt-1">
                    {metricOptions.find(m => m.value === formData.type)?.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Value
                </label>
                <div className="flex">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.target}
                    onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                    className="input-field flex-1"
                    placeholder="Enter target value"
                    required
                  />
                  <span className="ml-2 px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-sm text-gray-600">
                    {formData.unit}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline (Optional)
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="input-field"
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Create Goal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-primary-500" />
            Active Goals ({activeGoals.length})
          </h3>
          <div className="space-y-4">
            {activeGoals.map(goal => {
              const { progress, current, isCompleted } = getGoalProgress(goal);
              const daysRemaining = getDaysRemaining(goal.deadline);
              const metricInfo = metricOptions.find(m => m.value === goal.type);

              return (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {metricInfo?.label || goal.type}
                        </h4>
                        {isCompleted && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Completed!
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Target: {goal.target} {goal.unit}
                        {current !== null && (
                          <span className="ml-2">
                            • Current: {current} {goal.unit}
                          </span>
                        )}
                      </p>
                      {goal.deadline && (
                        <p className="text-sm text-gray-500">
                          {daysRemaining !== null && daysRemaining >= 0 
                            ? `${daysRemaining} days remaining`
                            : 'Deadline passed'
                          }
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleGoalStatus(goal.id)}
                        className="text-gray-400 hover:text-green-600 transition-colors"
                        title="Mark as completed"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete goal"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isCompleted ? 'bg-green-500' : 'bg-primary-500'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            Completed Goals ({completedGoals.length})
          </h3>
          <div className="space-y-3">
            {completedGoals.map(goal => {
              const metricInfo = metricOptions.find(m => m.value === goal.type);
              
              return (
                <div key={goal.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {metricInfo?.label || goal.type}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Target: {goal.target} {goal.unit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleGoalStatus(goal.id)}
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                      title="Reactivate goal"
                    >
                      <Circle className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete goal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals set</h3>
          <p className="text-gray-600 mb-4">
            Set your first health goal to start tracking your progress and stay motivated.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Create Your First Goal
          </button>
        </div>
      )}
    </div>
  );
};

export default GoalsManager;