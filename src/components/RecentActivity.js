import React from 'react';

const RecentActivity = ({ activities }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="px-6 py-4 flex items-center">
              <div className={`p-2 rounded-full mr-4 ${activity.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-6 py-3 bg-gray-50 text-right">
        <button className="text-sm font-medium text-red-500 hover:text-red-600">
          View all activity →
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;