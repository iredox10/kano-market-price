
// src/components/PriceHistoryChart.js
// Displays a chart of price history with time-frame selectors.

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PriceHistoryChart = ({ priceHistory }) => {
  const [timeframe, setTimeframe] = useState('daily'); // 'daily', 'weekly', 'monthly'

  // This is where you would normally process your data based on the timeframe.
  // For this example, we'll just use the mock data directly.
  const chartData = priceHistory[timeframe];

  const timeframes = ['daily', 'weekly', 'monthly'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Price History</h3>
        <div className="flex space-x-2">
          {timeframes.map(frame => (
            <button
              key={frame}
              onClick={() => setTimeframe(frame)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${timeframe === frame
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              tickFormatter={(value) => `₦${value / 1000}k`}
              domain={['dataMin - 1000', 'dataMax + 1000']}
            />
            <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
            <Legend />
            <Line type="monotone" dataKey="ownerPrice" stroke="#2E7D32" strokeWidth={2} name="Owner Price" />
            <Line type="monotone" dataKey="communityPrice" stroke="#1976D2" strokeWidth={2} name="Community Avg." />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceHistoryChart;
