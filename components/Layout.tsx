
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ContentView from './ContentView';

const Layout: React.FC = () => {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <ContentView />
                </main>
            </div>
        </div>
    );
};

export default Layout;
