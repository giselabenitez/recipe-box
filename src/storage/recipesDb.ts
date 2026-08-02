import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Recipe } from "../types/recipe";

const DB_NAME = "recipe-box-db";
const DB_VERSION = 1;
const STORE_NAME = "recipes";

interface RecipeBoxDB extends DBSchema {
    recipes: {
        key: string;
        value: Recipe;
        indexes: { "by-sync-status": string };
    };
}

let dbPromise: Promise<IDBPDatabase<RecipeBoxDB>> | null = null;

function getDb(): Promise<IDBPDatabase<RecipeBoxDB>> {
    if (!dbPromise) {
        dbPromise = openDB<RecipeBoxDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
                store.createIndex("by-sync-status", "syncStatus");
            },
        });
    }
    return dbPromise;
}

export async function getAllRecipes(): Promise<Recipe[]> {
    const db = await getDb();
    return db.getAll(STORE_NAME);
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
    const db = await getDb();
    return db.get(STORE_NAME, id);
}

export async function saveRecipe(recipe: Recipe): Promise<void> {
    const db = await getDb();
    await db.put(STORE_NAME, recipe);
}

export async function deleteRecipeById(id: string): Promise<void> {
    const db = await getDb();
    await db.delete(STORE_NAME, id);
}

export async function getRecipesBySyncStatus(
    status: Recipe["syncStatus"]
): Promise<Recipe[]> {
    const db = await getDb();
    return db.getAllFromIndex(STORE_NAME, "by-sync-status", status);
}