import React from 'react';

const DashboardCard = ({ title, value, icon, color = 'blue', description }) => {
    const colorClasses = {
        blue: 'border-blue-500 text-blue-500 bg-blue-50',
        green: 'border-green-500 text-green-500 bg-green-50',
        red: 'border-red-500 text-red-500 bg-red-50',
        yellow: 'border-yellow-500 text-yellow-500 bg-yellow-50',
        purple: 'border-purple-500 text-purple-500 bg-purple-50',
        orange: 'border-orange-500 text-orange-500 bg-orange-50',
        cyan: 'border-cyan-500 text-cyan-500 bg-cyan-50',
        teal: 'border-teal-500 text-teal-500 bg-teal-50',
    };

    const selectedColor = colorClasses[color] || colorClasses.blue;

    return (
        <div className={`rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 ${selectedColor.split(' ')[0]}`}>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <p className="text-3xl font-bold mt-1 text-gray-800">{value}</p>
                </div>
                <span className={`p-3 rounded-full ${selectedColor.split(' ').slice(1).join(' ')}`}>
                    {icon}
                </span>
            </div>
            {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
        </div>
    );
};

export default DashboardCard;
