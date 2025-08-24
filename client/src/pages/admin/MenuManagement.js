// client/src/pages/admin/MenuManagement.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Container, Card, Button, FormGroup, Label, Input } from '../../components/styled/StyledComponents';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'coffee',
    image: '',
    ingredients: []
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('/api/menu');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`/api/menu/${editingItem._id}`, formData);
      } else {
        await axios.post('/api/menu', formData);
      }
      
      fetchMenuItems();
      resetForm();
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/menu/${id}`);
        fetchMenuItems();
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'coffee',
      image: '',
      ingredients: []
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const startEdit = (item) => {
    setFormData(item);
    setEditingItem(item);
    setShowForm(true);
  };

  return (
    <Container data-aos="fade-in" data-aos-duration="600">
      <div className="admin-header" data-aos="fade-up">
        <h2>Menu Management</h2>
        <Button 
          variant="primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Item'}
        </Button>
      </div>

      {showForm && (
        <Card className="dashboard-card" data-aos="zoom-in" data-aos-delay="100">
          <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Name</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Description</Label>
              <Input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Price</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Category</Label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="coffee">Coffee</option>
                <option value="tea">Tea</option>
                <option value="pastry">Pastry</option>
                <option value="sandwich">Sandwich</option>
                <option value="salad">Salad</option>
                <option value="dessert">Dessert</option>
              </select>
            </FormGroup>

            <Button type="submit" variant="primary">
              {editingItem ? 'Update Item' : 'Add Item'}
            </Button>
          </form>
        </Card>
      )}

      <div className="menu-items-list" data-aos="fade-up" data-aos-delay="150">
        {menuItems.map((item, idx) => (
          <Card key={item._id} className="dashboard-card" data-aos="zoom-in" data-aos-delay={(idx % 6) * 75}>
            <div className="item-row">
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <span className="price">${item.price.toFixed(2)}</span>
                <span className="category">{item.category}</span>
              </div>
              <div className="item-actions">
                <Button onClick={() => startEdit(item)}>Edit</Button>
                <Button onClick={() => handleDelete(item._id)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default MenuManagement;
