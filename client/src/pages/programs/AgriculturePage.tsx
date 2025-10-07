import React from 'react';
import WorkInProgressPage from '../../components/WorkInProgressPage.tsx';

const AgriculturePage: React.FC = () => {
  return (
    <WorkInProgressPage
      title="Agriculture Program"
      description="We're building an agriculture program page that will showcase our farming support, food security initiatives, and agricultural training programs."
      expectedLaunch="March 2025"
      features={[
        "Farming support programs",
        "Food security initiatives",
        "Agricultural training",
        "Community gardens",
        "Harvest celebrations"
      ]}
    />
  );
};

export default AgriculturePage;
