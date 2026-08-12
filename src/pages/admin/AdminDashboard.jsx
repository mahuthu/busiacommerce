import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import {
  createProduct,
  deleteProduct,
  deleteProductImage,
  getNextProductId,
  listProducts,
  updateProduct,
  uploadProductImage,
  listCategories,
  createCategory,
  deleteCategory,
} from '../../lib/productsApi';
import './Admin.css';

const emptyForm = {
  id: '',
  name: '',
  brand: '',
  category: '',
  price: '',
  oldPrice: '',
  discount: 0,
  isNew: false,
  image: '/images/product_display.png',
  sku: '',
};

const formatPrice = (price) => `UGX ${Number(price || 0).toLocaleString()}`;

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [allCategories, setAllCategories] = useState([]);
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [data, cats] = await Promise.all([
        listProducts(),
        listCategories()
      ]);
      setProducts(data);
      setAllCategories(cats);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(set).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (!q) return true;
      return `${p.name} ${p.brand} ${p.category} ${p.sku}`.toLowerCase().includes(q);
    });
  }, [products, query, categoryFilter]);

  const openCreate = async () => {
    setError('');
    setEditingId(null);
    setImageFile(null);
    setImagePreview('');
    try {
      const nextId = await getNextProductId();
      setForm({ ...emptyForm, category: allCategories[0]?.name || '', id: String(nextId), sku: String(nextId) });
      setFormOpen(true);
    } catch (err) {
      setError(err.message || 'Could not prepare new product');
    }
  };

  const openEdit = (product) => {
    setError('');
    setEditingId(product.id);
    setImageFile(null);
    setImagePreview(product.image);
    setForm({
      id: String(product.id),
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: String(product.price),
      oldPrice: product.oldPrice == null ? '' : String(product.oldPrice),
      discount: product.discount || 0,
      isNew: Boolean(product.isNew),
      image: product.image,
      sku: product.sku || String(product.id),
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setImageFile(null);
    setImagePreview('');
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setAddingCategory(true);
    setError('');
    try {
      await createCategory(newCategoryName.trim());
      setNewCategoryName('');
      const cats = await listCategories();
      setAllCategories(cats);
    } catch (err) {
      setError(err.message || 'Failed to add category');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (cat) => {
    const ok = window.confirm(`Delete category "${cat.name}"?`);
    if (!ok) return;
    setError('');
    try {
      await deleteCategory(cat.id);
      const cats = await listCategories();
      setAllCategories(cats);
    } catch (err) {
      setError(err.message || 'Failed to delete category');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const id = Number(form.id);
      if (!id || !form.name.trim() || !form.category.trim()) {
        throw new Error('ID, name, and category are required');
      }

      let imageUrl = form.image;
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile, id);
      }

      const payload = {
        id,
        name: form.name,
        brand: form.brand || 'Generic',
        category: form.category,
        price: Number(form.price) || 0,
        oldPrice: form.oldPrice === '' ? null : Number(form.oldPrice),
        discount: Number(form.discount) || 0,
        isNew: Boolean(form.isNew),
        image: imageUrl,
        sku: form.sku || String(id),
      };

      if (editingId) {
        if (imageFile && form.image && form.image !== imageUrl) {
          await deleteProductImage(form.image);
        }
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      closeForm();
      await load();
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const ok = window.confirm(`Delete “${product.name}”? This cannot be undone.`);
    if (!ok) return;

    setError('');
    try {
      await deleteProduct(product.id);
      await deleteProductImage(product.image);
      await load();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <img src="/images/busialogo.png" alt="" className="admin-topbar-logo" />
          <div>
            <h1>Product Admin</h1>
            <p>{user?.email}</p>
          </div>
        </div>
        <div className="admin-topbar-actions">
          <Link to="/" className="admin-btn ghost">View storefront</Link>
          <button type="button" className="admin-btn ghost" onClick={() => signOut()}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-toolbar">
          <div className="admin-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search name, brand, SKU…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="admin-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button type="button" className="admin-btn ghost" onClick={() => setCategoriesModalOpen(true)}>
            Manage categories
          </button>
          <button type="button" className="admin-btn primary" onClick={openCreate}>
            <Plus size={16} />
            Add product
          </button>
        </div>

        {error && <div className="admin-alert error">{error}</div>}

        <div className="admin-stats">
          <span>{products.length} products</span>
          <span>{filtered.length} showing</span>
        </div>

        {loading ? (
          <p className="admin-muted">Loading products…</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>SKU</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img src={product.image} alt="" className="admin-thumb" />
                    </td>
                    <td>
                      <strong>{product.name}</strong>
                      {product.isNew && <span className="admin-pill">NEW</span>}
                    </td>
                    <td>{product.brand}</td>
                    <td>{product.category}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{product.sku}</td>
                    <td className="admin-row-actions">
                      <button type="button" className="admin-icon-btn" onClick={() => openEdit(product)} aria-label="Edit">
                        <Pencil size={16} />
                      </button>
                      <button type="button" className="admin-icon-btn danger" onClick={() => handleDelete(product)} aria-label="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="admin-muted">No products match your filters.</p>}
          </div>
        )}
      </main>

      {formOpen && (
        <div className="admin-modal-backdrop" onClick={closeForm}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingId ? 'Edit product' : 'Add product'}</h2>
              <button type="button" className="admin-icon-btn" onClick={closeForm} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <form className="admin-form" onSubmit={handleSave}>
              <div className="admin-form-grid">
                <label className="admin-field">
                  <span>ID</span>
                  <input
                    type="number"
                    value={form.id}
                    onChange={(e) => setForm((f) => ({ ...f, id: e.target.value, sku: f.sku || e.target.value }))}
                    required
                    disabled={Boolean(editingId)}
                  />
                </label>

                <label className="admin-field">
                  <span>SKU</span>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                  />
                </label>

                <label className="admin-field full">
                  <span>Name</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </label>

                <label className="admin-field">
                  <span>Brand</span>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                  />
                </label>

                <label className="admin-field">
                  <span>Category</span>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  >
                    {allCategories.map((cat) => (
                      <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </label>

                <label className="admin-field">
                  <span>Price (UGX)</span>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    required
                  />
                </label>

                <label className="admin-field">
                  <span>Old price (optional)</span>
                  <input
                    type="number"
                    min="0"
                    value={form.oldPrice}
                    onChange={(e) => setForm((f) => ({ ...f, oldPrice: e.target.value }))}
                  />
                </label>

                <label className="admin-field">
                  <span>Discount %</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.discount}
                    onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))}
                  />
                </label>

                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={form.isNew}
                    onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))}
                  />
                  <span>Mark as new</span>
                </label>

                <label className="admin-field full">
                  <span>Product image</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </label>

                {(imagePreview || form.image) && (
                  <div className="admin-image-preview full">
                    <img src={imagePreview || form.image} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-btn ghost" onClick={closeForm}>Cancel</button>
                <button type="submit" className="admin-btn primary" disabled={saving}>
                  {saving ? 'Saving…' : editingId ? 'Update product' : 'Create product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {categoriesModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setCategoriesModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Manage Categories</h2>
              <button type="button" className="admin-icon-btn" onClick={() => setCategoriesModalOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            
            <form className="admin-form" onSubmit={handleAddCategory} style={{ marginBottom: '20px' }}>
              <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'end' }}>
                <label className="admin-field">
                  <span>New category name</span>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                  />
                </label>
                <button type="submit" className="admin-btn primary" disabled={addingCategory}>
                  {addingCategory ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th style={{ width: '60px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {allCategories.map((cat) => (
                    <tr key={cat.id || cat.name}>
                      <td>{cat.name}</td>
                      <td className="admin-row-actions">
                        <button type="button" className="admin-icon-btn danger" onClick={() => handleDeleteCategory(cat)} aria-label="Delete">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {allCategories.length === 0 && (
                    <tr>
                      <td colSpan="2" className="admin-muted">No categories found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
