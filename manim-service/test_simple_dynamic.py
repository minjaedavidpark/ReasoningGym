#!/usr/bin/env python3
"""
Simple test for dynamic generation
"""
import requests
import json

MANIM_SERVICE_URL = "http://localhost:5001"

# Very simple test code
test_code = """from manim import *

class GeneratedScene(Scene):
    def construct(self):
        text = Text("Hello from AI!", font_size=48)
        self.play(Write(text))
        self.wait(1)
"""

print("Testing simple dynamic generation...")
print(f"Code:\n{test_code}\n")

try:
    response = requests.post(
        f"{MANIM_SERVICE_URL}/generate-dynamic",
        json={"code": test_code},
        timeout=90
    )

    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:500]}")

except Exception as e:
    print(f"Error: {e}")
