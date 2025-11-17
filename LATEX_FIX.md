# Fix LaTeX Packages for Manim

## The Problem

You're seeing the error: `File 'standalone.cls' not found`

This means your LaTeX installation is missing some required packages for Manim.

## The Solution

Run these two commands in your terminal:

```bash
sudo tlmgr update --self
sudo tlmgr install standalone babel etoolbox xkeyval
```

Enter your password when prompted.

## Explanation

- `tlmgr` is the TeX Live package manager
- `standalone` is a LaTeX document class used by Manim
- `babel`, `etoolbox`, and `xkeyval` are dependencies

## Testing

After installing, restart the Manim service:

```bash
cd manim-service
pkill -f "python.*api.py"
./start.sh
```

Then try generating a visualization again!

## Alternative: Use Basic LaTeX Template

If you don't want to install packages, Manim can work with a minimal setup, but equation rendering will be limited.
