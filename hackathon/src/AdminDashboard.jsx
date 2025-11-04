import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    price: ''
  });

  // Load items from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem('marketItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      // Initialize with some sample data
      const sampleData = [
        {
          id: 1,
          name: 'Tomato',
          region: 'Punjab',
          prices: [{ date: '2025-11-01', price: 60 }]
        },
        {
          id: 2,
          name: 'Potato',
          region: 'Sindh',
          prices: [{ date: '2025-11-02', price: 45 }]
        },
        {
          id: 3,
          name: 'Onion',
          region: 'KPK',
          prices: [{ date: '2025-11-03', price: 80 }]
        }
      ];
      setItems(sampleData);
      localStorage.setItem('marketItems', JSON.stringify(sampleData));
    }
  }, []);

  // Save items to localStorage whenever items change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('marketItems', JSON.stringify(items));
    }
  }, [items]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.region || !formData.price) {
      alert('Please fill all fields');
      return;
    }

    if (editingId) {
      // Update existing item
      setItems(items.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            name: formData.name,
            region: formData.region,
            prices: [{
              date: new Date().toISOString().split('T')[0],
              price: parseFloat(formData.price)
            }]
          };
        }
        return item;
      }));
      alert('Item updated successfully');
      setEditingId(null);
    } else {
      // Add new item
      const newItem = {
        id: Date.now(), // Simple ID generation
        name: formData.name,
        region: formData.region,
        prices: [{
          date: new Date().toISOString().split('T')[0],
          price: parseFloat(formData.price)
        }]
      };
      setItems([...items, newItem]);
      alert('Item added successfully');
    }
    
    // Reset form
    setFormData({ name: '', region: '', price: '' });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      region: item.region,
      price: item.prices[item.prices.length - 1]?.price || ''
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setItems(items.filter(item => item.id !== id));
    alert('Item deleted successfully');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', region: '', price: '' });
  };

  const handleLogout = () => {
  localStorage.removeItem('username');
  localStorage.removeItem('userRole');
  navigate('/login');
  window.location.reload(); // Add this line
};

  // Calculate stats
  const totalItems = items.length;
  const averagePrice = items.length > 0
    ? (items.reduce((sum, item) => {
        const latestPrice = item.prices[item.prices.length - 1]?.price || 0;
        return sum + latestPrice;
      }, 0) / items.length).toFixed(2)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm border-b border-gray-200 rounded-lg mb-6 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-gray-600">Welcome, </span>
              <span className="font-semibold text-gray-800">{username}</span>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                Admin
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🛠️ Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage vegetable and fruit market rates</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm mb-1">Total Items</p>
            <p className="text-3xl font-bold text-blue-600">{totalItems}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm mb-1">Average Price</p>
            <p className="text-3xl font-bold text-green-600">Rs. {averagePrice}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add/Edit Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {editingId ? 'Edit Item' : 'Add New Item'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Tomato"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Region
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Region</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="KPK">KPK</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Islamabad">Islamabad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (Rs/kg)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 60"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                  >
                    {editingId ? 'Update' : 'Add Item'}
                  </button>
                  
                  {editingId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Items Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Market Items</h2>
              </div>
              
              {items.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No items yet. Add your first item!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Region
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Latest Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {items.map((item) => {
                        const latestPrice = item.prices[item.prices.length - 1];
                        return (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {item.region}
                            </td>
                            <td className="px-6 py-4 text-sm text-green-600 font-semibold">
                              Rs. {latestPrice?.price || 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {latestPrice?.date || 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-right text-sm space-x-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-800 font-medium"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;