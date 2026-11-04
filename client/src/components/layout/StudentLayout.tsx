import React from 'react';
import { Navbar } from './Navbar.js';
import { Sidebar } from './Sidebar.js';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <Sidebar role="STUDENT" />

        <main className="flex-1 min-w-0 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
