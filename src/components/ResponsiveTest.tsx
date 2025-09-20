import React from 'react';

const ResponsiveTest: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Responsive Design Test</h1>
      
      {/* Grid that changes based on screen size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="text-lg font-semibold text-gray-900">Card {item}</div>
            <div className="text-gray-600 mt-2">This card is responsive</div>
          </div>
        ))}
      </div>
      
      {/* Flex container that changes direction */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="bg-purple-100 p-6 rounded-xl flex-1">
          <h2 className="text-xl font-bold text-purple-800">Flex Item 1</h2>
          <p className="text-purple-600 mt-2">This flexes column on mobile, row on desktop</p>
        </div>
        <div className="bg-indigo-100 p-6 rounded-xl flex-1">
          <h2 className="text-xl font-bold text-indigo-800">Flex Item 2</h2>
          <p className="text-indigo-600 mt-2">This flexes column on mobile, row on desktop</p>
        </div>
      </div>
      
      {/* Text that changes size */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Responsive Typography
        </h2>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600">
          This text scales with screen size
        </p>
      </div>
    </div>
  );
};

export default ResponsiveTest;