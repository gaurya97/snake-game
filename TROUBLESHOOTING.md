# 🔧 GitHub Pages 404 Error - Troubleshooting Guide

If you're getting a "404 Not Found" error on your GitHub Pages site, follow these steps:

## ✅ Step 1: Verify Repository Settings

1. Go to your repository: https://github.com/gaurya97/snake-game
2. Click on **"Settings"** (top menu)
3. Scroll down to **"Pages"** in the left sidebar
4. Check the settings:
   - **Source:** Should be set to a branch (main or master)
   - **Branch:** Select `main` (or `master` if that's your branch name)
   - **Folder:** Select `/ (root)`
   - Click **"Save"**

## ✅ Step 2: Check Repository Visibility

GitHub Pages (free tier) only works with **Public** repositories:

1. Go to repository **Settings**
2. Scroll down to **"Danger Zone"**
3. Make sure your repository is set to **"Public"**
4. If it's Private, change it to Public

## ✅ Step 3: Verify Files are Pushed

Make sure all files are pushed to GitHub:

```bash
# Check if remote is connected
git remote -v

# If no remote, add it:
git remote add origin https://github.com/gaurya97/snake-game.git

# Check current branch
git branch

# Push to GitHub
git push -u origin main
```

**Note:** If your branch is named `master` instead of `main`, use:
```bash
git push -u origin master
```

## ✅ Step 4: Verify index.html Location

Make sure `index.html` is in the **root** of your repository, not in a subfolder.

Your repository structure should look like:
```
snake-game/
  ├── index.html
  ├── index.css
  ├── index.js
  ├── README.md
  └── (other files)
```

## ✅ Step 5: Wait for Deployment

After enabling GitHub Pages:
- **First time:** Can take 5-10 minutes
- **Updates:** Usually 1-3 minutes

You can check deployment status:
1. Go to repository → **"Actions"** tab
2. Look for "Pages build and deployment" workflow

## ✅ Step 6: Check Repository Name

The URL is: `https://gaurya97.github.io/snake-game/`

Make sure:
- Your GitHub username is: `gaurya97`
- Your repository name is exactly: `snake-game`
- Both are case-sensitive!

## ✅ Step 7: Verify Branch Name

1. Go to repository → **Settings → Pages**
2. Make sure you selected the correct branch:
   - If your branch is `main` → select `main`
   - If your branch is `master` → select `master`

## 🔄 Quick Fix Commands

If you haven't pushed your code yet:

```bash
# Check current branch name
git branch

# If branch is 'master', rename to 'main'
git branch -M main

# Add remote (if not already added)
git remote add origin https://github.com/gaurya97/snake-game.git

# Push to GitHub
git push -u origin main

# If it's 'master' branch
git push -u origin master
```

## 🐛 Common Issues

**Issue 1:** Repository is Private
- **Solution:** Make it Public in Settings

**Issue 2:** Wrong branch selected in Pages settings
- **Solution:** Select the branch where your files are (main or master)

**Issue 3:** Files not pushed to GitHub
- **Solution:** Push your code: `git push -u origin main`

**Issue 4:** Wrong repository name in URL
- **Solution:** Check repository name matches URL exactly

**Issue 5:** index.html in wrong location
- **Solution:** Move index.html to root directory

## 📞 Still Not Working?

If after trying all these steps it still doesn't work:

1. Double-check the repository URL matches: `https://github.com/gaurya97/snake-game`
2. Wait 10-15 minutes after enabling Pages
3. Try accessing with a different browser or incognito mode
4. Check browser console for errors (F12)

