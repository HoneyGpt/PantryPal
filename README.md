# 🍳 PantryPal

Turn whatever ingredients you have into real, safe recipes using AI. PantryPal is a modern web application that helps you discover delicious recipes based on ingredients you already have in your kitchen.

## ✨ Features

- **🤖 AI-Powered Recipe Generation**: Get creative recipes based on your available ingredients
- **🎨 Beautiful, Minimal Design**: Clean interface with soft colors and playful animations
- **📱 Mobile-First**: Works perfectly on all devices
- **🍽️ Dietary Filters**: Vegetarian, Vegan, Gluten-Free, and Halal options
- **💾 Save & Share**: Save your favorite recipes and share them with friends
- **⏱️ Quick & Easy**: Get recipe suggestions in seconds

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see PantryPal in action.

## 🛠️ Technology Stack

- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Utility-first CSS framework
- **🧩 shadcn/ui** - High-quality, accessible components
- **🎯 Lucide React** - Beautiful icon library
- **🤖 OpenAI** - AI-powered recipe generation
- **🔐 NextAuth.js** - Authentication (ready for future features)

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes for recipe generation
│   ├── page.tsx        # Main PantryPal interface
│   └── layout.tsx      # Root layout
├── components/         # Reusable React components
│   └── ui/            # shadcn/ui components
└── lib/               # Utility functions and configurations
```

## 🎯 How It Works

1. **Enter Ingredients**: Type or paste the ingredients you have available
2. **Apply Filters** (Optional): Select dietary preferences
3. **Generate Recipes**: Click "Generate Recipe" to get AI-powered suggestions
4. **View Details**: Click any recipe card to see full instructions, ingredients, and substitutions
5. **Save & Share**: Save your favorites and share with friends

## 🔧 Configuration

To use the AI recipe generation, you'll need to set up your OpenAI API key:

1. Create a `.env.local` file in the root directory
2. Add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## 🌟 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ for home cooks everywhere. 🍳✨