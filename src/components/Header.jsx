import { Sparkles, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MealPrep Genie</h1>
              <p className="text-xs text-gray-500">AI Meal Planner</p>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/add" 
              className="text-gray-600 hover:text-primary-600 transition-colors flex items-center space-x-1"
            >
              <span className="hidden sm:inline">Add Recipe</span>
            </Link>
            <Link 
              to="/favorites" 
              className="text-gray-600 hover:text-primary-600 transition-colors flex items-center space-x-1"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Favorites</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header 