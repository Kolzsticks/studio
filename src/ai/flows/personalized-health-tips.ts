'use server';

/**
 * @fileOverview A personalized health tips AI agent.
 *
 * - getPersonalizedHealthTips - A function that provides personalized health tips based on temperature data.
 * - PersonalizedHealthTipsInput - The input type for the getPersonalizedHealthTips function.
 * - PersonalizedHealthTipsOutput - The return type for the getPersonalizedHealthTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedHealthTipsInputSchema = z.object({
  sensorReadings: z.array(
    z.object({
      sensorId: z.enum(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']),
      temperature: z.number().describe('Temperature in Celsius.'),
      timestamp: z.string().datetime(),
      status: z.enum(['normal', 'warning', 'alert']),
    })
  ).describe('An array of sensor readings from the smart bra.'),
  userProfile: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    threshold: z.number().describe('Temperature alert threshold in Celsius.'),
    pairedDeviceId: z.string().optional(),
  }).describe('The user profile information.'),
});
export type PersonalizedHealthTipsInput = z.infer<typeof PersonalizedHealthTipsInputSchema>;

const PersonalizedHealthTipsOutputSchema = z.object({
  healthTips: z.array(z.string()).describe('An array of personalized health tips.'),
  educationalContent: z.string().describe('Relevant breast health education content.'),
});
export type PersonalizedHealthTipsOutput = z.infer<typeof PersonalizedHealthTipsOutputSchema>;

export async function getPersonalizedHealthTips(input: PersonalizedHealthTipsInput): Promise<PersonalizedHealthTipsOutput> {
  return personalizedHealthTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedHealthTipsPrompt',
  input: {schema: PersonalizedHealthTipsInputSchema},
  output: {schema: PersonalizedHealthTipsOutputSchema},
  prompt: `You are a helpful AI assistant specialized in providing personalized health tips based on breast temperature data.

  Given the following sensor readings and user profile, generate personalized health tips and relevant educational content.

  Sensor Readings:
  {{#each sensorReadings}}
  - Sensor ID: {{this.sensorId}}, Temperature: {{this.temperature}}°C, Status: {{this.status}}, Timestamp: {{this.timestamp}}
  {{/each}}

  User Profile:
  - Name: {{{userProfile.name}}}
  - Email: {{{userProfile.email}}}
  - Temperature Threshold: {{{userProfile.threshold}}}°C

  Provide concise and actionable health tips based on the sensor data. Also, include relevant breast health education content.

  Format the output as a JSON object with "healthTips" (an array of strings) and "educationalContent" (a string).
  `,
});

const personalizedHealthTipsFlow = ai.defineFlow(
  {
    name: 'personalizedHealthTipsFlow',
    inputSchema: PersonalizedHealthTipsInputSchema,
    outputSchema: PersonalizedHealthTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
