#!/bin/bash

# Activate virtual environment and start Flask server
cd "$(dirname "$0")"

# Add LaTeX to PATH (required for Manim)
export PATH="/Library/TeX/texbin:$PATH"

source venv/bin/activate
python api.py
