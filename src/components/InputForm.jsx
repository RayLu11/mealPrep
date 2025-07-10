import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import useMealStore from '../store/mealStore'

const InputForm = () => {
  const [inputValue, setInputValue] = useState('')
  const [inputAmount, setInputAmount] = useState('')
  const [inputType, setInputType] = useState('lb')
  const { availableIngredients, addIngredient, removeIngredient, clearIngredients } = useMealStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      // Format ingredient based on type
      let formattedIngredient = ''
      if (inputType === 'sauce') {
        formattedIngredient = inputValue.trim()
      } else {
        formattedIngredient = `${inputAmount} ${inputType} ${inputValue.trim()}`
      }
      
      addIngredient(formattedIngredient)
      setInputValue('')
      setInputAmount('')
      setInputType('lb')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (inputValue.trim()) {
        let formattedIngredient = ''
        if (inputType === 'sauce') {
          formattedIngredient = inputValue.trim()
        } else {
          formattedIngredient = `${inputAmount} ${inputType} ${inputValue.trim()}`
        }
        
        addIngredient(formattedIngredient)
        setInputValue('')
        setInputAmount('')
        setInputType('lb')
      }
    }
  }

  return (
    <div className="card">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          What ingredients do you have?
        </h2>
        <p className="text-gray-600 text-sm">
          Add the ingredients you have available and we'll suggest recipes for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="number"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            className="input-field w-20"
            placeholder="Amt"
            disabled={inputType === 'sauce'}
          />
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
            className="input-field w-24"
          >
            <option value="lb">lb</option>
            <option value="quantity">quantity</option>
            <option value="sauce">sauce</option>
          </select>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., chicken, broccoli, soy sauce..."
            className="input-field flex-1"
          />
          <button
            type="submit"
            className="btn-primary flex items-center space-x-1"
            disabled={!inputValue.trim()}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </form>

      {availableIngredients.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">
              Available Ingredients ({availableIngredients.length})
            </h3>
            <button
              onClick={clearIngredients}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              Clear all
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {availableIngredients.map((ingredient, index) => (
              <div key={index} className="tag">
                <span>{ingredient}</span>
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="tag-remove"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {availableIngredients.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <p>Start by adding some ingredients you have available</p>
        </div>
      )}
    </div>
  )
}

export default InputForm 