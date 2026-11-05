import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './src/db/index.ts';
import { recipes, users } from './src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '15mb' }));

// Helper to seed initial sample recipes if SQL database is empty
async function seedInitialRecipesIfEmpty() {
  if (!process.env.SQL_HOST) return;
  try {
    const existing = await db.select().from(recipes).limit(1);
    if (existing.length === 0) {
      console.log('Seeding initial heirloom family recipes into Cloud SQL database...');
      const seedItems = [
        {
          userId: 'usr_rosa',
          title: "Nonna Rosa's Sunday Bolognese Lasagna",
          description: "Slow-simmered beef & pork ragù layered with creamy besciamella, silky pasta sheets, and freshly grated Parmigiano-Reggiano.",
          imageUrl: '/src/assets/images/recipe_lasagna_heirloom_1793898158537.jpg',
          category: 'Heirloom Classics',
          prepTimeMinutes: 45,
          cookTimeMinutes: 90,
          servings: 8,
          difficulty: 'Heirloom Secret',
          passedDownBy: 'Nonna Rosa',
          passedDownYear: '1968',
          originLocation: 'Naples, Italy',
          ingredients: JSON.stringify([
            { id: 'i1', name: 'Ground beef chuck (80/20)', amount: '1', unit: 'lb' },
            { id: 'i2', name: 'Ground pork shoulder', amount: '0.75', unit: 'lb' },
            { id: 'i3', name: 'San Marzano canned tomatoes, crushed', amount: '28', unit: 'oz' },
            { id: 'i4', name: 'Whole milk', amount: '4', unit: 'cups' },
            { id: 'i5', name: 'Fresh lasagna sheets', amount: '12', unit: 'sheets' },
            { id: 'i6', name: 'Parmigiano-Reggiano', amount: '1.5', unit: 'cups' }
          ]),
          instructions: JSON.stringify([
            { id: 's1', stepNumber: 1, text: 'Render soffritto gently in olive oil.', timerMinutes: 10 },
            { id: 's2', stepNumber: 2, text: 'Brown ground beef and pork, deglaze with dry white wine.', timerMinutes: 8 },
            { id: 's3', stepNumber: 3, text: 'Simmer tomatoes and meat ragù for 2 hours on low.', timerMinutes: 120 },
            { id: 's4', stepNumber: 4, text: 'Prepare besciamella sauce with butter, flour, warm milk, and fresh nutmeg.', timerMinutes: 7 },
            { id: 's5', stepNumber: 5, text: 'Layer ragù, sheets, besciamella, and cheese. Bake at 375°F for 38 mins.', timerMinutes: 38 }
          ]),
          familyStory: "Nonna Rosa made this every Sunday. Simmer the ragù low and slow, and rest 20 minutes before serving.",
          secretTips: "A pinch of nutmeg in the besciamella elevates the whole dish.",
          tags: JSON.stringify(['Pasta', 'Comfort Food', 'Sunday Dinner', 'Slow Cooked']),
          isFavorite: true,
          sharedWith: JSON.stringify(['Nonna Rosa', 'Papa Marco', 'Auntie Fatima']),
        },
        {
          userId: 'usr_rosa',
          title: "Grandma Clara's Brown Butter Apple Pie",
          description: "Flaky hand-crimped lattice butter crust filled with spiced Honeycrisp apples, rich browned butter, and a hint of apple cider caramel.",
          imageUrl: '/src/assets/images/recipe_apple_pie_grandma_1793898159138.jpg',
          category: 'Desserts & Sweets',
          prepTimeMinutes: 40,
          cookTimeMinutes: 55,
          servings: 8,
          difficulty: 'Moderate',
          passedDownBy: 'Grandma Clara',
          passedDownYear: '1954',
          originLocation: 'Woodstock, Vermont',
          ingredients: JSON.stringify([
            { id: 'i20', name: 'All-purpose unbleached flour', amount: '2.5', unit: 'cups' },
            { id: 'i21', name: 'Cold butter, cubed', amount: '1', unit: 'cup' },
            { id: 'i22', name: 'Honeycrisp apples, peeled & sliced', amount: '3', unit: 'lbs' },
            { id: 'i23', name: 'Browned unsalted butter', amount: '3', unit: 'tbsp' },
            { id: 'i24', name: 'Dark brown sugar', amount: '0.5', unit: 'cup' },
            { id: 'i25', name: 'Ground cinnamon', amount: '1.5', unit: 'tsp' }
          ]),
          instructions: JSON.stringify([
            { id: 's20', stepNumber: 1, text: 'Cut butter into flour, add ice vinegar water, form dough disc and chill 1 hr.', timerMinutes: 60 },
            { id: 's21', stepNumber: 2, text: 'Toss apples with browned butter, sugar, spices, and pinch of salt.', timerMinutes: 10 },
            { id: 's22', stepNumber: 3, text: 'Roll bottom crust into pie dish, fill with apples, weave top lattice ribbon.', timerMinutes: 15 },
            { id: 's23', stepNumber: 4, text: 'Brush with cream and bake until bubbly and golden brown.', timerMinutes: 55 }
          ]),
          familyStory: "Grandma Clara baked this every Thanksgiving using orchard apples.",
          secretTips: "Brush lattice with heavy cream and coarse turbinado sugar before baking.",
          tags: JSON.stringify(['Baking', 'Thanksgiving', 'Fall Favorite', 'Pastry']),
          isFavorite: true,
          sharedWith: JSON.stringify(['Grandma Clara', 'Nonna Rosa']),
        },
        {
          userId: 'usr_rosa',
          title: "Auntie Fatima's Royal Chicken Dum Biryani",
          description: "Marinated bone-in chicken infused with ginger, garlic, yogurt, and whole spices, sealed under fragrant saffron-steeped aged basmati rice.",
          imageUrl: '/src/assets/images/recipe_chicken_biryani_1793898160064.jpg',
          category: 'Holiday Feasts',
          prepTimeMinutes: 50,
          cookTimeMinutes: 45,
          servings: 6,
          difficulty: 'Heirloom Secret',
          passedDownBy: 'Auntie Fatima',
          passedDownYear: '1972',
          originLocation: 'Lahore, Punjab',
          ingredients: JSON.stringify([
            { id: 'i40', name: 'Bone-in chicken thighs', amount: '2', unit: 'lbs' },
            { id: 'i41', name: 'Aged long-grain Basmati rice', amount: '2.5', unit: 'cups' },
            { id: 'i42', name: 'Crispy fried onions (birista)', amount: '1.5', unit: 'cups' },
            { id: 'i43', name: 'Plain Greek yogurt', amount: '0.75', unit: 'cup' },
            { id: 'i44', name: 'Saffron threads in warm milk', amount: '1', unit: 'pinch' },
            { id: 'i45', name: 'Pure desi ghee', amount: '3', unit: 'tbsp' }
          ]),
          instructions: JSON.stringify([
            { id: 's40', stepNumber: 1, text: 'Marinate chicken in spiced yogurt, ginger-garlic paste, and fried onions for 2 hours.', timerMinutes: 120 },
            { id: 's41', stepNumber: 2, text: 'Par-boil soaked basmati rice with whole aromatics until 70% tender.', timerMinutes: 6 },
            { id: 's42', stepNumber: 3, text: 'Layer chicken at bottom, parboiled rice on top with saffron, ghee, and herbs.', timerMinutes: 5 },
            { id: 's43', stepNumber: 4, text: 'Seal pot tightly with lid/foil and cook on dum for 25 minutes on lowest heat.', timerMinutes: 25 },
            { id: 's44', stepNumber: 5, text: 'Rest 10 minutes, fluff gently with a saucer, and serve with cucumber raita.', timerMinutes: 10 }
          ]),
          familyStory: "Auntie Fatima served this for Eid celebrations and weddings.",
          secretTips: "Never stir with a spoon; gently fluff from bottom with a flat plate to keep grains long.",
          tags: JSON.stringify(['Rice', 'Spices', 'Celebration', 'Eid Special', 'Chicken']),
          isFavorite: true,
          sharedWith: JSON.stringify(['Auntie Fatima', 'Papa Marco']),
        },
        {
          userId: 'usr_rosa',
          title: "Papa Marco's Rosemary & Sea Salt Focaccia",
          description: "High-hydration slow-fermented Italian flatbread with a crisp olive oil golden crust, pillowy crumb, blistered cherry tomatoes, and flaky sea salt.",
          imageUrl: '/src/assets/images/recipe_sourdough_focaccia_1793898160466.jpg',
          category: 'Breads & Baking',
          prepTimeMinutes: 25,
          cookTimeMinutes: 28,
          servings: 10,
          difficulty: 'Easy',
          passedDownBy: 'Papa Marco',
          passedDownYear: '1988',
          originLocation: 'Bari, Italy',
          ingredients: JSON.stringify([
            { id: 'i60', name: 'Strong bread flour', amount: '500', unit: 'g' },
            { id: 'i61', name: 'Lukewarm water (80% hydration)', amount: '400', unit: 'ml' },
            { id: 'i62', name: 'Active dry yeast', amount: '7', unit: 'g' },
            { id: 'i63', name: 'Extra virgin olive oil', amount: '0.33', unit: 'cup' },
            { id: 'i64', name: 'Fresh rosemary and cherry tomatoes', amount: '1', unit: 'cup' },
            { id: 'i65', name: 'Maldon flaky sea salt', amount: '1.5', unit: 'tsp' }
          ]),
          instructions: JSON.stringify([
            { id: 's60', stepNumber: 1, text: 'Mix shaggy wet dough, rest 20 mins, do 3 stretch and folds, cold ferment overnight.', timerMinutes: 60 },
            { id: 's61', stepNumber: 2, text: 'Transfer to oiled baking pan and proof 2 hours until bubbly.', timerMinutes: 120 },
            { id: 's62', stepNumber: 3, text: 'Dimple deeply with oiled fingers, top with rosemary, tomatoes, and sea salt.', timerMinutes: 5 },
            { id: 's63', stepNumber: 4, text: 'Bake at 425°F for 26 minutes until golden and hollow when tapped.', timerMinutes: 26 }
          ]),
          familyStory: "Papa Marco made this whenever family gathered for summer dinners.",
          secretTips: "Be generous with olive oil in the pan so the bottom crust gets shatteringly crisp.",
          tags: JSON.stringify(['Bread', 'Italian', 'Baking', 'Vegan Friendly', 'Appetizer']),
          isFavorite: false,
          sharedWith: JSON.stringify(['Papa Marco', 'Nonna Rosa']),
        }
      ];

      for (const item of seedItems) {
        await db.insert(recipes).values(item);
      }
      console.log('Seeded 4 heirloom recipes into Cloud SQL database.');
    }
  } catch (err) {
    console.error('Could not seed recipes into Cloud SQL:', err);
  }
}

// API Routes
app.get('/api/recipes', async (_req: Request, res: Response) => {
  try {
    if (process.env.SQL_HOST) {
      await seedInitialRecipesIfEmpty();
      const rows = await db.select().from(recipes).orderBy(desc(recipes.createdAt));
      const formatted = rows.map((r) => ({
        id: String(r.id),
        title: r.title,
        description: r.description,
        imageUrl: r.imageUrl,
        category: r.category,
        prepTimeMinutes: r.prepTimeMinutes,
        cookTimeMinutes: r.cookTimeMinutes,
        servings: r.servings,
        difficulty: r.difficulty,
        passedDownBy: r.passedDownBy,
        passedDownYear: r.passedDownYear || undefined,
        originLocation: r.originLocation || undefined,
        ingredients: JSON.parse(r.ingredients || '[]'),
        instructions: JSON.parse(r.instructions || '[]'),
        familyStory: r.familyStory || undefined,
        secretTips: r.secretTips || undefined,
        tags: JSON.parse(r.tags || '[]'),
        isFavorite: Boolean(r.isFavorite),
        sharedWith: JSON.parse(r.sharedWith || '[]'),
        createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
        authorId: r.userId,
      }));
      return res.json({ success: true, source: 'cloudsql', recipes: formatted });
    }
  } catch (error) {
    console.error('Error fetching recipes from database:', error);
  }

  // Graceful fallback if database is not reachable in local shell
  return res.json({
    success: true,
    source: 'fallback',
    recipes: [
      {
        id: 'rec_lasagna_01',
        title: "Nonna Rosa's Sunday Bolognese Lasagna",
        description: "Slow-simmered beef & pork ragù layered with creamy besciamella, silky pasta sheets, and freshly grated Parmigiano-Reggiano.",
        imageUrl: '/src/assets/images/recipe_lasagna_heirloom_1793898158537.jpg',
        category: 'Heirloom Classics',
        prepTimeMinutes: 45,
        cookTimeMinutes: 90,
        servings: 8,
        difficulty: 'Heirloom Secret',
        passedDownBy: 'Nonna Rosa',
        passedDownYear: '1968',
        originLocation: 'Naples, Italy',
        ingredients: [
          { id: 'i1', name: 'Ground beef chuck (80/20)', amount: '1', unit: 'lb' },
          { id: 'i2', name: 'Ground pork shoulder', amount: '0.75', unit: 'lb' },
          { id: 'i3', name: 'San Marzano canned tomatoes, crushed', amount: '28', unit: 'oz' },
          { id: 'i4', name: 'Whole milk', amount: '4', unit: 'cups' },
          { id: 'i5', name: 'Fresh lasagna sheets', amount: '12', unit: 'sheets' },
          { id: 'i6', name: 'Parmigiano-Reggiano', amount: '1.5', unit: 'cups' }
        ],
        instructions: [
          { id: 's1', stepNumber: 1, text: 'Render soffritto gently in olive oil.', timerMinutes: 10 },
          { id: 's2', stepNumber: 2, text: 'Brown ground beef and pork, deglaze with dry white wine.', timerMinutes: 8 },
          { id: 's3', stepNumber: 3, text: 'Simmer tomatoes and meat ragù for 2 hours on low.', timerMinutes: 120 },
          { id: 's4', stepNumber: 4, text: 'Prepare besciamella sauce with butter, flour, warm milk, and fresh nutmeg.', timerMinutes: 7 },
          { id: 's5', stepNumber: 5, text: 'Layer ragù, sheets, besciamella, and cheese. Bake at 375°F for 38 mins.', timerMinutes: 38 }
        ],
        familyStory: "Nonna Rosa made this every Sunday. Simmer the ragù low and slow, and rest 20 minutes before serving.",
        secretTips: "A pinch of nutmeg in the besciamella elevates the whole dish.",
        tags: ['Pasta', 'Comfort Food', 'Sunday Dinner', 'Slow Cooked'],
        isFavorite: true,
        sharedWith: ['Nonna Rosa', 'Papa Marco', 'Auntie Fatima'],
        createdAt: '2024-03-12T10:30:00Z',
        authorId: 'usr_rosa'
      },
      {
        id: 'rec_apple_pie_02',
        title: "Grandma Clara's Brown Butter Apple Pie",
        description: "Flaky hand-crimped lattice butter crust filled with spiced Honeycrisp apples, rich browned butter, and a hint of apple cider caramel.",
        imageUrl: '/src/assets/images/recipe_apple_pie_grandma_1793898159138.jpg',
        category: 'Desserts & Sweets',
        prepTimeMinutes: 40,
        cookTimeMinutes: 55,
        servings: 8,
        difficulty: 'Moderate',
        passedDownBy: 'Grandma Clara',
        passedDownYear: '1954',
        originLocation: 'Woodstock, Vermont',
        ingredients: [
          { id: 'i20', name: 'All-purpose unbleached flour', amount: '2.5', unit: 'cups' },
          { id: 'i21', name: 'Cold butter, cubed', amount: '1', unit: 'cup' },
          { id: 'i22', name: 'Honeycrisp apples, peeled & sliced', amount: '3', unit: 'lbs' },
          { id: 'i23', name: 'Browned unsalted butter', amount: '3', unit: 'tbsp' },
          { id: 'i24', name: 'Dark brown sugar', amount: '0.5', unit: 'cup' },
          { id: 'i25', name: 'Ground cinnamon', amount: '1.5', unit: 'tsp' }
        ],
        instructions: [
          { id: 's20', stepNumber: 1, text: 'Cut butter into flour, add ice vinegar water, form dough disc and chill 1 hr.', timerMinutes: 60 },
          { id: 's21', stepNumber: 2, text: 'Toss apples with browned butter, sugar, spices, and pinch of salt.', timerMinutes: 10 },
          { id: 's22', stepNumber: 3, text: 'Roll bottom crust into pie dish, fill with apples, weave top lattice ribbon.', timerMinutes: 15 },
          { id: 's23', stepNumber: 4, text: 'Brush with cream and bake until bubbly and golden brown.', timerMinutes: 55 }
        ],
        familyStory: "Grandma Clara baked this every Thanksgiving using orchard apples.",
        secretTips: "Brush lattice with heavy cream and coarse turbinado sugar before baking.",
        tags: ['Baking', 'Thanksgiving', 'Fall Favorite', 'Pastry'],
        isFavorite: true,
        sharedWith: ['Grandma Clara', 'Nonna Rosa'],
        createdAt: '2024-04-02T14:15:00Z',
        authorId: 'usr_rosa'
      },
      {
        id: 'rec_biryani_03',
        title: "Auntie Fatima's Royal Chicken Dum Biryani",
        description: "Marinated bone-in chicken infused with ginger, garlic, yogurt, and whole spices, sealed under fragrant saffron-steeped aged basmati rice.",
        imageUrl: '/src/assets/images/recipe_chicken_biryani_1793898160064.jpg',
        category: 'Holiday Feasts',
        prepTimeMinutes: 50,
        cookTimeMinutes: 45,
        servings: 6,
        difficulty: 'Heirloom Secret',
        passedDownBy: 'Auntie Fatima',
        passedDownYear: '1972',
        originLocation: 'Lahore, Punjab',
        ingredients: [
          { id: 'i40', name: 'Bone-in chicken thighs', amount: '2', unit: 'lbs' },
          { id: 'i41', name: 'Aged long-grain Basmati rice', amount: '2.5', unit: 'cups' },
          { id: 'i42', name: 'Crispy fried onions (birista)', amount: '1.5', unit: 'cups' },
          { id: 'i43', name: 'Plain Greek yogurt', amount: '0.75', unit: 'cup' },
          { id: 'i44', name: 'Saffron threads in warm milk', amount: '1', unit: 'pinch' },
          { id: 'i45', name: 'Pure desi ghee', amount: '3', unit: 'tbsp' }
        ],
        instructions: [
          { id: 's40', stepNumber: 1, text: 'Marinate chicken in spiced yogurt, ginger-garlic paste, and fried onions for 2 hours.', timerMinutes: 120 },
          { id: 's41', stepNumber: 2, text: 'Par-boil soaked basmati rice with whole aromatics until 70% tender.', timerMinutes: 6 },
          { id: 's42', stepNumber: 3, text: 'Layer chicken at bottom, parboiled rice on top with saffron, ghee, and herbs.', timerMinutes: 5 },
          { id: 's43', stepNumber: 4, text: 'Seal pot tightly with lid/foil and cook on dum for 25 minutes on lowest heat.', timerMinutes: 25 },
          { id: 's44', stepNumber: 5, text: 'Rest 10 minutes, fluff gently with a saucer, and serve with cucumber raita.', timerMinutes: 10 }
        ],
        familyStory: "Auntie Fatima served this for Eid celebrations and weddings.",
        secretTips: "Never stir with a spoon; gently fluff from bottom with a flat plate to keep grains long.",
        tags: ['Rice', 'Spices', 'Celebration', 'Eid Special', 'Chicken'],
        isFavorite: true,
        sharedWith: ['Auntie Fatima', 'Papa Marco'],
        createdAt: '2024-05-18T16:40:00Z',
        authorId: 'usr_rosa'
      },
      {
        id: 'rec_focaccia_04',
        title: "Papa Marco's Rosemary & Sea Salt Focaccia",
        description: "High-hydration slow-fermented Italian flatbread with a crisp olive oil golden crust, pillowy crumb, blistered cherry tomatoes, and flaky sea salt.",
        imageUrl: '/src/assets/images/recipe_sourdough_focaccia_1793898160466.jpg',
        category: 'Breads & Baking',
        prepTimeMinutes: 25,
        cookTimeMinutes: 28,
        servings: 10,
        difficulty: 'Easy',
        passedDownBy: 'Papa Marco',
        passedDownYear: '1988',
        originLocation: 'Bari, Italy',
        ingredients: [
          { id: 'i60', name: 'Strong bread flour', amount: '500', unit: 'g' },
          { id: 'i61', name: 'Lukewarm water (80% hydration)', amount: '400', unit: 'ml' },
          { id: 'i62', name: 'Active dry yeast', amount: '7', unit: 'g' },
          { id: 'i63', name: 'Extra virgin olive oil', amount: '0.33', unit: 'cup' },
          { id: 'i64', name: 'Fresh rosemary and cherry tomatoes', amount: '1', unit: 'cup' },
          { id: 'i65', name: 'Maldon flaky sea salt', amount: '1.5', unit: 'tsp' }
        ],
        instructions: [
          { id: 's60', stepNumber: 1, text: 'Mix shaggy wet dough, rest 20 mins, do 3 stretch and folds, cold ferment overnight.', timerMinutes: 60 },
          { id: 's61', stepNumber: 2, text: 'Transfer to oiled baking pan and proof 2 hours until bubbly.', timerMinutes: 120 },
          { id: 's62', stepNumber: 3, text: 'Dimple deeply with oiled fingers, top with rosemary, tomatoes, and sea salt.', timerMinutes: 5 },
          { id: 's63', stepNumber: 4, text: 'Bake at 425°F for 26 minutes until golden and hollow when tapped.', timerMinutes: 26 }
        ],
        familyStory: "Papa Marco made this whenever family gathered for summer dinners.",
        secretTips: "Be generous with olive oil in the pan so the bottom crust gets shatteringly crisp.",
        tags: ['Bread', 'Italian', 'Baking', 'Vegan Friendly', 'Appetizer'],
        isFavorite: false,
        sharedWith: ['Papa Marco', 'Nonna Rosa'],
        createdAt: '2024-06-20T09:00:00Z',
        authorId: 'usr_rosa'
      }
    ]
  });
});

app.post('/api/recipes', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.title) {
      return res.status(400).json({ error: 'Recipe title is required' });
    }

    if (process.env.SQL_HOST) {
      const inserted = await db.insert(recipes).values({
        userId: data.authorId || 'usr_default',
        title: data.title,
        description: data.description || '',
        imageUrl: data.imageUrl || '/src/assets/images/recipe_lasagna_heirloom_1793898158537.jpg',
        category: data.category || 'Heirloom Classics',
        prepTimeMinutes: Number(data.prepTimeMinutes) || 30,
        cookTimeMinutes: Number(data.cookTimeMinutes) || 45,
        servings: Number(data.servings) || 6,
        difficulty: data.difficulty || 'Moderate',
        passedDownBy: data.passedDownBy || 'Family',
        passedDownYear: data.passedDownYear || '',
        originLocation: data.originLocation || '',
        ingredients: JSON.stringify(data.ingredients || []),
        instructions: JSON.stringify(data.instructions || []),
        familyStory: data.familyStory || '',
        secretTips: data.secretTips || '',
        tags: JSON.stringify(data.tags || []),
        isFavorite: Boolean(data.isFavorite),
        sharedWith: JSON.stringify(data.sharedWith || []),
      }).returning();

      return res.json({ success: true, recipe: inserted[0] });
    }

    return res.json({ success: true, message: 'Saved in local mode', recipe: data });
  } catch (error: any) {
    console.error('Failed to create recipe:', error);
    return res.status(500).json({ error: 'Failed to create recipe in database' });
  }
});

app.put('/api/recipes/:id/favorite', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { isFavorite } = req.body;
    if (process.env.SQL_HOST && !isNaN(id)) {
      await db.update(recipes).set({ isFavorite: Boolean(isFavorite) }).where(eq(recipes.id, id));
    }
    return res.json({ success: true });
  } catch (err) {
    console.error('Failed to update favorite:', err);
    return res.status(500).json({ error: 'Failed to update' });
  }
});

app.delete('/api/recipes/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (process.env.SQL_HOST && !isNaN(id)) {
      await db.delete(recipes).where(eq(recipes.id, id));
    }
    return res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete recipe:', err);
    return res.status(500).json({ error: 'Failed to delete' });
  }
});

// Mount Vite in dev mode
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RecipeBook server running on port ${PORT}`);
  });
}

startServer();
