#!/usr/bin/env python3
"""
Test AI-powered Manim visualization generation
"""
import requests
import json
import sys

MANIM_SERVICE_URL = "http://localhost:5001"

def test_dynamic_generation():
    """Test the AI-powered dynamic code generation"""
    print("=" * 60)
    print("Testing AI-Powered Manim Visualization")
    print("=" * 60)

    # Sample Manim code for testing (simulates AI-generated code)
    test_code = """from manim import *
import numpy as np

class GeneratedScene(Scene):
    def construct(self):
        # Title
        title = Text("Traveling Salesman Problem", font_size=48)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        # Create cities
        cities = [
            {"name": "A", "pos": [-3, 1, 0]},
            {"name": "B", "pos": [2, 2, 0]},
            {"name": "C", "pos": [3, -1, 0]},
            {"name": "D", "pos": [-1, -2, 0]},
        ]

        city_dots = VGroup()
        city_labels = VGroup()

        for city in cities:
            dot = Dot(point=city["pos"], radius=0.15, color=BLUE)
            label = Text(city["name"], font_size=30).next_to(dot, UP)
            city_dots.add(dot)
            city_labels.add(label)

        self.play(
            *[GrowFromCenter(dot) for dot in city_dots],
            *[Write(label) for label in city_labels]
        )
        self.wait(1)

        # Show distances
        edges = VGroup()
        for i in range(len(cities)):
            for j in range(i + 1, len(cities)):
                line = Line(cities[i]["pos"], cities[j]["pos"], color=GRAY, stroke_width=2)
                edges.add(line)

        self.play(Create(edges))
        self.wait(1)

        # Highlight optimal path
        path_indices = [0, 1, 2, 3, 0]  # A -> B -> C -> D -> A
        path_lines = VGroup()

        for i in range(len(path_indices) - 1):
            start = cities[path_indices[i]]["pos"]
            end = cities[path_indices[i + 1]]["pos"]
            path_line = Line(start, end, color=GREEN, stroke_width=6)
            path_lines.add(path_line)

        self.play(
            edges.animate.set_opacity(0.3),
            *[Create(line) for line in path_lines]
        )

        # Add "Optimal Path" text
        result = Text("Optimal Path Found!", font_size=36, color=GREEN)
        result.to_edge(DOWN)
        self.play(Write(result))
        self.wait(2)
"""

    print("\n1. Testing /generate-dynamic endpoint...")
    print(f"   Code length: {len(test_code)} characters")

    try:
        response = requests.post(
            f"{MANIM_SERVICE_URL}/generate-dynamic",
            json={"code": test_code},
            timeout=90
        )

        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Video generated successfully!")
            print(f"   Video ID: {result.get('video_id')}")
            print(f"   Video URL: {result.get('video_url')}")
            print(f"   File path: {result.get('file_path')}")
            return True
        else:
            error_data = response.json()
            print(f"   ❌ Failed with status {response.status_code}")
            print(f"   Error: {error_data.get('error')}")
            print(f"   Details: {error_data.get('details', '')[:300]}")
            return False

    except requests.Timeout:
        print(f"   ❌ Request timed out (>90s)")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    print("\n🚀 Starting AI-Powered Manim Test\n")

    # Test service health
    try:
        health = requests.get(f"{MANIM_SERVICE_URL}/health")
        if health.status_code == 200:
            print("✅ Manim service is running\n")
        else:
            print("❌ Manim service not healthy")
            return 1
    except:
        print("❌ Cannot connect to Manim service")
        print("   Make sure it's running: cd manim-service && ./start.sh")
        return 1

    # Run test
    success = test_dynamic_generation()

    print("\n" + "=" * 60)
    if success:
        print("🎉 Test Passed! AI-powered visualization is working!")
    else:
        print("⚠️  Test Failed. Check errors above.")
    print("=" * 60 + "\n")

    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
