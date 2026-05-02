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
        <div className="min-h-screen bg-[#fcfcfd]">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <div className={`flex flex-col min-h-screen transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${collapsed ? 'lg:pl-24' : 'lg:pl-80'}`}>
                <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

                <main className="flex-1 p-6 lg:p-10 w-full max-w-[1600px] mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>

    );
};

export default MainLayout;
