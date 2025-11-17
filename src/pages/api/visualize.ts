import type { NextApiRequest, NextApiResponse } from 'next';

interface VisualizeRequest {
  problem: string;
  problemType?: 'equation' | 'graph' | 'geometry' | 'number_line' | 'function' | 'generic';
}

interface VisualizeResponse {
  videoUrl?: string;
  videoId?: string;
  error?: string;
  explanation?: string;
}

const MANIM_SERVICE_URL = process.env.MANIM_SERVICE_URL || 'http://localhost:5001';

/**
 * Generate Manim code using AI for any problem
 */
async function generateManimCode(problem: string): Promise<{ code: string; explanation: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/generate-manim-code`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ problem }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate Manim code');
  }

  return await response.json();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VisualizeResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { problem }: VisualizeRequest = req.body;

    console.log('[Visualize API] Received request');
    console.log('[Visualize API] Problem:', problem?.substring(0, 100));

    if (!problem) {
      console.log('[Visualize API] ERROR: No problem provided');
      return res.status(400).json({ error: 'Problem is required' });
    }

    // Generate Manim code using AI
    console.log('[Visualize API] Generating Manim code with AI...');
    const { code, explanation } = await generateManimCode(problem);
    console.log('[Visualize API] Generated code length:', code.length);
    console.log('[Visualize API] Explanation:', explanation);

    // Call Manim service with generated code
    console.log('[Visualize API] Calling Manim service at:', MANIM_SERVICE_URL);
    const manimResponse = await fetch(`${MANIM_SERVICE_URL}/generate-dynamic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    console.log('[Visualize API] Manim response status:', manimResponse.status);

    if (!manimResponse.ok) {
      const errorData = await manimResponse.json();
      console.log('[Visualize API] ERROR from Manim service:', errorData);
      return res.status(500).json({
        error: 'Failed to generate visualization',
        details: errorData.details || errorData.error,
      });
    }

    const result = await manimResponse.json();
    console.log('[Visualize API] SUCCESS! Video ID:', result.video_id);

    return res.status(200).json({
      videoUrl: `${MANIM_SERVICE_URL}${result.video_url}`,
      videoId: result.video_id,
      explanation,
    });
  } catch (error) {
    console.error('[Visualize API] EXCEPTION:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
