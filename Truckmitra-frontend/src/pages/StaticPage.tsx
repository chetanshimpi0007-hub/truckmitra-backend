import React from 'react';

interface StaticPageProps {
  title: string;
}

const StaticPage: React.FC<StaticPageProps> = ({ title }) => {
  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-900">
            {title}
          </h2>
          <div className="mt-4 h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        <div className="mt-8 text-gray-600">
          <p className="text-lg">
            This page is currently under construction.
          </p>
          <p className="mt-2">
            Please check back later for updates as we continue to improve TruckMitra!
          </p>
        </div>
        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaticPage;
