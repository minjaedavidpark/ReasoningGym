import type { NextApiRequest, NextApiResponse } from 'next';
import { callLLM, Message } from '@/lib/llmClient';
import { getAgentPrompt } from '@/lib/prompts';

interface CoachRequest {
  problem?: string;
  image?: string; // Base64 encoded image
  messages?: Message[];
  requestSolution?: boolean;
}

interface CoachResponse {
  message: string;
  decomposition?: any;
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<CoachResponse>) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ message: 'Method not allowed', error: 'Only POST requests are allowed' });
  }

  try {
    const { problem, image, messages, requestSolution }: CoachRequest = req.body;

    // Initial problem submission - decompose first
    if ((problem || image) && !messages) {
      const decomposerPrompt = getAgentPrompt('decomposer');

      // Construct user message content
      let userContent: any[] = [];
      if (problem) {
        userContent.push({ type: 'text', text: `Please decompose this problem:\n\n${problem}` });
      } else {
        userContent.push({
          type: 'text',
          text: `Please decompose the problem shown in this image.`,
        });
      }

      if (image) {
        // Extract base64 data and media type
        // Assuming image string is like "data:image/png;base64,..."
        const matches = image.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          userContent.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: matches[1],
              data: matches[2],
            },
          });
        }
      }

      const decompositionResponse = await callLLM(decomposerPrompt, [
        { role: 'user', content: userContent as any },
      ]);

      // Parse the decomposition
      let decomposition;
      try {
        decomposition = JSON.parse(decompositionResponse);
      } catch {
        // If not valid JSON, use as-is
        decomposition = { raw: decompositionResponse };
      }

      // Now start the Socratic coaching
      const coachPrompt = getAgentPrompt('coach');
      const coachingContext = `Problem: ${problem || 'See image'}\n\nProblem Breakdown:\n${decompositionResponse}\n\nStart coaching the student through this problem step by step. Begin with the first step.`;

      // For coaching, we also want to provide the image context if available
      let coachUserContent: any[] = [{ type: 'text', text: coachingContext }];

      if (image) {
        const matches = image.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          coachUserContent.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: matches[1],
              data: matches[2],
            },
          });
        }
      }

      const coachResponse = await callLLM(coachPrompt, [
        { role: 'user', content: coachUserContent as any },
      ]);

      return res.status(200).json({
        message: coachResponse,
        decomposition,
      });
    }

    // Ongoing conversation
    if (messages && messages.length > 0) {
      const coachPrompt = getAgentPrompt('coach');

      // If student requests full solution
      if (requestSolution) {
        const solutionRequest = [
          ...messages,
          {
            role: 'user' as const,
            content:
              'The student has requested to see the full solution. Please provide a complete solution outline now.',
          },
        ];

        const solutionResponse = await callLLM(coachPrompt, solutionRequest);
        return res.status(200).json({ message: solutionResponse });
      }

      // Continue Socratic coaching
      const response = await callLLM(coachPrompt, messages);
      return res.status(200).json({ message: response });
    }

    return res.status(400).json({
      message: 'Invalid request',
      error: 'Either problem, image, or messages must be provided',
    });
  } catch (error) {
    console.error('Error in coach API:', error);
    return res.status(500).json({
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
