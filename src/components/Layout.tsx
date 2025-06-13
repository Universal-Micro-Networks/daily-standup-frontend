import React, { useState } from 'react';
import DailyReport from './DailyReport';
import Dashboard from './Dashboard';
import Sidebar from './Sidebar';

type PageType = 'dashboard' | 'daily-report';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {currentPage === 'dashboard' ? (
          <Dashboard sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
        ) : (
          <DailyReport sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
        )}
      </div>
    </div>
  );
};

export default Layout;
