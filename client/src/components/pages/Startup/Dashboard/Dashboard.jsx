import React from 'react';
import StatsGrid from './StatsGrid';
import RecentProposals from './RecentProposals';
import ProfileCompletion from './ProfileCompletion';
import QuickActions from './QuickActions';
import RecentMessages from './RecentMessages';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsGrid />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Proposals and Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <RecentProposals />
          <QuickActions />
        </div>

        {/* Right Column - Profile Completion and Recent Messages */}
        <div className="space-y-6">
          <ProfileCompletion />
          <RecentMessages />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
