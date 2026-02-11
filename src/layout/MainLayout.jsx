import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="lg:pl-72 flex flex-col min-h-screen transition-all duration-300">
                <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

                <main className="flex-1 px-5 sm:px-6 lg:px-8  mx-auto w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
