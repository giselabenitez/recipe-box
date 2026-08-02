import { useState, type SubmitEvent } from "react";
import type { Recipe, NewRecipeInput, Ingredient } from "../types/recipe";

interface RecipeFormProps {
    initialRecipe?: Recipe;
    onSubmit: (input: NewRecipeInput) => void;
    onCancel: () => void;
}

interface StepDraft {
    id: string;
    text: string;
}

export function RecipeForm({ initialRecipe, onSubmit, onCancel }: RecipeFormProps) {
    const [title, setTitle] = useState(initialRecipe?.title ?? "");
    const [description, setDescription] = useState(initialRecipe?.description ?? "");
    const [ingredients, setIngredients] = useState<Ingredient[]>(
        initialRecipe?.ingredients ?? []
    );
    const [steps, setSteps] = useState<StepDraft[]>(
        initialRecipe?.steps.map((text) => ({ id: crypto.randomUUID(), text })) ?? []
    );

    function addIngredient() {
        setIngredients((prev) => [...prev, { id: crypto.randomUUID(), name: "", quantity: "" }]);
    }

    function updateIngredient(id: string, field: "name" | "quantity", value: string) {
        setIngredients((prev) =>
            prev.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing))
        );
    }

    function removeIngredient(id: string) {
        setIngredients((prev) => prev.filter((ing) => ing.id !== id));
    }

    function addStep() {
        setSteps((prev) => [...prev, { id: crypto.randomUUID(), text: "" }]);
    }

    function updateStep(id: string, text: string) {
        setSteps((prev) => prev.map((step) => (step.id === id ? { ...step, text } : step)));
    }

    function removeStep(id: string) {
        setSteps((prev) => prev.filter((step) => step.id !== id));
    }

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        onSubmit({
            title,
            description,
            ingredients,
            steps: steps.map((s) => s.text).filter((text) => text.trim() !== ""),
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Title
                <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>

            <label>
                Description
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>

            <fieldset>
                <legend>Ingredients</legend>
                {ingredients.map((ing) => (
                    <div key={ing.id}>
                        <input
                            placeholder="Name"
                            value={ing.name}
                            onChange={(e) => updateIngredient(ing.id, "name", e.target.value)}
                        />
                        <input
                            placeholder="Quantity"
                            value={ing.quantity}
                            onChange={(e) => updateIngredient(ing.id, "quantity", e.target.value)}
                        />
                        <button type="button" onClick={() => removeIngredient(ing.id)}>
                            Remove
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addIngredient}>
                    Add ingredient
                </button>
            </fieldset>

            <fieldset>
                <legend>Steps</legend>
                {steps.map((step) => (
                    <div key={step.id}>
                        <textarea value={step.text} onChange={(e) => updateStep(step.id, e.target.value)} />
                        <button type="button" onClick={() => removeStep(step.id)}>
                            Remove
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addStep}>
                    Add step
                </button>
            </fieldset>

            <button type="submit">Save recipe</button>
            <button type="button" onClick={onCancel}>
                Cancel
            </button>
        </form>
    );
}