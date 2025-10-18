import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

interface Recipe {
  id: string
  name: string
  image: string
  totalTime: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  servings: number
  ingredients: string[]
  instructions: string[]
  substitutions: { [key: string]: string }
  calories: number
  dietary?: string[]
}

export async function POST(request: NextRequest) {
  let ingredients = ''
  let filters: string[] = []
  
  try {
    const body = await request.json()
    ingredients = body.ingredients || ''
    filters = body.filters || []

    if (!ingredients) {
      return NextResponse.json({ error: 'Ingredients are required' }, { status: 400 })
    }

    console.log('Generating recipes with AI for ingredients:', ingredients)
    console.log('Filters:', filters)

    // Create the prompt for AI recipe generation
    const dietaryRestrictions = filters && filters.length > 0 
      ? `Dietary restrictions: ${filters.join(', ')}. ` 
      : ''
    
    const prompt = `You are a creative chef. Using exactly these ingredients: ${ingredients}. ${dietaryRestrictions}

Create 2-3 unique, delicious recipes that ACTUALLY USE these ingredients. Be creative but realistic.

CRITICAL: Respond with ONLY a valid JSON array. No extra text, no explanations, just the JSON.

Format:
[
  {
    "name": "Specific Recipe Name",
    "totalTime": "25 mins",
    "difficulty": "Easy",
    "servings": 4,
    "ingredients": ["1 cup ingredient", "2 tsp spice", "etc"],
    "instructions": ["Step 1: Do this", "Step 2: Do that", "Step 3: Finish"],
    "substitutions": {"ingredient": "alternative"},
    "calories": 350
  }
]

Rules:
- Recipes MUST use the listed ingredients
- Instructions must be clear and numbered
- Cooking times should be realistic
- Include practical substitutions
- JSON must be valid and complete`

    // Use OpenAI for actual AI recipe generation
    let recipes: Recipe[]
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: 'system',
            content: 'You are a professional chef. Always respond with valid JSON arrays only. No markdown, no explanations, no extra text. Just pure JSON arrays of recipes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 3000
      })

      const messageContent = completion.choices[0]?.message?.content
      console.log('AI Response:', messageContent)
      
      if (messageContent) {
        console.log('Raw AI Response:', messageContent)
        
        // Try to extract JSON from the response - handle various formats
        let jsonMatch = messageContent.match(/\[[\s\S]*\]/)
        
        // If no array found, try to find object and wrap it
        if (!jsonMatch) {
          const objectMatch = messageContent.match(/\{[\s\S]*\}/)
          if (objectMatch) {
            jsonMatch = [`[${objectMatch[0]}]`]
          }
        }
        
        // Clean up the response - remove markdown and extra text
        let cleanJson = messageContent
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .replace(/^[^{[]*/, '')
          .replace(/[^}\]]*$/, '')
        
        // Try to parse the cleaned response
        try {
          if (jsonMatch) {
            recipes = JSON.parse(jsonMatch[0])
          } else {
            recipes = JSON.parse(cleanJson)
            // If it's a single object, wrap it in array
            if (!Array.isArray(recipes)) {
              recipes = [recipes]
            }
          }
          
          console.log('Successfully parsed AI recipes:', recipes.length)
          
          // Validate and clean up the AI response
          recipes = recipes.map((recipe: any, index: number) => ({
            id: `ai-recipe-${Date.now()}-${index}`,
            name: recipe.name || `Generated Recipe ${index + 1}`,
            image: `/api/placeholder/400/300?text=${encodeURIComponent(recipe.name || `Recipe ${index + 1}`)}`,
            totalTime: recipe.totalTime || "30 mins",
            difficulty: recipe.difficulty || "Easy",
            servings: recipe.servings || 4,
            ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : ["Ingredients not specified"],
            instructions: Array.isArray(recipe.instructions) ? recipe.instructions : ["Instructions not provided"],
            substitutions: recipe.substitutions || {},
            calories: recipe.calories || 300,
            dietary: filters || []
          }))
        } catch (parseError) {
          console.error('JSON parsing failed:', parseError)
          throw new Error('Failed to parse AI response as JSON')
        }
      } else {
        throw new Error('No content in AI response')
      }
    } catch (aiError) {
      console.error('AI generation failed:', aiError)
      console.log('Falling back to recipe templates...')
      // Fallback to basic recipe templates if AI fails
      recipes = getBasicRecipeTemplates(ingredients, filters)
    }

    return NextResponse.json({ recipes })

  } catch (error) {
    console.error('Error generating recipes:', error)
    console.error('Error details:', error.message, error.stack)
    
    // Return fallback recipes
    const fallbackRecipes = getBasicRecipeTemplates(ingredients || 'basic ingredients', filters)
    console.log('Using fallback recipes:', fallbackRecipes.length)
    return NextResponse.json({ recipes: fallbackRecipes })
  }
}

function getBasicRecipeTemplates(ingredients: string, filters: string[] = []): Recipe[] {
  const ingredientList = ingredients.toLowerCase().split(',').map(i => i.trim())
  
  return [
    {
      id: `fallback-${Date.now()}-1`,
      name: "Simple Recipe Template",
      image: "/api/placeholder/400/300?text=Simple+Recipe",
      totalTime: "25 mins",
      difficulty: "Easy",
      servings: 4,
      ingredients: ingredientList.length > 0 ? ingredientList : ["Your ingredients"],
      instructions: [
        "Prepare your ingredients",
        "Cook according to your preference",
        "Season to taste and serve"
      ],
      substitutions: {
        "any ingredient": "substitute with similar item"
      },
      calories: 300,
      dietary: filters
    }
  ]
}