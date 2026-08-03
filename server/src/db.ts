import Database from "better-sqlite3";

export const db = new Database("recipes.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS recipes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    ingredients TEXT NOT NULL,
    steps TEXT NOT NULL,
    imageUrl TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`);