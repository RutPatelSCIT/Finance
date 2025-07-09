import { HealthMetric, Goal, UserProfile } from '../types/health';

const STORAGE_KEYS = {
  HEALTH_METRICS: 'healthMetrics',
  GOALS: 'goals',
  USER_PROFILE: 'userProfile',
};

export const storageUtils = {
  // Health Metrics
  getHealthMetrics(): HealthMetric[] {
    const data = localStorage.getItem(STORAGE_KEYS.HEALTH_METRICS);
    return data ? JSON.parse(data) : [];
  },

  saveHealthMetrics(metrics: HealthMetric[]): void {
    localStorage.setItem(STORAGE_KEYS.HEALTH_METRICS, JSON.stringify(metrics));
  },

  addHealthMetric(metric: HealthMetric): void {
    const metrics = this.getHealthMetrics();
    metrics.push(metric);
    this.saveHealthMetrics(metrics);
  },

  // Goals
  getGoals(): Goal[] {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    return data ? JSON.parse(data) : [];
  },

  saveGoals(goals: Goal[]): void {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },

  addGoal(goal: Goal): void {
    const goals = this.getGoals();
    goals.push(goal);
    this.saveGoals(goals);
  },

  // User Profile
  getUserProfile(): UserProfile | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  },

  saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },
};