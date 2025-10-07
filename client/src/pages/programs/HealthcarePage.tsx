import React from 'react';
import WorkInProgressPage from '../../components/WorkInProgressPage.tsx';

const HealthcarePage: React.FC = () => {
  return (
    <WorkInProgressPage
      title="Healthcare Program"
      description="We're creating a detailed healthcare program page that will highlight our medical services, health awareness campaigns, and community health initiatives."
      expectedLaunch="February 2025"
      features={[
        "Medical services overview",
        "Health screening schedules",
        "Medicine distribution info",
        "Community health education",
        "Mobile clinic services"
      ]}
    />
  );
};

export default HealthcarePage;
