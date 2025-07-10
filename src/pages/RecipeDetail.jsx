import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Users, Star, Heart, CheckCircle, AlertCircle, Trash2 } from 'lucide-react'
import useMealStore from '../store/mealStore'
import recipesData from '../data/recipes.json'

const RecipeDetail = () => {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { favorites, addToFavorites, removeFromFavorites, availableIngredients, getMatchScore, userRecipes, deleteUserRecipe } = useMealStore()
  const navigate = useNavigate()

  useEffect(() => {
    const staticRecipe = recipesData.find(r => r.id === parseInt(id))
    const userRecipe = userRecipes.find(r => r.id === parseInt(id))
    setRecipe(staticRecipe || userRecipe)
    setLoading(false)
  }, [id, userRecipes])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h2>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    )
  }

  const isFavorite = favorites.some(fav => fav.id === recipe.id)
  const matchScore = getMatchScore(recipe)
  // Normalize all ingredients to objects
  const normalizedIngredients = (recipe.ingredients || []).map(i => {
    // All recipes now use the object format
    return {
      amount: i.amount || '',
      type: i.type || 'quantity',
      name: i.name || ''
    }
  })
  const filteredIngredients = normalizedIngredients.filter(i => i && i.name)
  const filteredInstructions = recipe.instructions.filter(i => i && i.trim())

  // Normalize available ingredients
  const normalizedAvailable = availableIngredients.map(i => i.trim().toLowerCase())

  // Calculate missing ingredients (only this version)
  const missingIngredients = filteredIngredients.filter(recipeIng => {
    const recipeName = (recipeIng.name || '').trim().toLowerCase()
    const recipeQty = (recipeIng.quantity || '').trim().toLowerCase()
    if (recipeName.includes('sauce')) {
      return !normalizedAvailable.includes(recipeName)
    } else {
      return !normalizedAvailable.includes(`${recipeQty} ${recipeName}`.trim())
    }
  })

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavorites(recipe.id)
    } else {
      addToFavorites(recipe)
    }
  }

  const handleDelete = () => {
    if (recipe.isUser) {
      deleteUserRecipe(recipe.id)
      navigate('/')
    }
  }

  const placeholderImg = (
    <div className="w-full h-64 lg:h-96 flex items-center justify-center bg-gray-100 rounded-lg">
      <svg width="96" height="96" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#e5e7eb" />
        <path d="M7 17c0-2.21 2.686-4 6-4s6 1.79 6 4" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="10" r="3" fill="#9ca3af" />
      </svg>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link 
        to="/" 
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to recipes</span>
      </Link>

      {/* Recipe header */}
      <div className="card">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {recipe.image ? (
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-64 lg:h-96 object-cover rounded-lg"
              />
            ) : (
              placeholderImg
            )}
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {recipe.name}
                </h1>
                <p className="text-gray-600 text-lg">
                  {recipe.description}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={handleFavoriteToggle}
                  className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                >
                  <Heart 
                    className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                  />
                </button>
                {recipe.isUser && (
                  <div className="flex gap-2">
                    <Link
                      to={`/edit/${recipe.id}`}
                      className="btn-secondary text-xs"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="btn-secondary text-xs text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recipe stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Clock className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <div className="text-sm text-gray-500">Prep Time</div>
                <div className="font-semibold">{recipe.prepTime}</div>
              </div>
              <div className="text-center">
                <Clock className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <div className="text-sm text-gray-500">Cook Time</div>
                <div className="font-semibold">{recipe.cookTime}</div>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <div className="text-sm text-gray-500">Servings</div>
                <div className="font-semibold">{recipe.servings}</div>
              </div>
            </div>

            {/* Match score */}
            {availableIngredients.length > 0 && (
              <div className="bg-primary-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-primary-900">Ingredient Match</span>
                  <span className="text-2xl font-bold text-primary-600">{matchScore.toFixed(2)}%</span>
                </div>
                <div className="text-sm text-primary-700">
                  You have {recipe.ingredients.length - missingIngredients.length} of {recipe.ingredients.length} ingredients
                </div>
              </div>
            )}

            {/* Dietary tags */}
            <div className="flex flex-wrap gap-2">
              {recipe.dietary.map((diet, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {diet}
                </span>
              ))}
            </div>

            {/* Recipe info */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{recipe.cuisine} cuisine</span>
              <span>•</span>
              <span>{recipe.category}</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{recipe.difficulty}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients and Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ingredients */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
          <div className="space-y-3">
            {filteredIngredients.map((ingredient, index) => {
              const hasIngredient = availableIngredients.some(available =>
                (ingredient.name ? ingredient.name : ingredient).toLowerCase().includes(available.toLowerCase()) ||
                available.toLowerCase().includes((ingredient.name ? ingredient.name : ingredient).toLowerCase())
              )
              
              return (
                <div key={index} className="flex items-center space-x-3">
                  {hasIngredient ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  )}
                  <span className={`${hasIngredient ? 'text-gray-900' : 'text-gray-600'}`}>
                    {ingredient.amount && ingredient.type !== 'sauce' ? `${ingredient.amount} ${ingredient.type} ` : ''}{ingredient.name}
                  </span>
                </div>
              )
            })}
          </div>
          
          {missingIngredients.length > 0 && (
            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">Missing Ingredients</h3>
              <p className="text-sm text-orange-700">
                You'll need to get: {missingIngredients.map((ing, i) => `${ing.amount ? ing.amount + ' ' : ''}${ing.name}`).join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
          <div className="space-y-4">
            {filteredInstructions.map((instruction, index) => (
              <div key={index} className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </div>
                <p className="text-gray-700 leading-relaxed">{instruction}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nutrition */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nutrition Facts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {recipe.nutrition.calories}
            </div>
            <div className="text-sm text-gray-500">Calories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {recipe.nutrition.protein}
            </div>
            <div className="text-sm text-gray-500">Protein</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {recipe.nutrition.carbs}
            </div>
            <div className="text-sm text-gray-500">Carbs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {recipe.nutrition.fat}
            </div>
            <div className="text-sm text-gray-500">Fat</div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Recipe</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{recipe.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-primary flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecipeDetail 