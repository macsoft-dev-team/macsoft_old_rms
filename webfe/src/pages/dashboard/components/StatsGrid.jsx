import React from 'react';
import StatCard from './StatCard';

const StatsGrid = ({ stats, statFilter }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {stats
      .filter(stat => statFilter === 'all' || stat.status === statFilter)
      .map((stat, index) => {
        const { key, ...rest } = stat;
        return (
          <StatCard
            key={stat.title}
            {...rest}
            delay={index * 0.1}
          />
        );
      })}
  </div>
);

export default StatsGrid;
