// components/dashboard/ActivityFeed.jsx
import React from 'react';
import { Bell, Clock, CreditCard, Settings, User, Users, FileText, CheckCircle } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: "investor",
    icon: Users,
    title: "New Investor Connected",
    description: "Venture Capital Partners showed interest in your pitch",
    time: "2 hours ago",
    color: "text-blue-500",
    bgColor: "bg-blue-100"
  },
  {
    id: 2,
    type: "proposal",
    icon: FileText,
    title: "Proposal Viewed",
    description: "Your proposal was viewed by 5 new investors",
    time: "3 hours ago",
    color: "text-purple-500",
    bgColor: "bg-purple-100"
  },
  {
    id: 3,
    type: "meeting",
    icon: Bell,
    title: "Meeting Scheduled",
    description: "Meeting with Sarah Thompson confirmed for tomorrow",
    time: "5 hours ago",
    color: "text-green-500",
    bgColor: "bg-green-100"
  },
  {
    id: 4,
    type: "funding",
    icon: CreditCard,
    title: "Investment Offer Received",
    description: "New offer of $250K from TechGrowth Fund",
    time: "12 minutes ago",
    color: "text-purple-500",
    bgColor: "bg-purple-100"
  },
  {
    id: 5,
    type: "profile",
    icon: User,
    title: "Profile Updated",
    description: "Your profile completeness increased to 65%",
    time: "1 hour ago",
    color: "text-orange-500",
    bgColor: "bg-orange-100"
  },
  {
    id: 6,
    type: "completion",
    icon: CheckCircle,
    title: "Task Completed",
    description: "Business plan uploaded successfully",
    time: "2 days ago",
    color: "text-green-500",
    bgColor: "bg-green-100"
  }
];

function ActivityFeed() {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
      <div className='p-6 border-b border-gray-200 flex justify-between items-center'>
        <div>
          <h3 className='text-lg font-bold text-gray-800'>Activity Feed</h3>
          <p className='text-sm text-gray-500'>Recent System Activities</p>
        </div>
        <button className='text-blue-600 hover:text-blue-700 text-sm font-medium'>View All</button>
      </div>
      <div className='p-6'>
        <div className='space-y-4'>
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className='flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors'>
                <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                  <Icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className='flex-1 min-w-0'>
                  <h4 className='text-sm font-semibold text-gray-800'>{activity.title}</h4>
                  <p className='text-sm text-gray-600 truncate'>{activity.description}</p>
                  <div className='flex items-center space-x-1 mt-1'>
                    <Clock className='w-3 h-3 text-gray-400'/>
                    <span className='text-xs text-gray-500'>{activity.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ActivityFeed;