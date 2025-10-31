# 🚀 Complete Setup Instructions for GitHub Pages

## Step 1: Create GitHub Repository

1. **Go to GitHub:** https://github.com
2. **Sign in** to your account
3. **Click the "+" icon** (top right corner)
4. **Select "New repository"**

5. **Fill in the details:**
   - **Repository name:** `snake-game` (must be exactly this)
   - **Description:** "Modern Snake Game" (optional)
   - **Visibility:** ✅ **Public** (required for free GitHub Pages)
   - **❌ DO NOT check:**
     - ☐ Add a README file
     - ☐ Add .gitignore
     - ☐ Choose a license
   
   (We already have these files)

6. **Click "Create repository"**

## Step 2: Push Your Code to GitHub

After creating the repository, run these commands in your terminal:

```bash
# Check if remote is already set (run this first)
git remote -v

# If it shows "origin", remove it first:
git remote remove origin

# Add the correct remote (replace if repository name is different)
git remote add origin https://github.com/gaurya97/snake-game.git

# Check your current branch name
git branch

# Push to GitHub (use 'master' if that's your branch name)
git push -u origin master
```

**OR if your branch is named `main`:**

```bash
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. **Go to your repository:** https://github.com/gaurya97/snake-game
2. **Click "Settings"** (top menu, far right)
3. **Click "Pages"** in the left sidebar
4. **Under "Source":**
   - **Branch:** Select `master` (or `main` if that's your branch)
   - **Folder:** Select `/ (root)`
5. **Click "Save"**

## Step 4: Wait and Access

- ⏰ **Wait 5-10 minutes** for GitHub Pages to deploy
- 🌐 Your site will be available at: **https://gaurya97.github.io/snake-game/**

## 🔍 Verify Repository Name

Make sure your repository is named exactly: **snake-game**

Check by going to: https://github.com/gaurya97/snake-game

If it says "404" on GitHub, the repository doesn't exist yet - create it first!

## ❓ Troubleshooting

**Error: "Repository not found"**
- Repository doesn't exist on GitHub yet
- Create it first using Step 1
- Or check the repository name/spelling

**Error: "Permission denied"**
- Make sure you're logged into GitHub
- Check your GitHub username is correct: `gaurya97`

**404 Error on GitHub Pages**
- Wait 10 minutes after enabling
- Make sure repository is **Public**
- Make sure `index.html` is in root directory
- Check branch name matches in Pages settings

## ✅ Checklist

- [ ] Repository created on GitHub
- [ ] Repository is Public
- [ ] Files pushed to GitHub (`git push`)
- [ ] GitHub Pages enabled in Settings
- [ ] Correct branch selected (master or main)
- [ ] `/ (root)` folder selected
- [ ] Waited 5-10 minutes

Once all checked, your game will be live! 🎮

