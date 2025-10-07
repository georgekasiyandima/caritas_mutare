import React from 'react';
import WorkInProgressPage from '../../components/WorkInProgressPage.tsx';

const EducationPage: React.FC = () => {
  return (
    <WorkInProgressPage
      title="Education Program"
      description="We're developing a comprehensive education program page that will showcase our community learning initiatives, training programs, and educational impact."
      expectedLaunch="February 2025"
      features={[
        "Interactive program showcase",
        "Student success stories",
        "Training schedules",
        "Educational resources",
        "Community learning initiatives"
      ]}
    />
  );
};

export default EducationPage;
