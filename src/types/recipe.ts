export interface Ingredient {
    id: string;
    name: string;
    quantity: string;
}

export interface Recipe {
    id: string;
    title: string;
    description: string;
    ingredients: Ingredient[];
    steps: string[];
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
    syncStatus: "synced" | "pending" | "error";
}

export type NewRecipeInput = Omit<Recipe, "id" | "createdAt" | "updatedAt" | "syncStatus">;