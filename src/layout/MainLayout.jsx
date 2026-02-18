import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import api from '../services/api';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    // Heartbeat for user activity
    useEffect(() => {
        const sendHeartbeat = async () => {
            try {
                await api.post('/heartbeat');
            } catch (error) {
                console.error("Heartbeat failed", error);
            }
        };

        // Send immediately on mount
        sendHeartbeat();

        // Then every 2 minutes (120000 ms)
        // The backend considers "online" if active within 5 minutes.
        // Middleware updates throttle is 1 minute.
        const interval = setInterval(sendHeartbeat, 120000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <div className={`flex flex-col min-h-screen transition-all duration-200 ease-in-out ${collapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
                <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

                <main className="flex-1 sm:px-6 lg:px-8  mx-auto w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
