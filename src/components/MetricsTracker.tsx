import React, { useState, useEffect } from 'react';
import { Plus, Calendar, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { storageUtils } from '../utils/storage';
import { HealthMetric, MetricType } from '../types/health';
import { format } from 'date-fns';

interface MetricsTrackerProps {
  isModal?: boolean;
  onClose?: () => void;
}

const MetricsTracker: React.FC<MetricsTrackerProps> = ({ isModal = false, onClose }) => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [showAddForm, setShowAddForm] = useState(isModal);
  const [formData, setFormData] = useState({
    type: 'weight' as MetricType,
    value: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    setMetrics(storageUtils.getHealthMetrics());
  }, []);

  const metricOptions = [
    { value: 'weight', label: 'Weight', unit: 'kg' },
    { value: 'heartRate', label: 'Heart Rate', unit: 'bpm' },
    { value: 'bloodPressure', label: 'Blood Pressure', unit: 'mmHg' },
    { value: 'steps', label: 'Steps', unit: 'steps' },
    { value: 'sleep', label: 'Sleep', unit: 'hours' },
    { value: 'waterIntake', label: 'Water Intake', unit: 'L' },
    { value: 'calories', label: 'Calories', unit: 'kcal' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.value || !formData.date) return;

    const selectedMetric = metricOptions.find(m => m.value === formData.type);
    
    const newMetric: HealthMetric = {
      id: Date.now().toString(),
      type: formData.type,
      value: parseFloat(formData.value),
      unit: selectedMetric?.unit || '',
      date: formData.date,
    };

    storageUtils.addHealthMetric(newMetric);
    const updatedMetrics = storageUtils.getHealthMetrics();
    setMetrics(updatedMetrics);

    // Reset form
    setFormData({
      type: 'weight',
      value: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    });

    if (isModal && onClose) {
      onClose();
    } else {
      setShowAddForm(false);
    }
  };

  const handleDelete = (id: string) => {
    const updatedMetrics = metrics.filter(m => m.id !== id);
    storageUtils.saveHealthMetrics(updatedMetrics);
    setMetrics(updatedMetrics);
  };

  const groupedMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.type]) {
      acc[metric.type] = [];
    }
    acc[metric.type].push(metric);
    return acc;
  }, {} as Record<MetricType, HealthMetric[]>);

  if (isModal) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Metric Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as MetricType }))}
            className="input-field w-full"
          >
            {metricOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.unit})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            className="input-field w-full"
            placeholder="Enter value"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="input-field w-full"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Add Metric
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Health Metrics</h2>
          <p className="text-gray-600">Track and monitor your health data</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Metric</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Metric</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metric Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as MetricType }))}
                className="input-field w-full"
              >
                {metricOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                className="input-field w-full"
                placeholder="Enter value"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="input-field w-full"
                required
              />
            </div>

            <div className="flex items-end space-x-2">
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Metrics List */}
      <div className="space-y-6">
        {Object.entries(groupedMetrics).map(([type, typeMetrics]) => {
          const sortedMetrics = typeMetrics.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          const metricInfo = metricOptions.find(m => m.value === type);

          return (
            <div key={type} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary-500" />
                  {metricInfo?.label || type}
                </h3>
                <span className="text-sm text-gray-500">
                  {sortedMetrics.length} entries
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedMetrics.slice(0, 5).map((metric) => (
                      <tr key={metric.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(metric.date), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {metric.value}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {metric.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDelete(metric.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete metric"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {sortedMetrics.length > 5 && (
                <div className="text-center pt-4">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View all {sortedMetrics.length} entries
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {metrics.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No metrics yet</h3>
          <p className="text-gray-600 mb-4">Start tracking your health by adding your first metric.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Add Your First Metric
          </button>
        </div>
      )}
    </div>
  );
};

export default MetricsTracker;