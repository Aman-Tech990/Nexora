import Sidebar from '@/components/Sidebar';
import React from 'react'
import { Outlet } from 'react-router';

const MainLayout = () => {
    return (
        <div>
            <Sidebar />
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout;