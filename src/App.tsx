import React, { useState, useEffect } from 'react';
import { Activity, Heart, Target, User, TrendingUp, Plus } from 'lucide-react';
import Dashboard from './components/Dashboard';
import MetricsTracker from './components/MetricsTracker';
import GoalsManager from './components/GoalsManager';
import ProfileSetup from './components/ProfileSetup';
import { storageUtils } from './utils/storage';
import { UserProfile } from './types/health';

type ActiveTab = 'dashboard' | 'metrics' | 'goals' | 'profile';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showMetricModal, setShowMetricModal] = useState(false);

  useEffect(() => {
    const profile = storageUtils.getUserProfile();
    setUserProfile(profile);
    if (!profile) {
      setActiveTab('profile');
    }
  }, []);

  const handleProfileUpdate = (profile: UserProfile) => {
    setUserProfile(profile);
    storageUtils.saveUserProfile(profile);
    setActiveTab('dashboard');
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'metrics', label: 'Metrics', icon: Activity },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HealthTracker</h1>
                <p className="text-sm text-gray-500">Your personal wellness companion</p>
              </div>
            </div>
            {userProfile && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {userProfile.name}</span>
                <button
                  onClick={() => setShowMetricModal(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Metric</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigationItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!userProfile ? (
          <ProfileSetup onProfileUpdate={handleProfileUpdate} />
        ) : (
          <>
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'metrics' && <MetricsTracker />}
            {activeTab === 'goals' && <GoalsManager />}
            {activeTab === 'profile' && (
              <ProfileSetup 
                existingProfile={userProfile} 
                onProfileUpdate={handleProfileUpdate} 
              />
            )}
          </>
        )}
      </main>

      {/* Quick Add Metric Modal */}
      {showMetricModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Quick Add Metric</h3>
              <button
                onClick={() => setShowMetricModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <MetricsTracker 
              isModal={true} 
              onClose={() => setShowMetricModal(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;