import { useEffect, useState } from "react";
import { useRecipesStore } from "./store/recipesStore";
import { RecipeList } from "./components/RecipeList";
import { RecipeForm } from "./components/RecipeForm";
import { RecipeDetail } from "./components/RecipeDetail";
import type { Recipe } from "./types/recipe";

type View =
  | { name: "list" }
  | { name: "new" }
  | { name: "edit"; recipe: Recipe }
  | { name: "detail"; recipe: Recipe };

function App() {
  const recipes = useRecipesStore((state) => state.recipes);
  const loadRecipes = useRecipesStore((state) => state.loadRecipes);
  const addRecipe = useRecipesStore((state) => state.addRecipe);
  const updateRecipe = useRecipesStore((state) => state.updateRecipe);
  const deleteRecipe = useRecipesStore((state) => state.deleteRecipe);

  const [view, setView] = useState<View>({ name: "list" });

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  return (
    <div>
      <h1>Recipe Box</h1>

      {view.name === "list" && (
        <>
          <button onClick={() => setView({ name: "new" })}>New recipe</button>
          <RecipeList
            recipes={recipes}
            onSelect={(id) => {
              const recipe = recipes.find((r) => r.id === id);
              if (recipe) setView({ name: "detail", recipe });
            }}
            onDelete={deleteRecipe}
          />
        </>
      )}

      {view.name === "new" && (
        <RecipeForm
          onSubmit={async (input) => {
            await addRecipe(input);
            setView({ name: "list" });
          }}
          onCancel={() => setView({ name: "list" })}
        />
      )}

      {view.name === "edit" && (
        <RecipeForm
          initialRecipe={view.recipe}
          onSubmit={async (input) => {
            await updateRecipe({ ...view.recipe, ...input });
            setView({ name: "list" });
          }}
          onCancel={() => setView({ name: "list" })}
        />
      )}

      {view.name === "detail" && (
        <RecipeDetail
          recipe={view.recipe}
          onEdit={() => setView({ name: "edit", recipe: view.recipe })}
          onBack={() => setView({ name: "list" })}
        />
      )}
    </div>
  );
}

export default App;