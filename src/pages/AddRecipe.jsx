import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useMealStore from '../store/mealStore'

const defaultRecipe = {
  name: '',
  description: '',
  prepTime: '',
  cookTime: '',
  servings: 1,
  difficulty: 'Easy',
  category: '',
  cuisine: '',
  dietary: [],
  ingredients: [{ amount: '', type: 'lb', name: '' }],
  instructions: [''],
  nutrition: {
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  },
  image: ''
}

const dietaryOptions = [
  'Vegetarian', 'Vegan', 'Gluten Free', 'High Protein', 'Low Carb', 'High Fiber', 'Low Calorie', 'Omega-3'
]

const AddRecipe = () => {
  const { id } = useParams()
  const userRecipes = useMealStore(s => s.userRecipes)
  const addUserRecipe = useMealStore(s => s.addUserRecipe)
  const updateUserRecipe = useMealStore(s => s.updateUserRecipe)
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(defaultRecipe)
  const [error, setError] = useState('')
  const isEdit = Boolean(id)

  useEffect(() => {
    if (isEdit) {
      const found = userRecipes.find(r => r.id === parseInt(id))
      if (found) setRecipe({ ...defaultRecipe, ...found })
    }
  }, [id, isEdit, userRecipes])

  const handleChange = (e) => {
    const { name, value } = e.target
    setRecipe(r => ({ ...r, [name]: value }))
  }

  const handleNutritionChange = (e) => {
    const { name, value } = e.target
    setRecipe(r => ({ ...r, nutrition: { ...r.nutrition, [name]: value } }))
  }

  const handleArrayChange = (field, idx, value, subfield) => {
    setRecipe(r => ({
      ...r,
      [field]: r[field].map((item, i) =>
        i === idx
          ? (subfield ? { ...item, [subfield]: value } : value)
          : item
      )
    }))
  }

  const handleAddArrayItem = (field) => {
    if (field === 'ingredients') {
      setRecipe(r => ({ ...r, ingredients: [...r.ingredients, { amount: '', type: 'lb', name: '' }] }))
    } else {
      setRecipe(r => ({ ...r, [field]: [...r[field], ''] }))
    }
  }

  const handleRemoveArrayItem = (field, idx) => {
    setRecipe(r => ({ ...r, [field]: r[field].filter((_, i) => i !== idx) }))
  }

  const handleDietaryChange = (option) => {
    setRecipe(r => ({
      ...r,
      dietary: r.dietary.includes(option)
        ? r.dietary.filter(d => d !== option)
        : [...r.dietary, option]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Filter out empty ingredients and instructions
    const filteredIngredients = recipe.ingredients
      .map(i => ({ amount: i.amount.trim(), type: i.type, name: i.name.trim() }))
      .filter(i => i.name)
    const filteredInstructions = recipe.instructions.map(i => i.trim()).filter(Boolean)
    if (!recipe.name || filteredIngredients.length === 0 || filteredInstructions.length === 0) {
      setError('Name, at least one ingredient, and one instruction are required.')
      return
    }
    if (isEdit) {
      updateUserRecipe(parseInt(id), {
        ...recipe,
        ingredients: filteredIngredients,
        instructions: filteredInstructions
      })
    } else {
      addUserRecipe({
        ...recipe,
        ingredients: filteredIngredients,
        instructions: filteredInstructions
      })
    }
    navigate('/')
  }

  return (
    <div className="max-w-2xl mx-auto card">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Recipe' : 'Add a New Recipe'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600 font-medium">{error}</div>}
        <div>
          <label className="block font-medium mb-1">Recipe Name *</label>
          <input name="name" value={recipe.name} onChange={handleChange} className="input-field" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea name="description" value={recipe.description} onChange={handleChange} className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Prep Time</label>
            <input name="prepTime" value={recipe.prepTime} onChange={handleChange} className="input-field" placeholder="e.g. 10 minutes" />
          </div>
          <div>
            <label className="block font-medium mb-1">Cook Time</label>
            <input name="cookTime" value={recipe.cookTime} onChange={handleChange} className="input-field" placeholder="e.g. 20 minutes" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Servings</label>
            <input type="number" name="servings" value={recipe.servings} min={1} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block font-medium mb-1">Difficulty</label>
            <select name="difficulty" value={recipe.difficulty} onChange={handleChange} className="input-field">
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Category</label>
            <input name="category" value={recipe.category} onChange={handleChange} className="input-field" placeholder="e.g. Main Dish" />
          </div>
          <div>
            <label className="block font-medium mb-1">Cuisine</label>
            <input name="cuisine" value={recipe.cuisine} onChange={handleChange} className="input-field" placeholder="e.g. Italian" />
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Dietary Preferences</label>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map(option => (
              <button
                type="button"
                key={option}
                onClick={() => handleDietaryChange(option)}
                className={`px-3 py-1 rounded-full border ${recipe.dietary.includes(option) ? 'bg-primary-100 text-primary-800 border-primary-400' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Ingredients *</label>
          {recipe.ingredients.map((ingredient, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                value={ingredient.amount}
                onChange={e => handleArrayChange('ingredients', idx, e.target.value, 'amount')}
                className="input-field w-20"
                placeholder="Amt"
                disabled={ingredient.type === 'sauce'}
              />
              <select
                value={ingredient.type}
                onChange={e => handleArrayChange('ingredients', idx, e.target.value, 'type')}
                className="input-field w-24"
              >
                <option value="lb">lb</option>
                <option value="quantity">quantity</option>
                <option value="sauce">sauce</option>
              </select>
              <input
                value={ingredient.name}
                onChange={e => handleArrayChange('ingredients', idx, e.target.value, 'name')}
                className="input-field flex-1"
                required={idx === 0}
                placeholder={`Ingredient ${idx + 1}`}
              />
              {recipe.ingredients.length > 1 && (
                <button type="button" onClick={() => handleRemoveArrayItem('ingredients', idx)} className="btn-secondary">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => handleAddArrayItem('ingredients')} className="btn-secondary mt-1">Add Ingredient</button>
        </div>
        <div>
          <label className="block font-medium mb-1">Instructions *</label>
          {recipe.instructions.map((step, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                value={step}
                onChange={e => handleArrayChange('instructions', idx, e.target.value)}
                className="input-field flex-1"
                required={idx === 0}
                placeholder={`Step ${idx + 1}`}
              />
              {recipe.instructions.length > 1 && (
                <button type="button" onClick={() => handleRemoveArrayItem('instructions', idx)} className="btn-secondary">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => handleAddArrayItem('instructions')} className="btn-secondary mt-1">Add Step</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Calories</label>
            <input name="calories" value={recipe.nutrition.calories} onChange={handleNutritionChange} className="input-field" />
          </div>
          <div>
            <label className="block font-medium mb-1">Protein</label>
            <input name="protein" value={recipe.nutrition.protein} onChange={handleNutritionChange} className="input-field" />
          </div>
          <div>
            <label className="block font-medium mb-1">Carbs</label>
            <input name="carbs" value={recipe.nutrition.carbs} onChange={handleNutritionChange} className="input-field" />
          </div>
          <div>
            <label className="block font-medium mb-1">Fat</label>
            <input name="fat" value={recipe.nutrition.fat} onChange={handleNutritionChange} className="input-field" />
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Image URL</label>
          <input name="image" value={recipe.image} onChange={handleChange} className="input-field" placeholder="https://..." />
        </div>
        <div className="pt-2">
          <button type="submit" className="btn-primary">{isEdit ? 'Update Recipe' : 'Save Recipe'}</button>
        </div>
        <div className="text-xs text-gray-500 pt-2">
          <strong>Note:</strong> User recipes are saved in your browser and merged with the main recipe list. To save to JSON, export manually.
        </div>
      </form>
    </div>
  )
}

export default AddRecipe 