# HealthTracker - Personal Health Dashboard

A comprehensive health tracking application built with React, TypeScript, and Tailwind CSS. Track your health metrics, set goals, and monitor your wellness journey with beautiful visualizations and an intuitive interface.

## Features

### 🏠 Dashboard
- Overview of all health metrics with trend indicators
- Interactive charts showing progress over time
- Goal progress tracking with visual indicators
- Clean, modern interface with real-time updates

### 📊 Health Metrics Tracking
- **Weight Management**: Track weight changes over time
- **Heart Rate**: Monitor resting heart rate and trends
- **Blood Pressure**: Record systolic and diastolic readings
- **Activity**: Daily steps and calorie tracking
- **Sleep**: Sleep duration and quality monitoring
- **Hydration**: Daily water intake tracking
- **Custom Metrics**: Flexible system for additional health data

### 🎯 Goal Setting & Management
- Set personalized health goals for any metric
- Track progress with visual progress bars
- Deadline management with countdown timers
- Mark goals as completed or reactivate them
- Achievement celebration and motivation

### 👤 User Profile
- Comprehensive profile setup with health calculations
- BMI recommendations based on height and weight
- Activity level assessment
- Personalized health insights

### 📱 User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Data Persistence**: All data stored locally in browser storage
- **Quick Add**: Fast metric entry from anywhere in the app
- **Interactive Charts**: Beautiful visualizations using Chart.js

## Technologies Used

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **Charts**: Chart.js with React-ChartJS-2 for data visualization
- **Icons**: Lucide React for beautiful, consistent icons
- **Date Handling**: date-fns for robust date manipulation
- **Build Tool**: Vite for fast development and optimized builds
- **Type Safety**: Full TypeScript support throughout

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository** (if applicable) or ensure you're in the project directory

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Usage Guide

### First Time Setup

1. **Create Your Profile**: When you first open the app, you'll be prompted to set up your profile with basic information like name, age, height, gender, and activity level.

2. **Add Your First Metric**: Click the "Add Metric" button to record your first health measurement.

3. **Set Goals**: Navigate to the Goals section to set your first health objective.

### Daily Usage

- **Quick Add**: Use the "Add Metric" button in the header for fast data entry
- **Dashboard Overview**: Check your dashboard daily to see trends and progress
- **Goal Tracking**: Monitor your goal progress and celebrate achievements
- **Data Review**: Use the Metrics section to review historical data and patterns

### Data Management

- **Local Storage**: All data is stored locally in your browser
- **Export/Backup**: Currently, data is browser-specific (future versions may include export functionality)
- **Privacy**: No data is sent to external servers - everything stays on your device

## App Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard with overview
│   ├── MetricsTracker.tsx # Health metrics management
│   ├── GoalsManager.tsx  # Goal setting and tracking
│   └── ProfileSetup.tsx  # User profile management
├── types/              # TypeScript type definitions
│   └── health.ts       # Health-related interfaces
├── utils/              # Utility functions
│   └── storage.ts      # Local storage management
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## Health Metrics Supported

| Metric | Unit | Description |
|--------|------|-------------|
| Weight | kg | Body weight tracking |
| Heart Rate | bpm | Resting heart rate |
| Blood Pressure | mmHg | Systolic/diastolic readings |
| Steps | count | Daily step count |
| Sleep | hours | Sleep duration |
| Water Intake | liters | Daily hydration |
| Calories | kcal | Calories burned |

## Data Privacy & Security

- **Local Storage Only**: All health data is stored locally in your browser
- **No External Servers**: No data transmission to third parties
- **Browser-Specific**: Data is tied to your specific browser and device
- **No Account Required**: No sign-up or personal information sharing needed

## Browser Compatibility

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile Browsers**: Responsive design works on all modern mobile browsers

## Contributing

This is a personal health tracking application. If you'd like to extend it:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Charts not displaying**: Ensure all dependencies are installed with `npm install`
2. **Data not persisting**: Check that your browser allows local storage
3. **Responsive issues**: Clear browser cache and refresh

### Browser Storage Limits

- Modern browsers typically allow 5-10MB of local storage
- This app uses minimal storage and should work within these limits
- Consider clearing old data if storage becomes an issue

## Future Enhancements

Potential features for future versions:
- Data export/import functionality
- Cloud synchronization
- Additional health metrics
- Meal tracking and nutrition
- Exercise routines and workout logging
- Health insights and recommendations
- Integration with fitness devices
- Multi-user support
- Advanced analytics and reporting

## License

This project is open source. Feel free to modify and distribute according to your needs.

---

**HealthTracker** - Take control of your health journey with beautiful, intuitive tracking tools.