import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID or client local id
  email: text('email').notNull(),
  name: text('name'),
  familyBookTitle: text('family_book_title'),
  heirloomSpecialty: text('heirloom_specialty'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const recipes = pgTable('recipes', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url').notNull(),
  category: text('category').notNull(),
  prepTimeMinutes: integer('prep_time_minutes').notNull().default(30),
  cookTimeMinutes: integer('cook_time_minutes').notNull().default(45),
  servings: integer('servings').notNull().default(6),
  difficulty: text('difficulty').notNull().default('Moderate'),
  passedDownBy: text('passed_down_by').notNull().default('Family'),
  passedDownYear: text('passed_down_year'),
  originLocation: text('origin_location'),
  ingredients: text('ingredients').notNull(), // JSON string array of ingredients
  instructions: text('instructions').notNull(), // JSON string array of steps
  familyStory: text('family_story'),
  secretTips: text('secret_tips'),
  tags: text('tags'), // JSON string array
  isFavorite: boolean('is_favorite').notNull().default(false),
  sharedWith: text('shared_with'), // JSON string array
  createdAt: timestamp('created_at').defaultNow(),
});
