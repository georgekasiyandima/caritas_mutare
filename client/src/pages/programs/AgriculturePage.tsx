import React from 'react';
import WorkInProgressPage from '../../components/WorkInProgressPage';

const AgriculturePage: React.FC = () => {
  return (
    <WorkInProgressPage
      title="Agriculture Program"
      description="We're building an agriculture projects page that will showcase our farming support, food security initiatives, and agricultural training projects."
      expectedLaunch="March 2025"
      features={[
        "Farming support projects",
        "Food security initiatives",
        "Agricultural training",
        "Community gardens",
        "Harvest celebrations"
      ]}
    />
  );
};

export default AgriculturePage;
