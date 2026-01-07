'use server';

/**
 * @fileOverview Generates a summarized health report from health data.
 *
 * - generateHealthReportSummary - A function that generates a summarized health report.
 * - GenerateHealthReportSummaryInput - The input type for the generateHealthReportSummary function.
 * - GenerateHealthReportSummaryOutput - The return type for the generateHealthReportSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHealthReportSummaryInputSchema = z.object({
  sensorReadings: z.array(
    z.object({
      sensorId: z.enum(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']),
      temperature: z.number().describe('Temperature in Celsius.'),
      timestamp: z.string().describe('ISO timestamp of the reading.'),
    })
  ).describe('Array of sensor readings.'),
  userMedicalHistory: z.string().optional().describe('User provided medical history'),
  threshold: z.number().optional().describe('Temperature threshold for alerts, default 1.0°C'),
});
export type GenerateHealthReportSummaryInput = z.infer<typeof GenerateHealthReportSummaryInputSchema>;

const GenerateHealthReportSummaryOutputSchema = z.object({
  summary: z.string().describe('Summarized health report highlighting key trends and anomalies.'),
});
export type GenerateHealthReportSummaryOutput = z.infer<typeof GenerateHealthReportSummaryOutputSchema>;

export async function generateHealthReportSummary(input: GenerateHealthReportSummaryInput): Promise<GenerateHealthReportSummaryOutput> {
  return generateHealthReportSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHealthReportSummaryPrompt',
  input: {schema: GenerateHealthReportSummaryInputSchema},
  output: {schema: GenerateHealthReportSummaryOutputSchema},
  prompt: `You are an AI assistant specialized in summarizing breast health reports based on temperature sensor data.

  Analyze the provided sensor readings and medical history to generate a concise summary highlighting key trends, anomalies, and potential concerns.
  
  Pay close attention to temperature differences exceeding the provided threshold of {{{threshold}}} °C, as these may indicate abnormal conditions. If no threshold is provided, use a default threshold of 1.0 °C.

  Medical history is: {{{userMedicalHistory}}}

  Here are the sensor readings:
  {{#each sensorReadings}}
    - Sensor ID: {{sensorId}}, Temperature: {{temperature}}°C, Timestamp: {{timestamp}}
  {{/each}}
  
  Provide a summary that is easily understandable and can be shared with healthcare professionals.
  The summary should be no more than 200 words.
  `,
});

const generateHealthReportSummaryFlow = ai.defineFlow(
  {
    name: 'generateHealthReportSummaryFlow',
    inputSchema: GenerateHealthReportSummaryInputSchema,
    outputSchema: GenerateHealthReportSummaryOutputSchema,
  },
  async input => {
    const {
      sensorReadings,
      userMedicalHistory,
      threshold = 1.0,
    } = input;
    const {output} = await prompt({sensorReadings, userMedicalHistory, threshold});
    return {
      summary: output!.summary,
    };
  }
);
