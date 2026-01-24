'use server';

/**
 * @fileOverview An AI agent for recommending local events based on user preferences.
 *
 * - recommendEvents - A function that recommends events based on user preferences.
 * - RecommendEventsInput - The input type for the recommendEvents function.
 * - RecommendEventsOutput - The return type for the recommendEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendEventsInputSchema = z.object({
  userPreferences: z
    .string()
    .describe('A description of the user\u2019s past activity and preferences.'),
  eventData: z
    .string()
    .describe(
      'A summary of available events in Toulouse, including descriptions, dates, times, and locations.'
    ),
});
export type RecommendEventsInput = z.infer<typeof RecommendEventsInputSchema>;

const RecommendEventsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'A list of recommended events, tailored to the user\u2019s preferences, with brief explanations of why each event is recommended.'
    ),
});
export type RecommendEventsOutput = z.infer<typeof RecommendEventsOutputSchema>;

export async function recommendEvents(
  input: RecommendEventsInput
): Promise<RecommendEventsOutput> {
  return recommendEventsFlow(input);
}

const recommendEventsPrompt = ai.definePrompt({
  name: 'recommendEventsPrompt',
  input: {schema: RecommendEventsInputSchema},
  output: {schema: RecommendEventsOutputSchema},
  prompt: `You are an AI event recommendation system for events in Toulouse.

You will be provided with the user's preferences and a summary of available events. Based on this information, you will recommend events that the user may be interested in.

User Preferences: {{{userPreferences}}}

Available Events: {{{eventData}}}

Recommendations:`,
});

const recommendEventsFlow = ai.defineFlow(
  {
    name: 'recommendEventsFlow',
    inputSchema: RecommendEventsInputSchema,
    outputSchema: RecommendEventsOutputSchema,
  },
  async input => {
    const {output} = await recommendEventsPrompt(input);
    return output!;
  }
);
