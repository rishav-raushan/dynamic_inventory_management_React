import React, { useState, useMemo } from 'react';
import { InventoryTable } from './components/InventoryTable';
import { InventoryForm } from './components/InventoryForm';
import { InventoryItem, SortDirection } from './types';
import { Package, Github, Linkedin, Sun, Moon } from 'lucide-react';
import { useTheme } from './context/ThemeContext';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const categories = useMemo(() => {
    return Array.from(new Set(items.map(item => item.category)));
  }, [items]);

  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter(item => !categoryFilter || item.category === categoryFilter)
      .sort((a, b) => {
        return sortDirection === 'asc' 
          ? a.quantity - b.quantity 
          : b.quantity - a.quantity;
      });
  }, [items, categoryFilter, sortDirection]);

  const handleSubmit = (itemData: Omit<InventoryItem, 'id'>) => {
    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...itemData, id: item.id }
          : item
      ));
      setEditingItem(undefined);
    } else {
      setItems([...items, { ...itemData, id: crypto.randomUUID() }]);
    }
    setShowForm(false);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-b from-gray-50 to-gray-100'}`}>
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className={`flex items-center justify-between mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
              <div className="flex items-center">
                <div className={`${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'} p-3 rounded-full`}>
                  <Package className={`h-8 w-8 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                </div>
                <div className="ml-4">
                  <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Inventory Management</h1>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Manage your inventory with ease</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-full ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => {
                    setEditingItem(undefined);
                    setShowForm(true);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
                >
                  Add New Item
                </button>
              </div>
            </div>

            {showForm && (
              <div className="mb-8">
                <InventoryForm
                  onSubmit={handleSubmit}
                  editingItem={editingItem}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingItem(undefined);
                  }}
                />
              </div>
            )}

            <div className={`mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
              <label htmlFor="category" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Filter by Category
              </label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`mt-2 block w-full pl-3 pr-10 py-2 text-base ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
              {items.length > 0 ? (
                <InventoryTable
                  items={filteredAndSortedItems}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              ) : (
                <div className="text-center py-12">
                  <Package className={`mx-auto h-12 w-12 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    No items in inventory. Add some items to get started!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t mt-auto`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/rishav-raushan"
                target="_blank"
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-500'} transition-colors duration-200`}
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/rishav-raushan1/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-500'} transition-colors duration-200`}
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            <div className="text-center">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                © {new Date().getFullYear()} Inventory Management System
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                Developed by Rishav Raushan | Central University of Haryana
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;