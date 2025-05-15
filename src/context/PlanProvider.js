import React, { useState } from 'react';
import PlanContext from './PlanContext';

const PlanProvider = ({ children }) => {
  const [planData, setPlanData] = useState({
    country: '',
    city: '',
    companion: '',
    style: [],
    startDate: null,
    endDate: null,
    customizing: ''
  });

  return (
    <PlanContext.Provider value={{ planData, setPlanData }}>
      {children }
    </PlanContext.Provider>
  );
};

export default PlanProvider;