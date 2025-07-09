import React, { useState } from 'react';
import { User, Save } from 'lucide-react';
import { UserProfile } from '../types/health';

interface ProfileSetupProps {
  existingProfile?: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ existingProfile, onProfileUpdate }) => {
  const [formData, setFormData] = useState<UserProfile>({
    name: existingProfile?.name || '',
    age: existingProfile?.age || 25,
    height: existingProfile?.height || 170,
    gender: existingProfile?.gender || 'other',
    activityLevel: existingProfile?.activityLevel || 'moderately_active',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserProfile, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserProfile, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Age must be between 1 and 120';
    }

    if (formData.height < 100 || formData.height > 250) {
      newErrors.height = 'Height must be between 100 and 250 cm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onProfileUpdate(formData);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-primary-500 p-3 rounded-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {existingProfile ? 'Update Profile' : 'Welcome to HealthTracker'}
            </h2>
            <p className="text-gray-600">
              {existingProfile 
                ? 'Update your information to keep your health tracking accurate'
                : 'Let\'s set up your profile to personalize your health journey'
              }
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`input-field w-full ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Age and Height */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age *
              </label>
              <input
                type="number"
                id="age"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                className={`input-field w-full ${errors.age ? 'border-red-500' : ''}`}
                placeholder="25"
                min="1"
                max="120"
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                Height (cm) *
              </label>
              <input
                type="number"
                id="height"
                value={formData.height}
                onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
                className={`input-field w-full ${errors.height ? 'border-red-500' : ''}`}
                placeholder="170"
                min="100"
                max="250"
              />
              {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={value}
                    checked={formData.gender === value}
                    onChange={(e) => handleInputChange('gender', e.target.value as UserProfile['gender'])}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-2">
              Activity Level
            </label>
            <select
              id="activityLevel"
              value={formData.activityLevel}
              onChange={(e) => handleInputChange('activityLevel', e.target.value as UserProfile['activityLevel'])}
              className="input-field w-full"
            >
              <option value="sedentary">Sedentary (Little to no exercise)</option>
              <option value="lightly_active">Lightly Active (Light exercise 1-3 days/week)</option>
              <option value="moderately_active">Moderately Active (Moderate exercise 3-5 days/week)</option>
              <option value="very_active">Very Active (Heavy exercise 6-7 days/week)</option>
            </select>
          </div>

          {/* BMI Information */}
          {formData.height > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Health Information</h3>
              <p className="text-sm text-blue-700">
                Based on your height ({formData.height} cm), a healthy weight range is typically between{' '}
                <strong>{Math.round((18.5 * Math.pow(formData.height / 100, 2)) * 10) / 10} kg</strong> and{' '}
                <strong>{Math.round((24.9 * Math.pow(formData.height / 100, 2)) * 10) / 10} kg</strong>.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{existingProfile ? 'Update Profile' : 'Create Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;