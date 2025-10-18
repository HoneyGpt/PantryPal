'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Loader2, ChefHat, Clock, Users, Utensils, Heart, Share2, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

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

export default function Home() {
  const [ingredients, setIngredients] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [savedRecipes, setSavedRecipes] = useState<string[]>([])

  const dietaryFilters = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal']

  const generateRecipes = async () => {
    if (!ingredients.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ingredients,
          filters: selectedFilters 
        })
      })
      
      const data = await response.json()
      setRecipes(data.recipes || [])
    } catch (error) {
      console.error('Error generating recipes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const toggleSaveRecipe = (recipeId: string) => {
    setSavedRecipes(prev => 
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    )
  }

  const shareRecipe = async (recipe: Recipe) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.name,
          text: `Check out this recipe I found on PantryPal!`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedRecipe(null)}
            className="mb-6"
          >
            ← Back to recipes
          </Button>

          <Card className="overflow-hidden">
            <div className="h-64 bg-gradient-to-r from-yellow-200 to-green-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <ChefHat className="w-24 h-24 text-white/50" />
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedRecipe.name}</h1>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedRecipe.totalTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {selectedRecipe.servings} servings
                    </span>
                    <span className="flex items-center gap-1">
                      <Utensils className="w-4 h-4" />
                      {selectedRecipe.calories} cal
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSaveRecipe(selectedRecipe.id)}
                    className={cn(savedRecipes.includes(selectedRecipe.id) && "bg-red-50 border-red-200")}
                  >
                    <Heart className={cn("w-4 h-4", savedRecipes.includes(selectedRecipe.id) && "fill-red-500 text-red-500")} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareRecipe(selectedRecipe)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Ingredients</h2>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Instructions</h2>
                  <ol className="space-y-3">
                    {selectedRecipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-yellow-200 text-yellow-800 rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {Object.keys(selectedRecipe.substitutions).length > 0 && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gray-800">💡 Substitution Tips</h3>
                  <div className="space-y-1 text-sm">
                    {Object.entries(selectedRecipe.substitutions).map(([original, sub]) => (
                      <div key={original}>
                        <span className="font-medium">{original}</span> → {sub}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ChefHat className="w-8 h-8 text-yellow-600" />
            <h1 className="text-4xl font-bold text-gray-800">PantryPal</h1>
          </div>
          <p className="text-gray-600">I'll find you a tasty idea in seconds! 🍳</p>
        </header>

        {/* Input Section */}
        <Card className="mb-6 bg-white/80 backdrop-blur">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What ingredients do you have?
                </label>
                <Input
                  placeholder="e.g., 2 eggs, tomato, onion, rice..."
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  className="w-full p-3 text-lg"
                />
              </div>

              {/* Dietary Filters */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Filter className="w-4 h-4" />
                  Dietary Preferences
                </div>
                <div className="flex flex-wrap gap-2">
                  {dietaryFilters.map(filter => (
                    <Badge
                      key={filter}
                      variant={selectedFilters.includes(filter) ? "default" : "outline"}
                      className="cursor-pointer px-3 py-1"
                      onClick={() => toggleFilter(filter)}
                    >
                      {filter}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                onClick={generateRecipes}
                disabled={isLoading || !ingredients.trim()}
                className="w-full bg-gradient-to-r from-yellow-400 to-green-400 hover:from-yellow-500 hover:to-green-500 text-white font-semibold py-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Stirring your recipe...
                  </>
                ) : (
                  'Generate Recipe'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recipe Cards */}
        {recipes.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Card 
                key={recipe.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow bg-white/80 backdrop-blur"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="h-48 bg-gradient-to-r from-yellow-200 to-green-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ChefHat className="w-16 h-16 text-white/50" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSaveRecipe(recipe.id)
                      }}
                      className="bg-white/80 hover:bg-white"
                    >
                      <Heart className={cn("w-4 h-4", savedRecipes.includes(recipe.id) && "fill-red-500 text-red-500")} />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">{recipe.name}</h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {recipe.totalTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {recipe.servings}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={getDifficultyColor(recipe.difficulty)}>
                      {recipe.difficulty}
                    </Badge>
                    <span className="text-sm text-gray-500">{recipe.calories} cal</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 pb-8 text-gray-600 text-sm">
          <p>© PantryPal 2025</p>
        </footer>
      </div>
    </div>
  )
}