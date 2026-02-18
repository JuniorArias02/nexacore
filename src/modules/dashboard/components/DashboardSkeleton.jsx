import React from 'react';

const DashboardSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans animate-fade-in">
            <div className="mx-auto max-w-7xl space-y-8">
                {/* Hero Section Skeleton */}
                <div className="relative overflow-hidden rounded-3xl bg-gray-200 p-8 shadow-sm md:p-12 animate-pulse">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-4 w-full md:w-2/3">
                            {/* Role Badge */}
                            <div className="h-8 w-32 bg-gray-300 rounded-full"></div>

                            {/* Greeting */}
                            <div className="h-12 w-3/4 md:w-1/2 bg-gray-300 rounded-lg"></div>

                            {/* Description */}
                            <div className="h-6 w-full md:w-2/3 bg-gray-300 rounded-lg"></div>
                        </div>
                    </div>

                    {/* Decorative Circles Skeleton */}
                    <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/20 blur-3xl"></div>
                </div>

                {/* Dashboard Content Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
                                <div className="h-4 w-32 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Chart/Table Area Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart Area */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse h-96">
                        <div className="flex justify-between items-center mb-6">
                            <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
                            <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
                        </div>
                        <div className="h-64 w-full bg-gray-200 rounded-xl mt-4"></div>
                    </div>

                    {/* Side Panel/Activity Skeleton */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse h-96">
                        <div className="h-8 w-40 bg-gray-200 rounded-lg mb-6"></div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div key={item} className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                                        <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
