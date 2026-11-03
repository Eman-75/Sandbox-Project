import React from 'react';
import StatsGrid from './StatsGrid';
import PlatformGrowth from './PlatformGrowth';
import UserDistribution from './UserDistribution';
import VerificationQueue from './VerificationQueue';
import RecentActivity from './RecentActivity';

function Dashboard() {
  return (
    <div className="space-y-6">

      {/* Stats */}
      <StatsGrid />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PlatformGrowth />
        </div>
        <UserDistribution />
      </div>

      {/* Queues and activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VerificationQueue />
        <RecentActivity />
      </div>
    </div>
  );
}

export default Dashboard;