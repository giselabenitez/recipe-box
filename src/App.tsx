import { useEffect } from "react";
import { useRecipesStore } from "./store/recipesStore";

function App() {
  const recipes = useRecipesStore((state) => state.recipes);
  const status = useRecipesStore((state) => state.status);
  const loadRecipes = useRecipesStore((state) => state.loadRecipes);
  const addRecipe = useRecipesStore((state) => state.addRecipe);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  function addSampleRecipe() {
    addRecipe({
      title: "Tortilla de patatas",
      description: "Classic Spanish potato omelette",
      ingredients: [
        { id: crypto.randomUUID(), name: "Potatoes", quantity: "4 medium" },
        { id: crypto.randomUUID(), name: "Eggs", quantity: "6" },
      ],
      steps: ["Slice and fry the potatoes", "Beat the eggs", "Combine and cook"],
    });
  }

  return (
    <div>
      <h1>Recipe Box</h1>
      <p>Status: {status}</p>
      <button onClick={addSampleRecipe}>Add sample recipe</button>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>{recipe.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;