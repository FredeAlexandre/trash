import {
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const recipes = sqliteTable(
	"recipes",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		slug: text("slug").notNull(),
		name: text("name").notNull(),
		content: text("content").notNull(),
	},
	(recipe) => ({
		slugIdx: uniqueIndex("slugIdx").on(recipe.slug),
	}),
);

export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;
