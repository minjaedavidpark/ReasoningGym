#!/usr/bin/env python3
"""
Test script to verify Manim visualization is working
"""
import requests
import json
import sys

MANIM_SERVICE_URL = "http://localhost:5001"

def test_health():
    """Test if service is running"""
    print("1. Testing service health...")
    try:
        response = requests.get(f"{MANIM_SERVICE_URL}/health")
        if response.status_code == 200:
            print("   ✅ Service is running")
            return True
        else:
            print(f"   ❌ Service returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Cannot connect to service: {e}")
        return False

def test_generic_visualization():
    """Test generic (text-based) visualization"""
    print("\n2. Testing generic visualization (no LaTeX required)...")
    try:
        response = requests.post(
            f"{MANIM_SERVICE_URL}/generate",
            json={
                "type": "generic",
                "content": "This is a test problem"
            },
            timeout=30
        )

        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Generic visualization works!")
            print(f"   Video ID: {result.get('video_id')}")
            return True
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            print(f"   Error: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_equation_visualization():
    """Test equation visualization (requires LaTeX)"""
    print("\n3. Testing equation visualization (requires LaTeX + packages)...")
    try:
        response = requests.post(
            f"{MANIM_SERVICE_URL}/generate",
            json={
                "type": "equation",
                "equation": "x + 1 = 0",
                "steps": ["x + 1 = 0", "x = -1"]
            },
            timeout=60
        )

        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Equation visualization works!")
            print(f"   Video ID: {result.get('video_id')}")
            return True
        else:
            result = response.json()
            error_msg = result.get('error', 'Unknown error')
            details = result.get('details', '')
            print(f"   ❌ Failed: {error_msg}")

            # Check for specific LaTeX errors
            if 'preview.sty' in details:
                print("\n   📦 Missing LaTeX package detected!")
                print("   Run: sudo tlmgr install preview")
            elif 'standalone.cls' in details:
                print("\n   📦 Missing LaTeX package detected!")
                print("   Run: sudo tlmgr install standalone")
            elif 'latex error' in details.lower():
                print("\n   📦 LaTeX error detected. You may need additional packages.")
                print("   Run: sudo tlmgr install standalone babel etoolbox xkeyval preview")

            if len(details) > 0:
                print(f"\n   Details: {details[:300]}")

            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    print("=" * 60)
    print("Manim Visualization Test Suite")
    print("=" * 60)

    results = []

    # Run tests
    results.append(("Service Health", test_health()))
    results.append(("Generic Visualization", test_generic_visualization()))
    results.append(("Equation Visualization", test_equation_visualization()))

    # Print summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)

    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")

    all_passed = all(result[1] for result in results)

    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 All tests passed! Visualization is ready to use.")
    else:
        print("⚠️  Some tests failed. See errors above for details.")
    print("=" * 60)

    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
