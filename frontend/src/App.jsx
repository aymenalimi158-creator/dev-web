import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from './services/api';

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', quantity: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des produits", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProduct(editingId, {
          ...form,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity)
        });
        setEditingId(null);
      } else {
        await createProduct({
          ...form,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity)
        });
      }
      setForm({ name: '', description: '', price: '', quantity: '' });
      loadProducts();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement", error);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', color: '#333' }}>
      <h2>Gestion des Produits (CRUD Full Stack)</h2>
      
      {/* Formulaire */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h3>{editingId ? "Modifier le Produit" : "Ajouter un Produit"}</h3>
        <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
          <input 
            type="text" placeholder="Nom du produit" value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} required 
            style={{ padding: '8px' }}
          />
          <input 
            type="text" placeholder="Description" value={form.description} 
            onChange={(e) => setForm({ ...form, description: e.target.value })} required 
            style={{ padding: '8px' }}
          />
          <input 
            type="number" step="0.01" placeholder="Prix" value={form.price} 
            onChange={(e) => setForm({ ...form, price: e.target.value })} required 
            style={{ padding: '8px' }}
          />
          <input 
            type="number" placeholder="Quantité" value={form.quantity} 
            onChange={(e) => setForm({ ...form, quantity: e.target.value })} required 
            style={{ padding: '8px' }}
          />
        </div>
        <div style={{ marginTop: '15px' }}>
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {editingId ? "Mettre à jour" : "Ajouter"}
          </button>
          {editingId && (
            <button 
              type="button" 
              onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: '', quantity: '' }); }}
              style={{ marginLeft: '10px', padding: '8px 16px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* Liste des produits */}
      <h3>Liste des Produits</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>ID</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Quantité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.price} TND</td>
              <td>{p.quantity}</td>
              <td>
                <button onClick={() => handleEdit(p)} style={{ padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Modifier</button>
                <button onClick={() => handleDelete(p.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', marginLeft: '8px' }}>Supprimer</button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', color: '#777' }}>Aucun produit trouvé dans la base de données.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
