
import { Suspense } from 'react';
import ReportsClientPage from './client-page';

export default function ReportsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportsClientPage />
    </Suspense>
  );
}
