# Smart Bra - Proactive Breast Health Monitoring

This is a web application designed to empower users with real-time breast health analysis. The "Smart Bra" application simulates the experience of a PWA connected to a smart garment, allowing for proactive monitoring of potential health signs, offering peace of mind, and supporting early detection.

The application is built with a mobile-first approach, ensuring a seamless and intuitive experience on both mobile devices and desktops.

## Key Features

- **User Onboarding:** A multi-step, user-friendly onboarding process to collect essential user information (name, age, weight) which is stored locally.
- **Sensor Simulation:** Simulates readings from three key sensors for breast health analysis:
    - **Ultrasound Sensor:** Measures tissue density.
    - **Temperature Sensor:** Measures thermal variations.
    - **Bioimpedance Sensor:** Measures tissue resistance.
- **Real-Time Scanning:** A dedicated "Scan" page allows users to initiate new readings, with a simulated scanning process and immediate results.
- **Risk Assessment:** A simplified risk logic that categorizes each scan as "Low" or "High" risk based on sensor values.
- **Dashboard:** A central hub that displays the latest scan results, alerts for high-risk readings, and a history of recent scans.
- **Detailed Reports:** A comprehensive reporting section with creative visualizations and charts for Ultrasound, Temperature, and Bioimpedance data trends over time.
- **Data Export:** Functionality to export all scan history into an Excel-compatible CSV file.
- **Expert Consultation:** A feature to find and book appointments with specialists.
- **Settings & Personalization:** Users can update their profile, manage notification preferences, and set up emergency contacts for family alerts.
- **Persistent Data:** The application uses `localStorage` to ensure all user data, including onboarding information and scan history, persists across sessions.

## Core Logic Example: Risk Calculation

The application uses a straightforward logic to determine the risk level from a scan. The `calculateRisk` function in `src/lib/mock-data.ts` is a key part of this assessment.

```typescript
// src/lib/mock-data.ts

export const calculateRisk = (readings: SensorReading): 'Low' | 'High' => {
  // Simplified risk logic based on ultrasound value
  return readings.ultrasound >= 0.7 ? 'High' : 'Low';
};
```

## Core Logic Example: Data Persistence with LocalStorage

The application ensures that user data persists across browser sessions by using `localStorage`. Here's how new scan results are saved in `src/app/dashboard/scan/page.tsx`.

```typescript
// src/app/dashboard/scan/page.tsx

//... inside the startScan function
try {
  const result = generateNewScan(isAnomaly);
  setScanResult(result);
  setStatus('complete');
  
  // Save to localStorage
  const historyData = localStorage.getItem('scanHistory');
  const history = historyData ? JSON.parse(historyData) : [];
  const newHistory = [result, ...history];
  localStorage.setItem('scanHistory', JSON.stringify(newHistory));
  
  //...
} catch (e) {
  //...
}
```

## Technology Stack

This project is built with a modern and robust tech stack:

- **Framework:** [Next.js](https://nextjs.org/) (v15+ with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [React](https://react.dev/) (v19+)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/) for a set of beautifully designed and accessible components.
- **Icons:** [Lucide React](https://lucide.dev/) for a clean and consistent icon set.
- **Charting:** [Recharts](https://recharts.org/) for creating interactive and responsive charts.
- **AI Backend (scaffolding):** [Genkit](https://firebase.google.com/docs/genkit) for building and managing AI flows.
- **Local Data Persistence:** Browser `localStorage` is used to simulate a database and maintain state.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)
- [npm](https://www.npmjs.com/) or a compatible package manager

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/smart-bra.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd smart-bra
    ```
3.  Install NPM packages:
    ```sh
    npm install
    ```

### Running the Development Server

To run the app in development mode, execute the following command. This will start the application on `http://localhost:9002`.

```sh
npm run dev
```

The app will automatically reload if you make any changes to the code.

## Project Structure

- `src/app/`: Contains all the routes and pages of the application, following the Next.js App Router structure.
- `src/components/`: Home to reusable React components, including the UI components from ShadCN.
- `src/lib/`: Includes utility functions (`utils.ts`), data type definitions (`types.ts`), and mock data generation (`mock-data.ts`).
- `src/hooks/`: Custom React hooks, such as `use-toast.ts`.
- `public/`: Static assets like images and manifest files.
- `src/ai/`: Contains the scaffolding for Genkit AI flows.
