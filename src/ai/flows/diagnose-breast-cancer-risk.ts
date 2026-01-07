'use server';

/**
 * @fileOverview An AI agent for diagnosing breast cancer risk based on thermal data.
 *
 * - diagnoseBreastCancerRisk - A function that analyzes sensor data to assess risk.
 * - DiagnoseBreastCancerRiskInput - The input type for the function.
 * - DiagnoseBreastCancerRiskOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { User, SensorReading } from '@/lib/types';


const DiagnoseBreastCancerRiskInputSchema = z.object({
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
      familyContacts: z.array(z.object({
        id: z.string(),
        name: z.string(),
        relationship: z.string(),
        phone: z.string(),
        email: z.string(),
      })),
  }).describe('The user profile information.'),
});
export type DiagnoseBreastCancerRiskInput = z.infer<typeof DiagnoseBreastCancerRiskInputSchema>;

const DiagnoseBreastCancerRiskOutputSchema = z.object({
  riskLevel: z.enum(['Low', 'Moderate', 'High']).describe('The assessed risk level for breast cancer.'),
  summary: z.string().describe('A concise summary of the analysis, explaining the key findings from the thermal data.'),
  recommendation: z.string().describe('A clear, actionable recommendation for the user based on the risk assessment.'),
});
export type DiagnoseBreastCancerRiskOutput = z.infer<typeof DiagnoseBreastCancerRiskOutputSchema>;

export async function diagnoseBreastCancerRisk(input: DiagnoseBreastCancerRiskInput): Promise<DiagnoseBreastCancerRiskOutput> {
  return diagnoseBreastCancerRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseBreastCancerRiskPrompt',
  input: {schema: DiagnoseBreastCancerRiskInputSchema},
  output: {schema: DiagnoseBreastCancerRiskOutputSchema},
  prompt: `You are an expert AI medical assistant specializing in early breast cancer detection using thermal imaging data. Your task is to analyze thermal data from a smart bra, assess the cancer risk, and provide a clear summary and recommendation.

You will evaluate three key parameters derived from the sensor data:
1.  **Average Thermal Differential**: The average temperature difference between corresponding sensors on the left and right breasts. A persistent high average difference is a warning sign.
2.  **Peak Thermal Asymmetry**: The single largest temperature difference found between any pair of corresponding sensors. A high peak value is a significant indicator of a potential anomaly.
3.  **Thermal Volatility**: The standard deviation of the temperature differentials across all sensor pairs. High volatility can indicate an unstable thermal pattern, which may be a cause for concern.

**User Information:**
- Age: {{{user.age}}}
- Medical History: {{{user.medicalHistory}}}
- Alert Threshold (for differential): {{{user.threshold}}}°C

**Sensor Data:**
{{#each sensorReadings}}
- Side: {{this.side}}, Position: {{this.position}}, Temp: {{this.temperature}}°C
{{/each}}

**Analysis Instructions:**
1.  Calculate the Average Thermal Differential, Peak Thermal Asymmetry, and Thermal Volatility from the provided sensor data.
2.  Correlate these findings with the user's age and medical history.
3.  Assess the risk level as 'Low', 'Moderate', or 'High'.
    - **High Risk**: Triggered by a Peak Asymmetry significantly above the user's threshold (e.g., > {{{user.threshold}}}°C), especially when combined with a high Average Differential or high Volatility.
    - **Moderate Risk**: Triggered by values consistently near the threshold or one parameter being notably high while others are normal.
    - **Low Risk**: All parameters are well within normal ranges.
4.  **Summary**: Write a concise summary explaining WHAT was found. Mention the key parameters and why they led to your risk assessment.
5.  **Recommendation**: Provide a clear, actionable next step. For 'High' risk, strongly recommend consulting a doctor immediately. For 'Moderate' risk, suggest continued monitoring and scheduling a check-up. For 'Low' risk, recommend continuing routine monitoring.

**Crucially, if the risk is determined to be 'High', the system will automatically alert the user's designated family members. Your response should reflect this reality.**
`,
});

const diagnoseBreastCancerRiskFlow = ai.defineFlow(
  {
    name: 'diagnoseBreastCancerRiskFlow',
    inputSchema: DiagnoseBreastCancerRiskInputSchema,
    outputSchema: DiagnoseBreastCancerRiskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    
    // In a real application, this is where you would trigger the notification service
    // to alert family members if the risk is high.
    if (output?.riskLevel === 'High') {
        console.log(`High risk detected for user ${input.user.name}. Simulating notification to family contacts.`);
        input.user.familyContacts.forEach(contact => {
            console.log(`- Notifying ${contact.name} (${contact.relationship}) at ${contact.email} and ${contact.phone}`);
        });
    }

    return output!;
  }
);
