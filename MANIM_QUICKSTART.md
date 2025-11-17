# Manim Visualization Quick Start

This guide will help you get the Manim visualization feature up and running in 5 minutes.

## What You'll Get

Mathematical visualizations like 3Blue1Brown's videos for problems in ReasoningGym!

## Quick Setup

### Step 1: Install LaTeX (One-time)

**macOS:**

```bash
brew install --cask mactex-no-gui
```

**Ubuntu/Debian:**

```bash
sudo apt-get install texlive texlive-latex-extra
```

This takes a few minutes but you only need to do it once.

**After installing LaTeX, install required packages:**

```bash
sudo tlmgr update --self
sudo tlmgr install standalone babel etoolbox xkeyval preview
```

### Step 2: Start the Manim Service

Open a new terminal and run:

```bash
cd manim-service
./start.sh
```

You should see:

```
* Running on http://127.0.0.1:5001
```

Keep this terminal open!

### Step 3: Add Environment Variable

Add to your `.env.local` file:

```bash
MANIM_SERVICE_URL=http://localhost:5001
```

### Step 4: Restart Next.js

In your main terminal:

```bash
# Stop the dev server (Ctrl+C)
npm run dev
```

## Test It Out

1. Go to http://localhost:3000/coach
2. Enter a math problem (e.g., "Solve x² + 5x + 6 = 0")
3. Click "Start Coaching Session"
4. Look for the "🎬 Generate Visualization" button
5. Click it and wait ~10-20 seconds
6. Watch your animated visualization!

## Troubleshooting

### "LaTeX not found" error

Make sure you installed LaTeX (Step 1) and restart your terminal.

### "Connection refused" error

The Manim service isn't running. Run `./start.sh` in the `manim-service` directory.

### "Generate Visualization" button doesn't appear

Check that `MANIM_SERVICE_URL=http://localhost:5001` is in your `.env.local` file and you've restarted the Next.js dev server.

### Videos take too long

First video generation is slower (~30s). Subsequent ones are faster (~10-15s).

## What Problems Work Best?

- ✅ Algebra equations
- ✅ Calculus functions
- ✅ Geometry problems
- ✅ Graph plotting
- ❌ Pure text/theory questions (will show generic visualization)

## Skipping Manim

Don't want visualizations? Just skip these steps entirely - the app works great without them!

## Next Steps

Check out [manim-service/README.md](manim-service/README.md) for:

- Advanced configuration
- Adding custom visualization types
- API documentation
- Production deployment tips
