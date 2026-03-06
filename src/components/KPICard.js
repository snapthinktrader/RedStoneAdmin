import React from 'react';

const KPICard = ({ title, value, icon: Icon, subtitle, change, changeType, period }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
        <div className="bg-red-100 p-3 rounded-lg">
          <Icon className="text-red-500 w-6 h-6" />
        </div>
      </div>
      {(change || period) && (
        <p className="text-sm text-gray-600 mt-4">
          {change && (
            <span className={changeType === 'positive' ? 'text-green-500' : 'text-red-500'}>
              {changeType === 'positive' ? '↑' : '↓'} {change}
            </span>
          )}
          {period && (
            <span className={change ? ' ' + period : period}>{change ? period : period}</span>
          )}
        </p>
      )}
    </div>
  );
};

export default KPICard;