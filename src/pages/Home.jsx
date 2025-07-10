import { useState, useEffect } from 'react'
import InputForm from '../components/InputForm'
import RecipeList from '../components/RecipeList'
import useMealStore from '../store/mealStore'
import recipesData from '../data/recipes.json'

const Home = () => {
  const { availableIngredients, getMatchingRecipes, getAllRecipes } = useMealStore()
  const [recipes, setRecipes] = useState([])
  const [matchingRecipes, setMatchingRecipes] = useState([])

  useEffect(() => {
    const allRecipes = getAllRecipes(recipesData)
    setRecipes(allRecipes)
  }, [getAllRecipes])

  useEffect(() => {
    if (availableIngredients.length > 0) {
      const matches = getMatchingRecipes(recipes)
      setMatchingRecipes(matches)
    } else {
      setMatchingRecipes(recipes)
    }
  }, [availableIngredients, recipes, getMatchingRecipes])

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          What's in your kitchen?
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tell us what ingredients you have, and our AI will suggest delicious recipes 
          you can make right now. No more wasted groceries!
        </p>
      </div>

      <InputForm />

      {availableIngredients.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Recipes for your ingredients
            </h2>
            <p className="text-gray-600">
              Based on {availableIngredients.length} ingredient{availableIngredients.length !== 1 ? 's' : ''} you have
            </p>
          </div>
          
          <RecipeList 
            recipes={matchingRecipes} 
            showMatchScore={true}
            title="Suggested Recipes"
          />
        </div>
      )}

      {availableIngredients.length === 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Browse all recipes
            </h2>
            <p className="text-gray-600">
              Explore our collection of delicious recipes
            </p>
          </div>
          
          <RecipeList 
            recipes={recipes} 
            showMatchScore={false}
            title="All Recipes"
          />
        </div>
      )}
    </div>
  )
}

export default Home 