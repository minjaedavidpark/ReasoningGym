import type { NextApiRequest, NextApiResponse } from 'next';
import { callLLM } from '@/lib/llmClient';

interface VisualizeRequest {
  problem: string;
  problemType?: 'equation' | 'graph' | 'geometry' | 'number_line' | 'function' | 'generic';
}

interface VisualizeResponse {
  videoUrl?: string;
  videoId?: string;
  error?: string;
  manimData?: any;
}

const MANIM_SERVICE_URL = process.env.MANIM_SERVICE_URL || 'http://localhost:5001';

/**
 * Extract visualization parameters from problem using LLM
 */
async function extractVisualizationParams(problem: string): Promise<any> {
  const systemPrompt = `You are a helpful assistant that analyzes math problems and extracts visualization parameters.

Given a math problem, determine:
1. The type of visualization needed (equation, graph, geometry, number_line, function, or generic)
2. Specific parameters for that visualization

Respond with a JSON object containing:
- type: the visualization type
- content: brief description
- equation: (for equation type) the main equation as LaTeX
- steps: (for equation type) array of solution steps as LaTeX
- function: (for graph/function type) the function as Python expression (e.g., "x**2")
- shapes: (for geometry type) array of shape objects
- points: (for number_line type) array of point objects with value and label
- start, end: (for number_line type) range values

Example for equation: {"type": "equation", "equation": "x^2 + 2x + 1 = 0", "steps": ["x^2 + 2x + 1 = 0", "(x + 1)^2 = 0", "x = -1"]}
Example for graph: {"type": "graph", "function": "x**2", "content": "Parabola"}`;

  try {
    const response = await callLLM(
      systemPrompt,
      [
        {
          role: 'user',
          content: `Extract visualization parameters from this problem:\n\n${problem}`,
        },
      ],
      { temperature: 0.3 }
    );

    // Try to parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback to generic
    return {
      type: 'generic',
      content: problem.slice(0, 200),
    };
  } catch (error) {
    console.error('Error extracting visualization params:', error);
    return {
      type: 'generic',
      content: problem.slice(0, 200),
    };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VisualizeResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { problem, problemType }: VisualizeRequest = req.body;

    console.log('[Visualize API] Received request');
    console.log('[Visualize API] Problem:', problem?.substring(0, 100));
    console.log('[Visualize API] Problem type:', problemType);

    if (!problem) {
      console.log('[Visualize API] ERROR: No problem provided');
      return res.status(400).json({ error: 'Problem is required' });
    }

    // Extract visualization parameters using LLM
    console.log('[Visualize API] Extracting visualization parameters...');
    const manimData = await extractVisualizationParams(problem);
    console.log('[Visualize API] Extracted params:', JSON.stringify(manimData));

    // Override type if specified
    if (problemType) {
      manimData.type = problemType;
    }

    // Call Manim service
    console.log('[Visualize API] Calling Manim service at:', MANIM_SERVICE_URL);
    console.log('[Visualize API] Sending data:', JSON.stringify(manimData));

    const manimResponse = await fetch(`${MANIM_SERVICE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(manimData),
    });

    console.log('[Visualize API] Manim response status:', manimResponse.status);

    if (!manimResponse.ok) {
      const errorData = await manimResponse.json();
      console.log('[Visualize API] ERROR from Manim service:', errorData);
      return res.status(500).json({
        error: 'Failed to generate visualization',
        manimData,
        details: errorData.details || errorData.error,
      });
    }

    const result = await manimResponse.json();
    console.log('[Visualize API] SUCCESS! Video ID:', result.video_id);

    return res.status(200).json({
      videoUrl: `${MANIM_SERVICE_URL}${result.video_url}`,
      videoId: result.video_id,
      manimData,
    });
  } catch (error) {
    console.error('[Visualize API] EXCEPTION:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
