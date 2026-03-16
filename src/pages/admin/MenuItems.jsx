import { useState, useEffect } from 'react';
import { adminAPI, menuAPI } from '../../services/api';
import { Plus, Search, Edit2, Trash2, ChefHat, Image } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

export default function AdminMenuItems() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editModal, setEditModal] = useState({ open: false, item: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    is_available: true,
    is_featured: false,
    preparation_time: '',
    calories: '',
    allergens: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        menuAPI.getAll(),
        menuAPI.getCategories()
      ]);
      setItems(itemsRes.data?.items || []);
      setCategories(categoriesRes.data?.categories || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (item = null) => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        category_id: item.category_id || '',
        image_url: item.image_url || '',
        is_available: item.is_available ?? true,
        is_featured: item.is_featured ?? false,
        preparation_time: item.preparation_time || '',
        calories: item.calories || '',
        allergens: item.allergens || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: categories[0]?.id || '',
        image_url: '',
        is_available: true,
        is_featured: false,
        preparation_time: '',
        calories: '',
        allergens: ''
      });
    }
    setEditModal({ open: true, item });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        preparation_time: parseInt(formData.preparation_time) || null,
        calories: parseInt(formData.calories) || null
      };

      if (editModal.item) {
        await adminAPI.updateMenuItem(editModal.item.id, data);
        setItems(prev =>
          prev.map(item =>
            item.id === editModal.item.id ? { ...item, ...data } : item
          )
        );
      } else {
        const response = await adminAPI.createMenuItem(data);
        setItems(prev => [...prev, response.data.item]);
      }
      setEditModal({ open: false, item: null });
    } catch (error) {
      console.error('Failed to save item:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.item) return;
    setSaving(true);

    try {
      await adminAPI.deleteMenuItem(deleteModal.item.id);
      setItems(prev => prev.filter(item => item.id !== deleteModal.item.id));
      setDeleteModal({ open: false, item: null });
    } catch (error) {
      console.error('Failed to delete item:', error);
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category_id?.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Menu Management</h1>
          <p className="text-muted-foreground">Add, edit, and manage menu items</p>
        </div>
        <button
          onClick={() => openEditModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-video bg-muted relative">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                )}
                {!item.is_available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm">
                      Unavailable
                    </span>
                  </div>
                )}
                {item.is_featured && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {categories.find(c => c.id === item.category_id)?.name || 'Uncategorized'}
                    </p>
                  </div>
                  <p className="font-bold text-primary">${parseFloat(item.price).toFixed(2)}</p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {item.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteModal({ open: true, item })}
                    className="px-3 py-2 text-red-500 border border-red-200 dark:border-red-900 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <ChefHat className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">No menu items found</p>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, item: null })}
        title={editModal.item ? 'Edit Menu Item' : 'Add Menu Item'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Prep Time (min)</label>
              <input
                type="number"
                value={formData.preparation_time}
                onChange={(e) => setFormData(prev => ({ ...prev, preparation_time: e.target.value }))}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Calories</label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Allergens</label>
              <input
                type="text"
                value={formData.allergens}
                onChange={(e) => setFormData(prev => ({ ...prev, allergens: e.target.value }))}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                placeholder="e.g., nuts, dairy"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) => setFormData(prev => ({ ...prev, is_available: e.target.checked }))}
                className="w-4 h-4 rounded border-border text-primary"
              />
              <span className="text-foreground">Available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                className="w-4 h-4 rounded border-border text-primary"
              />
              <span className="text-foreground">Featured</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setEditModal({ open: false, item: null })}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : editModal.item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        title="Delete Menu Item"
      >
        <div className="p-6">
          <p className="text-muted-foreground mb-6">
            Are you sure you want to delete <strong className="text-foreground">{deleteModal.item?.name}</strong>? 
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteModal({ open: false, item: null })}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {saving ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
