import { create } from "zustand";
import { getAllRecipes, saveRecipe, deleteRecipeById } from "../storage/recipesDb";
import type { Recipe, NewRecipeInput } from "../types/recipe";

type Status = "idle" | "loading" | "success" | "error";

interface RecipesStore {
    recipes: Recipe[];
    status: Status;
    errorMessage: string | null;
    loadRecipes: () => Promise<void>;
    addRecipe: (input: NewRecipeInput) => Promise<void>;
    updateRecipe: (recipe: Recipe) => Promise<void>;
    deleteRecipe: (id: string) => Promise<void>;
}

export const useRecipesStore = create<RecipesStore>((set, get) => ({
    recipes: [],
    status: "idle",
    errorMessage: null,

    loadRecipes: async () => {
        set({ status: "loading", errorMessage: null });
        try {
            const recipes = await getAllRecipes();
            set({ recipes, status: "success" });
        } catch (error) {
            set({
                status: "error",
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            });
        }
    },

    addRecipe: async (input) => {
        const now = new Date().toISOString();
        const newRecipe: Recipe = {
            ...input,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
            syncStatus: "pending",
        };

        set((state) => ({ recipes: [...state.recipes, newRecipe] }));

        try {
            await saveRecipe(newRecipe);
        } catch (error) {
            set((state) => ({
                recipes: state.recipes.filter((r) => r.id !== newRecipe.id),
                status: "error",
                errorMessage: error instanceof Error ? error.message : "Could not save recipe",
            }));
        }
    },

    updateRecipe: async (updated) => {
        const previous = get().recipes; // snapshot of the current state

        const updatedRecipe: Recipe = {
            ...updated,
            updatedAt: new Date().toISOString(),
            syncStatus: "pending",
        };

        set((state) => ({
            recipes: state.recipes.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)),
        }));

        try {
            await saveRecipe(updatedRecipe);
        } catch (error) {
            set({
                recipes: previous,
                status: "error",
                errorMessage: error instanceof Error ? error.message : "Could not update recipe",
            });
        }
    },

    deleteRecipe: async (id) => {
        const previous = get().recipes;

        set((state) => ({ recipes: state.recipes.filter((r) => r.id !== id) }));

        try {
            await deleteRecipeById(id);
        } catch (error) {
            set({
                recipes: previous,
                status: "error",
                errorMessage: error instanceof Error ? error.message : "Could not delete recipe",
            });
        }
    },
}));