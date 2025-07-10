import { useState, useEffect } from 'react'
import { Filter, Sparkles } from 'lucide-react'
import RecipeCard from './RecipeCard'
import useMealStore from '../store/mealStore'
import { generateAISuggestions } from '../utils/aiSuggest'

const RecipeList = ({ recipes, showMatchScore = false, title = "Recipes" }) => {
  const [filteredRecipes, setFilteredRecipes] = useState(recipes)
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const { filters, setFilters, clearFilters, availableIngredients } = useMealStore()

  // Get unique filter options from recipes
  const dietaryOptions = [...new Set(recipes.flatMap(r => r.dietary))]
  const cuisineOptions = [...new Set(recipes.map(r => r.cuisine))]
  const difficultyOptions = [...new Set(recipes.map(r => r.difficulty))]
  const categoryOptions = [...new Set(recipes.map(r => r.category))]

  useEffect(() => {
    if (availableIngredients.length > 0 && showMatchScore) {
      setIsLoading(true)
      generateAISuggestions(availableIngredients, recipes)
        .then(suggestions => {
          setFilteredRecipes(suggestions)
          setIsLoading(false)
        })
        .catch(() => {
          setFilteredRecipes(recipes)
          setIsLoading(false)
        })
    } else {
      setFilteredRecipes(recipes)
    }
  }, [recipes, availableIngredients, showMatchScore])

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters }
    if (newFilters[filterType].includes(value)) {
      newFilters[filterType] = newFilters[filterType].filter(item => item !== value)
    } else {
      newFilters[filterType] = [...newFilters[filterType], value]
    }
    setFilters(newFilters)
  }

  const applyFilters = () => {
    let filtered = recipes

    if (filters.dietary.length > 0) {
      filtered = filtered.filter(recipe =>
        filters.dietary.some(diet => recipe.dietary.includes(diet))
      )
    }

    if (filters.cuisine.length > 0) {
      filtered = filtered.filter(recipe =>
        filters.cuisine.includes(recipe.cuisine)
      )
    }

    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(recipe =>
        filters.difficulty.includes(recipe.difficulty)
      )
    }

    if (filters.category.length > 0) {
      filtered = filtered.filter(recipe =>
        filters.category.includes(recipe.category)
      )
    }

    setFilteredRecipes(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [filters])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {isLoading && (
            <div className="text-sm text-gray-500">Finding matches...</div>
          )}
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary flex items-center space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {showFilters && (
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Dietary</h4>
              <div className="space-y-2">
                {dietaryOptions.map(option => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.dietary.includes(option)}
                      onChange={() => handleFilterChange('dietary', option)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Cuisine</h4>
              <div className="space-y-2">
                {cuisineOptions.map(option => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.cuisine.includes(option)}
                      onChange={() => handleFilterChange('cuisine', option)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Difficulty</h4>
              <div className="space-y-2">
                {difficultyOptions.map(option => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.difficulty.includes(option)}
                      onChange={() => handleFilterChange('difficulty', option)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Category</h4>
              <div className="space-y-2">
                {categoryOptions.map(option => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(option)}
                      onChange={() => handleFilterChange('category', option)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 mr-4"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
          <p className="text-gray-500">
            Try adjusting your filters or adding more ingredients.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              showMatchScore={showMatchScore}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default RecipeList 