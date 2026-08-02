import type { Recipe } from "../types/recipe";

interface RecipeListProps {
    recipes: Recipe[];
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}

export function RecipeList({ recipes, onSelect, onDelete }: RecipeListProps) {
    if (recipes.length === 0) {
        return <p>No recipes yet — add your first one.</p>;
    }

    return (
        <ul>
            {recipes.map((recipe) => (
                <li key={recipe.id}>
                    <button onClick={() => onSelect(recipe.id)}>{recipe.title}</button>
                    {recipe.syncStatus === "pending" && <span> · pending sync</span>}
                    <button onClick={() => onDelete(recipe.id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
}