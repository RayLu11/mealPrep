import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useMealStore = create(
  persist(
    (set, get) => ({
      // State
      availableIngredients: [],
      selectedRecipes: [],
      favorites: [],
      filters: {
        dietary: [],
        cuisine: [],
        difficulty: [],
        category: []
      },
      userRecipes: [],
      
      // Actions
      addIngredient: (ingredient) => {
        const normalized = ingredient.toLowerCase().trim()
        if (normalized && !get().availableIngredients.includes(normalized)) {
          set((state) => ({
            availableIngredients: [...state.availableIngredients, normalized]
          }))
        }
      },
      
      removeIngredient: (ingredient) => {
        set((state) => ({
          availableIngredients: state.availableIngredients.filter(
            item => item !== ingredient
          )
        }))
      },
      
      clearIngredients: () => {
        set({ availableIngredients: [] })
      },
      
      addToFavorites: (recipe) => {
        set((state) => ({
          favorites: state.favorites.some(fav => fav.id === recipe.id) 
            ? state.favorites 
            : [...state.favorites, recipe]
        }))
      },
      
      removeFromFavorites: (recipeId) => {
        set((state) => ({
          favorites: state.favorites.filter(recipe => recipe.id !== recipeId)
        }))
      },
      
      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        }))
      },
      
      clearFilters: () => {
        set({
          filters: {
            dietary: [],
            cuisine: [],
            difficulty: [],
            category: []
          }
        })
      },
      
      addUserRecipe: (recipe) => {
        set((state) => ({
          userRecipes: [...state.userRecipes, { ...recipe, id: Date.now(), isUser: true }]
        }))
      },
      
      updateUserRecipe: (id, updatedRecipe) => {
        set((state) => ({
          userRecipes: state.userRecipes.map(r => r.id === id ? { ...r, ...updatedRecipe } : r)
        }))
      },

      deleteUserRecipe: (recipeId) => {
        set((state) => ({
          userRecipes: state.userRecipes.filter(recipe => recipe.id !== recipeId)
        }))
      },
      
      // Computed values
      getMatchingRecipes: (recipes) => {
        const { availableIngredients, filters } = get()
        
        if (availableIngredients.length === 0) {
          return recipes
        }
        
        return recipes.filter(recipe => {
          // Normalize available ingredients
          const normalizedAvailable = availableIngredients.map(i => {
            // Try to parse user input: "2 lb chicken" or "3 quantity broccoli" or "soy sauce"
            const match = i.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(lb|quantity)?\s*(.*)$/i)
            if (match) {
              return {
                amount: match[1] || '',
                type: (match[2] || '').toLowerCase(),
                name: match[3].trim().toLowerCase()
              }
            }
            return { 
              amount: '', 
              type: i.toLowerCase().includes('sauce') ? 'sauce' : 'quantity', 
              name: i.trim().toLowerCase() 
            }
          })
          // Normalize recipe ingredients
          const normalizedRecipe = recipe.ingredients.map(ing => {
            // All recipes now use the object format
            return {
              amount: (ing.amount || '').trim(),
              type: (ing.type || 'quantity').toLowerCase(),
              name: (ing.name || '').trim().toLowerCase()
            }
          })
          // Ingredient match logic
          const ingredientMatches = normalizedRecipe.every(recipeIng => {
            if (recipeIng.type === 'sauce') {
              return normalizedAvailable.some(avail => 
                avail.type === 'sauce' && 
                avail.name === recipeIng.name
              )
            } else {
              // For lb/quantity, user must have >= recipe amount
              return normalizedAvailable.some(avail =>
                avail.type === recipeIng.type &&
                avail.name === recipeIng.name &&
                (!recipeIng.amount || (parseFloat(avail.amount) >= parseFloat(recipeIng.amount)))
              )
            }
          })
          
          // Check dietary filters
          const dietaryMatch = filters.dietary.length === 0 || 
            filters.dietary.some(diet => recipe.dietary.includes(diet))
          
          // Check cuisine filters
          const cuisineMatch = filters.cuisine.length === 0 || 
            filters.cuisine.includes(recipe.cuisine)
          
          // Check difficulty filters
          const difficultyMatch = filters.difficulty.length === 0 || 
            filters.difficulty.includes(recipe.difficulty)
          
          // Check category filters
          const categoryMatch = filters.category.length === 0 || 
            filters.category.includes(recipe.category)
          
          return ingredientMatches && dietaryMatch && cuisineMatch && 
                 difficultyMatch && categoryMatch
        })
      },
      
      getMatchScore: (recipe) => {
        const { availableIngredients } = get()
        if (availableIngredients.length === 0) return 0
        const normalizedAvailable = availableIngredients.map(i => {
          const match = i.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(lb|quantity)?\s*(.*)$/i)
          if (match) {
            return {
              amount: match[1] || '',
              type: (match[2] || '').toLowerCase(),
              name: match[3].trim().toLowerCase()
            }
          }
          return { 
            amount: '', 
            type: i.toLowerCase().includes('sauce') ? 'sauce' : 'quantity', 
            name: i.trim().toLowerCase() 
          }
        })
        const normalizedRecipe = recipe.ingredients.map(ing => {
          // All recipes now use the object format
          return {
            amount: (ing.amount || '').trim(),
            type: (ing.type || 'quantity').toLowerCase(),
            name: (ing.name || '').trim().toLowerCase()
          }
        })
        const matchingIngredients = normalizedRecipe.filter(recipeIng => {
          if (recipeIng.type === 'sauce') {
            return normalizedAvailable.some(avail => 
              avail.type === 'sauce' && 
              avail.name === recipeIng.name
            )
          } else {
            return normalizedAvailable.some(avail =>
              avail.type === recipeIng.type &&
              avail.name === recipeIng.name &&
              (!recipeIng.amount || (parseFloat(avail.amount) >= parseFloat(recipeIng.amount)))
            )
          }
        })
        
        return (matchingIngredients.length / recipe.ingredients.length) * 100
      },

      getAllRecipes: (staticRecipes) => {
        return [...staticRecipes, ...get().userRecipes]
      }
    }),
    {
      name: 'meal-prep-storage',
      partialize: (state) => ({
        availableIngredients: state.availableIngredients,
        favorites: state.favorites,
        filters: state.filters,
        userRecipes: state.userRecipes
      })
    }
  )
)

export default useMealStore 