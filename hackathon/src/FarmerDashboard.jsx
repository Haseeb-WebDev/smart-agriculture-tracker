import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function FarmerDashboard() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [weather, setWeather] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  // Mock weather data for Pakistani cities
  const weatherData = {
    Punjab: { temp: 28, condition: 'Sunny', humidity: 45, icon: '☀️' },
    Sindh: { temp: 32, condition: 'Hot', humidity: 60, icon: '🌡️' },
    KPK: { temp: 22, condition: 'Cloudy', humidity: 55, icon: '☁️' },
    Balochistan: { temp: 25, condition: 'Clear', humidity: 30, icon: '🌤️' },
    Islamabad: { temp: 24, condition: 'Pleasant', humidity: 50, icon: '🌤️' }
  };

  // Load items from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('marketItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      // Sample data if no items exist
      const sampleData = [
        {
          id: 1,
          name: 'Tomato',
          region: 'Punjab',
          prices: [{ date: '2025-11-04', price: 60 }]
        },
        {
          id: 2,
          name: 'Potato',
          region: 'Sindh',
          prices: [{ date: '2025-11-04', price: 45 }]
        },
        {
          id: 3,
          name: 'Onion',
          region: 'KPK',
          prices: [{ date: '2025-11-04', price: 80 }]
        },
        {
          id: 4,
          name: 'Carrot',
          region: 'Punjab',
          prices: [{ date: '2025-11-04', price: 70 }]
        },
        {
          id: 5,
          name: 'Cucumber',
          region: 'Islamabad',
          prices: [{ date: '2025-11-04', price: 55 }]
        }
      ];
      setItems(sampleData);
    }
  }, []);

  // Update weather when region changes
  useEffect(() => {
    if (selectedRegion !== 'All') {
      setWeather(weatherData[selectedRegion]);
    } else {
      setWeather(null);
    }
  }, [selectedRegion]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    navigate('/login');
    window.location.reload();
  };

  // Filter items based on search and region
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || item.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <span className="text-gray-600">Welcome, </span>
            <span className="font-semibold text-gray-800">{username}</span>
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
              Farmer
            </span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/forum')}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
            >
              Forum
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🌾 Farmer Dashboard
          </h1>
          <p className="text-gray-600">View market prices and weather updates</p>
        </div>

        {/* Weather Card - Shows when region is selected */}
        {weather && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-1">
                  Weather in {selectedRegion}
                </h3>
                <p className="text-blue-100 text-sm">Current conditions</p>
              </div>
              <div className="text-6xl">{weather.icon}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <p className="text-sm text-blue-100">Temperature</p>
                <p className="text-2xl font-bold">{weather.temp}°C</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <p className="text-sm text-blue-100">Condition</p>
                <p className="text-2xl font-bold">{weather.condition}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <p className="text-sm text-blue-100">Humidity</p>
                <p className="text-2xl font-bold">{weather.humidity}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Items
              </label>
              <input
                type="text"
                placeholder="Search vegetables/fruits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Regions</option>
                <option value="Punjab">Punjab</option>
                <option value="Sindh">Sindh</option>
                <option value="KPK">KPK</option>
                <option value="Balochistan">Balochistan</option>
                <option value="Islamabad">Islamabad</option>
              </select>
            </div>
          </div>
        </div>

        {/* Market Prices Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Market Prices</h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredItems.length} items
              </p>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm || selectedRegion !== 'All' 
                ? 'No items match your search criteria.' 
                : 'No market data available.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Item Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Region
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Current Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItems.map((item) => {
                    const latestPrice = item.prices[item.prices.length - 1];
                    const priceStatus = latestPrice.price > 70 ? 'High' : latestPrice.price > 50 ? 'Medium' : 'Low';
                    const statusColor = priceStatus === 'High' ? 'text-red-600 bg-red-50' : 
                                       priceStatus === 'Medium' ? 'text-yellow-600 bg-yellow-50' : 
                                       'text-green-600 bg-green-50';
                    
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">🥬</span>
                            <span className="text-sm font-medium text-gray-900">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          📍 {item.region}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-lg font-bold text-green-600">
                            Rs. {latestPrice?.price || 'N/A'}
                          </span>
                          <span className="text-sm text-gray-500"> /kg</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {latestPrice?.date || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${statusColor}`}>
                            {priceStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Items</p>
            <p className="text-2xl font-bold text-blue-600">{filteredItems.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Avg Price</p>
            <p className="text-2xl font-bold text-green-600">
              Rs. {filteredItems.length > 0 
                ? (filteredItems.reduce((sum, item) => sum + item.prices[item.prices.length - 1].price, 0) / filteredItems.length).toFixed(2)
                : 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Regions Covered</p>
            <p className="text-2xl font-bold text-purple-600">
              {new Set(filteredItems.map(item => item.region)).size}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerDashboard;