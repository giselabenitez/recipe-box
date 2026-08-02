import type { Recipe } from "../types/recipe";

interface RecipeDetailProps {
    recipe: Recipe;
    onEdit: () => void;
    onBack: () => void;
}

export function RecipeDetail({ recipe, onEdit, onBack }: RecipeDetailProps) {
    return (
        <article>
            <button onClick={onBack}>← Back</button>
            <h2>{recipe.title}</h2>
            <p>{recipe.description}</p>

            <h3>Ingredients</h3>
            <ul>
                {recipe.ingredients.map((ing) => (
                    <li key={ing.id}>
                        {ing.quantity} {ing.name}
                    </li>
                ))}
            </ul>

            <h3>Steps</h3>
            <ol>
                {recipe.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>

            <button onClick={onEdit}>Edit</button>
        </article>
    );
}