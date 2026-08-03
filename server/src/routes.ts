import { Router } from "express";
import { db } from "./db";

interface RecipeRow {
    id: string;
    title: string;
    description: string;
    ingredients: string; // JSON serializado
    steps: string; // JSON serializado
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

function rowToRecipe(row: RecipeRow) {
    return {
        ...row,
        ingredients: JSON.parse(row.ingredients),
        steps: JSON.parse(row.steps),
    };
}

export const recipesRouter = Router();

recipesRouter.get("/", (_req, res) => {
    const rows = db.prepare("SELECT * FROM recipes ORDER BY updatedAt DESC").all() as RecipeRow[];
    res.json(rows.map(rowToRecipe));
});

recipesRouter.post("/", (req, res) => {
    const { id, title, description, ingredients, steps, imageUrl, createdAt, updatedAt } = req.body;

    db.prepare(
        `INSERT INTO recipes (id, title, description, ingredients, steps, imageUrl, createdAt, updatedAt)
     VALUES (@id, @title, @description, @ingredients, @steps, @imageUrl, @createdAt, @updatedAt)`
    ).run({
        id,
        title,
        description,
        ingredients: JSON.stringify(ingredients),
        steps: JSON.stringify(steps),
        imageUrl: imageUrl ?? null,
        createdAt,
        updatedAt,
    });

    res.status(201).json({ id });
});

recipesRouter.put("/:id", (req, res) => {
    const { title, description, ingredients, steps, imageUrl, updatedAt } = req.body;

    const result = db
        .prepare(
            `UPDATE recipes
       SET title = @title, description = @description, ingredients = @ingredients,
           steps = @steps, imageUrl = @imageUrl, updatedAt = @updatedAt
       WHERE id = @id`
        )
        .run({
            id: req.params.id,
            title,
            description,
            ingredients: JSON.stringify(ingredients),
            steps: JSON.stringify(steps),
            imageUrl: imageUrl ?? null,
            updatedAt,
        });

    if (result.changes === 0) {
        return res.status(404).json({ error: "Recipe not found" });
    }
    res.json({ ok: true });
});

recipesRouter.delete("/:id", (req, res) => {
    db.prepare("DELETE FROM recipes WHERE id = ?").run(req.params.id);
    res.status(204).send();
});