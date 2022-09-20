import React, {useState, useEffect} from 'react'
import axios from 'axios'

const Recipes = () => {
  const [recipes, setRecipes] = useState([])
  const [err, setErr] = useState('')

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const response = await axios.get('/api/recipes')
        setRecipes(response.data.recipes)
      } catch (e) {
        setErr('Failed to fetch recipes')
      }
    }

    fetchAllRecipes()
  }, [recipes, err])

  return (
    <div>
      <h1>Recipe Finder</h1>
      <form>
        <input type='text' placeholder='Enter an ingredient to find recipes...'/>
        <button type='submit'>Find</button>
      </form>

      {err && (
        <p>{err}</p>
      )}

      <ul>
        {recipes.map((recipe) => 
          <li key={recipe.id}>{recipe.title}</li>
        )}
      </ul>
    </div>
  )
}

export default Recipes