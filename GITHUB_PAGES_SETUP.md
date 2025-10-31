# 📚 GitHub Pages Setup Guide

Follow these steps to publish your Snake Game on GitHub Pages:

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name:** `snake-game` (or any name you prefer)
   - **Description:** "Modern Snake Game with multiple modes"
   - **Visibility:** Choose Public (required for free GitHub Pages)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 2: Connect Your Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these commands in your terminal:

```bash
# Add the GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/snake-game.git

# Rename your branch to 'main' (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

**Example:**
If your GitHub username is `johndoe`, the command would be:
```bash
git remote add origin https://github.com/johndoe/snake-game.git
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **"Settings"** (top menu)
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Source"**, select:
   - **Branch:** `main` (or `master`)
   - **Folder:** `/ (root)`
5. Click **"Save"**

## Step 4: Access Your Published Game

GitHub will provide you with a URL. Your game will be available at:
```
https://YOUR_USERNAME.github.io/snake-game/
```

**Note:** It may take a few minutes (2-10 minutes) for the page to be available after enabling.

## 🔄 Future Updates

Whenever you make changes to your game:

```bash
# Stage your changes
git add .

# Commit with a message
git commit -m "Your commit message here"

# Push to GitHub
git push
```

GitHub Pages will automatically update within a few minutes!

## 🐛 Troubleshooting

- **Page not loading?** Wait 5-10 minutes after enabling, then refresh
- **404 error?** Make sure your repository is Public (free GitHub Pages requires public repos)
- **Files not showing?** Ensure `index.html` is in the root directory
- **Wrong URL?** Check Settings > Pages to see the correct URL

## 📝 Notes

- Your game will be publicly accessible once published
- You can add a custom domain later if you want
- GitHub Pages is free for public repositories
- Updates are automatic after you push changes

Enjoy sharing your Snake Game! 🎮

