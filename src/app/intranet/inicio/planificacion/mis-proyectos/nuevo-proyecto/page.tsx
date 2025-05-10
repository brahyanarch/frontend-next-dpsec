"use client"
import React from 'react';

const ActivitiesList: React.FC = () => {
  const activities = [
    { id: 1, name: 'Activity 1', description: 'Description for proyect 1' },
    { id: 2, name: 'Activity 2', description: 'Description for proyect 2' },
    { id: 3, name: 'Activity 3', description: 'Description for proyect 3' },
  ];

  return (
    
      <div>
        <h1>Activities</h1>
        <ul>
          {activities.map(activity => (
            <li key={activity.id}>
              <h2>{activity.name}</h2>
              <p>{activity.description}</p>
            </li>
          ))}
        </ul>
      </div>
    
  );
};

export default ActivitiesList;
