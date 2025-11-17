import type { NextApiRequest, NextApiResponse } from 'next';
import { callLLM } from '@/lib/llmClient';

interface GenerateCodeRequest {
  problem: string;
}

interface GenerateCodeResponse {
  code?: string;
  error?: string;
  explanation?: string;
}

/**
 * Use AI to generate Manim code for visualizing any problem
 */
async function generateManimCode(problem: string): Promise<{ code: string; explanation: string }> {
  const systemPrompt = `You are an expert in creating Manim (Mathematical Animation Engine) visualizations.

Your task is to generate Python code using Manim that visualizes the given problem in an educational and engaging way.

REQUIREMENTS:
1. Create a class called "GeneratedScene" that inherits from Scene
2. Implement the construct() method with the visualization logic
3. Use appropriate Manim objects: Text, MathTex, Circle, Square, Line, Dot, Graph, Axes, etc.
4. Add smooth animations with self.play() and self.wait()
5. Make it visually clear and educational
6. Include labels, colors, and step-by-step progression
7. Keep the total animation under 30 seconds

IMPORTANT CODE STRUCTURE:
\`\`\`python
from manim import *
import numpy as np

class GeneratedScene(Scene):
    def construct(self):
        # Your visualization code here
        # Use self.play() for animations
        # Use self.wait() for pauses
        # Create engaging step-by-step visualizations
\`\`\`

EXAMPLES OF GOOD VISUALIZATIONS:

For sorting:
- Show array as rectangles with heights
- Animate comparisons and swaps
- Highlight elements being compared
- Show final sorted state

For graph algorithms:
- Draw nodes as circles with labels
- Draw edges as lines with weights
- Animate the algorithm's path
- Highlight visited nodes

For TSP:
- Show cities as labeled dots
- Draw all edges with distances
- Animate trying different paths
- Highlight optimal path in green

For equations:
- Show the equation
- Animate step-by-step solving
- Transform between steps

Respond with:
1. The complete Python code (inside \`\`\`python code blocks)
2. A brief explanation of what the visualization shows

Be creative and make it educational!`;

  try {
    const response = await callLLM(
      systemPrompt,
      [{ role: 'user', content: `Generate a Manim visualization for this problem:\n\n${problem}` }],
      {
        temperature: 0.7,
        maxTokens: 2000,
      }
    );

    // Extract code from markdown code blocks
    const codeMatch = response.match(/```python\n([\s\S]*?)\n```/);
    if (!codeMatch) {
      throw new Error('No Python code found in response');
    }

    const code = codeMatch[1];

    // Extract explanation (text after the code block)
    const parts = response.split('```');
    const explanation = parts[parts.length - 1].trim() || 'Visualization generated';

    // Comprehensive safety checks
    const dangerousPatterns = [
      { pattern: /import\s+os/i, message: 'Code contains os import' },
      { pattern: /import\s+sys/i, message: 'Code contains sys import' },
      { pattern: /import\s+subprocess/i, message: 'Code contains subprocess import' },
      { pattern: /import\s+socket/i, message: 'Code contains socket import' },
      { pattern: /import\s+requests/i, message: 'Code contains requests import' },
      { pattern: /import\s+urllib/i, message: 'Code contains urllib import' },
      { pattern: /import\s+pickle/i, message: 'Code contains pickle import' },
      { pattern: /\bopen\s*\(/i, message: 'Code contains file open operation' },
      { pattern: /\beval\s*\(/i, message: 'Code contains eval operation' },
      { pattern: /\bexec\s*\(/i, message: 'Code contains exec operation' },
      { pattern: /\b__import__\s*\(/i, message: 'Code contains __import__ operation' },
      { pattern: /\bcompile\s*\(/i, message: 'Code contains compile operation' },
      { pattern: /\bglobals\s*\(/i, message: 'Code contains globals access' },
      { pattern: /\blocals\s*\(/i, message: 'Code contains locals access' },
      { pattern: /\bdelattr\s*\(/i, message: 'Code contains delattr operation' },
      { pattern: /\bsetattr\s*\(/i, message: 'Code contains setattr operation' },
    ];

    for (const { pattern, message } of dangerousPatterns) {
      if (pattern.test(code)) {
        console.error('[Safety Check Failed]', message);
        throw new Error(`Generated code contains potentially unsafe operations: ${message}`);
      }
    }

    // Verify the code contains required GeneratedScene class
    if (!code.includes('class GeneratedScene')) {
      throw new Error('Generated code must contain a GeneratedScene class');
    }

    // Verify the code imports from manim
    if (!code.includes('from manim import')) {
      throw new Error('Generated code must import from manim');
    }

    console.log('[Safety Check] All safety checks passed');

    return { code, explanation };
  } catch (error) {
    console.error('Error generating Manim code:', error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateCodeResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { problem }: GenerateCodeRequest = req.body;

    console.log('[Generate Manim Code] Received request for problem:', problem?.substring(0, 100));

    if (!problem) {
      return res.status(400).json({ error: 'Problem is required' });
    }

    const { code, explanation } = await generateManimCode(problem);

    console.log('[Generate Manim Code] Generated code length:', code.length);
    console.log('[Generate Manim Code] Explanation:', explanation);

    return res.status(200).json({
      code,
      explanation,
    });
  } catch (error) {
    console.error('[Generate Manim Code] Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to generate code',
    });
  }
}
