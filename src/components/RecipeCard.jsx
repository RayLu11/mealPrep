import { Clock, Users, Star, Heart, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import useMealStore from '../store/mealStore'

const RecipeCard = ({ recipe, showMatchScore = false }) => {
  const { favorites, addToFavorites, removeFromFavorites, getMatchScore } = useMealStore()
  const isFavorite = favorites.some(fav => fav.id === recipe.id)
  const matchScore = showMatchScore ? getMatchScore(recipe) : null

  const handleFavoriteToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isFavorite) {
      removeFromFavorites(recipe.id)
    } else {
      addToFavorites(recipe)
    }
  }

  const placeholderImg = (
    <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#e5e7eb" />
        <path d="M7 17c0-2.21 2.686-4 6-4s6 1.79 6 4" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="10" r="3" fill="#9ca3af" />
      </svg>
    </div>
  );

  return (
    <Link to={`/recipe/${recipe.id}`} className="block">
      <div className="card hover:shadow-md transition-shadow duration-200 group">
        <div className="relative">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
              loading="lazy"
            />
          ) : (
            placeholderImg
          )}
          {recipe.isUser && (
            <div className="absolute top-2 right-16 bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full text-xs font-semibold shadow">User Recipe</div>
          )}
          
          {showMatchScore && matchScore > 0 && (
            <div className="absolute top-2 left-2 bg-white rounded-full px-3 py-1 shadow-sm">
              <span className="text-sm font-semibold text-primary-600">
                {matchScore}% match
              </span>
            </div>
          )}
          
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <Heart 
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
            />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">
              {recipe.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {recipe.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.prepTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{recipe.servings} servings</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{recipe.difficulty}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {recipe.dietary.slice(0, 3).map((diet, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {diet}
              </span>
            ))}
            {recipe.dietary.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{recipe.dietary.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-gray-500">
              {recipe.cuisine} • {recipe.category}
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RecipeCard 