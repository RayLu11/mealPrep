# MealPrep Genie 🧾

An AI-powered meal prep planner that helps you create delicious recipes based on the ingredients you already have in your kitchen. No more wasted groceries!

## ✨ Features

- **Smart Ingredient Matching**: Input your available ingredients and get recipe suggestions
- **AI-Powered Recommendations**: Enhanced matching algorithm with scoring system
- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **Recipe Management**: Save favorites, view detailed recipes with nutrition info
- **Advanced Filtering**: Filter by dietary preferences, cuisine, difficulty, and category
- **Ingredient Tracking**: See which ingredients you have vs. what you need
- **Persistent Storage**: Your ingredients and favorites are saved locally

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mealPrep
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📱 Mobile-First Design

The app is designed with mobile users in mind:
- Responsive grid layouts
- Touch-friendly buttons and inputs
- Optimized navigation
- Fast loading times

## 🧠 AI Integration

The app includes a framework for AI-powered recipe suggestions:

### Current Implementation
- Enhanced local recipe matching with scoring
- Ingredient similarity detection
- Match percentage calculations

### Future AI Enhancements
The code includes commented examples for:
- OpenAI GPT-3.5 Turbo integration
- HuggingFace model integration
- Custom AI recipe generation

To enable actual AI features, uncomment and configure the API calls in `src/utils/aiSuggest.js`.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   ├── InputForm.jsx   # Ingredient input form
│   ├── RecipeCard.jsx  # Recipe display card
│   └── RecipeList.jsx  # Recipe grid with filters
├── pages/              # Page components
│   ├── Home.jsx        # Main landing page
│   └── RecipeDetail.jsx # Detailed recipe view
├── store/              # State management
│   └── mealStore.js    # Zustand store
├── data/               # Static data
│   └── recipes.json    # Recipe database
├── utils/              # Utility functions
│   └── aiSuggest.js    # AI suggestion logic
└── App.jsx             # Main app component
```

## 🎯 Key Features Explained

### Ingredient Input System
- Tag-based ingredient entry
- Real-time ingredient matching
- Easy ingredient removal
- Clear all functionality

### Recipe Matching Engine
- Fuzzy ingredient matching
- Match percentage scoring
- Missing ingredient detection
- Filtered recommendations

### Recipe Display
- Beautiful recipe cards with images
- Detailed recipe pages
- Nutrition information
- Step-by-step instructions
- Ingredient availability indicators

### Filtering System
- Dietary preferences (Vegetarian, Vegan, Gluten-Free, etc.)
- Cuisine types (Asian, Mediterranean, Italian, etc.)
- Difficulty levels (Easy, Medium, Hard)
- Recipe categories (Breakfast, Main Dish, Soup, etc.)

## 🔧 Customization

### Adding New Recipes
Edit `src/data/recipes.json` to add new recipes:

```json
{
  "id": 9,
  "name": "Your Recipe Name",
  "description": "Recipe description",
  "prepTime": "15 minutes",
  "cookTime": "20 minutes",
  "servings": 4,
  "difficulty": "Easy",
  "category": "Main Dish",
  "cuisine": "International",
  "dietary": ["Vegetarian", "High Protein"],
  "ingredients": ["ingredient1", "ingredient2"],
  "instructions": ["Step 1", "Step 2"],
  "nutrition": {
    "calories": 300,
    "protein": "25g",
    "carbs": "30g",
    "fat": "10g"
  },
  "image": "https://your-image-url.com/image.jpg"
}
```

### Styling Customization
- Modify `tailwind.config.js` for theme changes
- Update `src/index.css` for custom styles
- Use the provided CSS classes for consistency

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use the `gh-pages` package
- **Firebase Hosting**: Use Firebase CLI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Recipe data and images from Unsplash
- Icons from Lucide React
- UI inspiration from modern design systems

---

**Happy cooking! 🍳** 