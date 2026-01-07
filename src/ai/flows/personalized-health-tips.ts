'use server';

/**
 * @fileOverview A personalized health tips AI agent.
 *
 * - getPersonalizedHealthTips - A function that provides personalized health tips based on temperature data.
 * - PersonalizedHealthTipsInput - The input type for the getPersonalizedHealthTips function.
 * - PersonalizedHealthTipsOutput - The return type for the getPersonalizedHealthTips function.
 */

import {ai} from '@/ai/genkit';
import type { SensorReading, User } from '@/lib/types';
import {z} from 'genkit';

const PersonalizedHealthTipsInputSchema = z.object({
  sensorReadings: z.array(
    z.object({
      side: z.enum(['left', 'right']),
      position: z.enum(['A', 'B', 'C', 'D']),
      temperature: z.number().describe('Temperature in Celsius.'),
      timestamp: z.string().datetime(),
    })
  ).describe('An array of sensor readings from the smart bra.'),
  user: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      age: z.number(),
      medicalHistory: z.string(),
      threshold: z.number().describe('Temperature alert threshold in Celsius.'),
      pairedDeviceId: z.string().optional(),
      familyContacts: z.array(z.object({
        id: z.string(),
        name: z.string(),
        relationship: z.string(),
        phone: z.string(),
        email: z.string(),
      })),
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
  - Side: {{this.side}}, Position: {{this.position}}, Temperature: {{this.temperature}}°C, Timestamp: {{this.timestamp}}
  {{/each}}

  User Profile:
  - Name: {{{user.name}}}
  - Age: {{{user.age}}}
  - Medical History: {{{user.medicalHistory}}}
  - Differential Threshold: {{{user.threshold}}}°C

  Provide concise and actionable health tips based on the sensor data and user's profile. Also, include relevant breast health education content.

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
