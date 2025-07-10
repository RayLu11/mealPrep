# MealPrep Genie 🍳✨

An AI-powered meal prep planner that suggests recipes based on your available ingredients. Built with React, Tailwind CSS, and Zustand for state management.

## 🌟 Features

- **Smart Recipe Matching**: Find recipes based on ingredients you have
- **AI-Powered Suggestions**: Get intelligent recipe recommendations
- **Custom Recipe Management**: Add, edit, and delete your own recipes
- **Ingredient Tracking**: See what you have vs. what you need
- **Mobile-First Design**: Beautiful responsive interface
- **Local Storage**: Your recipes persist across sessions

## 🚀 Live Demo

Visit: [https://yourusername.github.io/mealPrep](https://yourusername.github.io/mealPrep)

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Deployment**: GitHub Pages

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mealPrep.git
cd mealPrep

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🚀 Deployment

### Automatic Deployment (Recommended)

1. **Push to GitHub**: The app automatically deploys when you push to the `main` branch
2. **GitHub Actions**: The workflow builds and deploys to GitHub Pages
3. **Settings**: Go to your repo Settings → Pages → Source: "Deploy from a branch" → Branch: "gh-pages"

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📁 Project Structure

```
mealPrep/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── store/         # Zustand state management
│   ├── data/          # Static recipe data
│   └── utils/         # Utility functions
├── public/            # Static assets
└── .github/workflows/ # GitHub Actions
```

## 🎯 How to Use

1. **Add Ingredients**: Enter what you have in your kitchen
2. **Get Suggestions**: Browse AI-recommended recipes
3. **View Details**: Click on recipes to see full instructions
4. **Add Custom Recipes**: Create your own recipes
5. **Manage Favorites**: Save your favorite recipes

## 🔧 Configuration

### Update Repository Name

If your repository is named differently than `mealPrep`, update these files:

1. **vite.config.js**: Change the base path
2. **package.json**: Update the homepage URL
3. **GitHub Actions**: Update the workflow if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own meal planning needs!

---

**Happy Cooking! 🍽️** 