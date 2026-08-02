import { useEffect } from "react";
import { saveRecipe, getAllRecipes } from "./storage/recipesDb";
import type { Recipe } from "./types/recipe";

function App() {
  useEffect(() => {
    async function testStorage() {
      const sample: Recipe = {
        id: crypto.randomUUID(),
        title: "Tortilla de patatas",
        description: "Classic Spanish potato omelette",
        ingredients: [
          { id: crypto.randomUUID(), name: "Potatoes", quantity: "4 medium" },
          { id: crypto.randomUUID(), name: "Eggs", quantity: "6" },
        ],
        steps: ["Slice and fry the potatoes", "Beat the eggs", "Combine and cook"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        syncStatus: "pending",
      };

      await saveRecipe(sample);
      const all = await getAllRecipes();
      console.log("Recipes in IndexedDB:", all);
    }

    testStorage();
  }, []);

  return (
    <div>
      <h1>Recipe Box</h1>
    </div>
  );
}

export default App;