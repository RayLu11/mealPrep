// AI suggestion utility functions
// This can be extended with actual AI API calls (OpenAI, HuggingFace, etc.)

export const generateAISuggestions = async (ingredients, recipes) => {
  // For now, we'll use enhanced local matching
  // In a real implementation, you would call an AI API here
  
  try {
    // Simulate AI API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Enhanced local matching with scoring
    const suggestions = recipes.map(recipe => {
      const matchScore = calculateMatchScore(ingredients, recipe.ingredients)
      const missingIngredients = getMissingIngredients(ingredients, recipe.ingredients)
      
      return {
        ...recipe,
        matchScore,
        missingIngredients,
        aiSuggestion: generateSuggestionText(recipe, matchScore, missingIngredients)
      }
    })
    
    // Sort by match score and return top suggestions
    return suggestions
      .filter(recipe => recipe.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6)
      
  } catch (error) {
    console.error('AI suggestion error:', error)
    // Fallback to basic matching
    return getBasicMatches(ingredients, recipes)
  }
}

const calculateMatchScore = (availableIngredients, recipeIngredients) => {
  if (availableIngredients.length === 0) return 0
  
  // Normalize available ingredients to objects
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
  
  // Normalize recipe ingredients to objects
  const normalizedRecipe = recipeIngredients.map(ing => ({
    amount: (ing.amount || '').trim(),
    type: (ing.type || 'quantity').toLowerCase(),
    name: (ing.name || '').trim().toLowerCase()
  }))
  
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
  
  return Math.round((matchingIngredients.length / recipeIngredients.length) * 100)
}

const getMissingIngredients = (availableIngredients, recipeIngredients) => {
  // Normalize available ingredients to objects
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
  
  // Normalize recipe ingredients to objects
  const normalizedRecipe = recipeIngredients.map(ing => ({
    amount: (ing.amount || '').trim(),
    type: (ing.type || 'quantity').toLowerCase(),
    name: (ing.name || '').trim().toLowerCase()
  }))
  
  return normalizedRecipe.filter(recipeIng => {
    if (recipeIng.type === 'sauce') {
      return !normalizedAvailable.some(avail => 
        avail.type === 'sauce' && 
        avail.name === recipeIng.name
      )
    } else {
      return !normalizedAvailable.some(avail =>
        avail.type === recipeIng.type &&
        avail.name === recipeIng.name &&
        (!recipeIng.amount || (parseFloat(avail.amount) >= parseFloat(recipeIng.amount)))
      )
    }
  }).map(ing => `${ing.amount ? ing.amount + ' ' : ''}${ing.type} ${ing.name}`)
}

const generateSuggestionText = (recipe, matchScore, missingIngredients) => {
  if (matchScore >= 80) {
    return `Perfect match! You have most ingredients for this ${recipe.name}.`
  } else if (matchScore >= 60) {
    return `Great option! You have ${matchScore}% of the ingredients needed.`
  } else if (matchScore >= 40) {
    return `Good starting point! You'll need a few more ingredients.`
  } else {
    return `Creative option! You have some key ingredients to build upon.`
  }
}

const getBasicMatches = (ingredients, recipes) => {
  return recipes
    .map(recipe => ({
      ...recipe,
      matchScore: calculateMatchScore(ingredients, recipe.ingredients),
      missingIngredients: getMissingIngredients(ingredients, recipe.ingredients)
    }))
    .filter(recipe => recipe.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6)
}

// Example AI API integration (commented out for reference)
/*
export const callOpenAI = async (ingredients) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful cooking assistant. Suggest 3 meal ideas based on the available ingredients.'
        },
        {
          role: 'user',
          content: `I have these ingredients: ${ingredients.join(', ')}. What can I cook?`
        }
      ],
      max_tokens: 300
    })
  })
  
  const data = await response.json()
  return data.choices[0].message.content
}
*/ 