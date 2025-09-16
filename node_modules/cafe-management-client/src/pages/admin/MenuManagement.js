// client/src/pages/admin/MenuManagement.js
import React, { useState, useEffect } from 'react';
import { useMenu } from '../../context/MenuContext';
import { formatINR } from '../../utils/currency';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
`;

const AdminHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: none;
  background-color: #333;
  color: white;
  cursor: pointer;
  
  &.primary {
    background-color: #007bff;
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  margin-bottom: 1rem;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const MenuManagement = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, loading, error } = useMenu();
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formState, setFormState] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    category: 'coffee',
    nutritionFacts: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let items = menuItems;
    if (searchTerm) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== 'all') {
      items = items.filter(item => item.category === categoryFilter);
    }
    setFilteredItems(items);
  }, [searchTerm, categoryFilter, menuItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemData = { ...formState, price: parseFloat(formState.price) };

    try {
      if (isEditing) {
        await updateMenuItem(itemData);
      } else {
        await addMenuItem(itemData);
      }
      resetForm();
    } catch (err) {
      console.error("Failed to save menu item", err);
    }
  };

  // Edit existing item
  const handleEdit = (item) => {
    setFormState({
      ...item,
      id: item.id,
      price: item.price
    });
    setIsEditing(true);
    setShowForm(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteMenuItem(id);
      } catch (err) {
        console.error("Failed to delete menu item", err);
      }
    }
  };

  const resetForm = () => {
    setFormState({
      id: null,
      name: '',
      description: '',
      price: '',
      category: 'coffee',
      nutritionFacts: ''
    });
    setIsEditing(false);
    setShowForm(false);
  };

  return (
    <Container>
      <AdminHeader>
        <h2>Menu Management</h2>
        <Button 
          className="primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Item'}
        </Button>
      </AdminHeader>

      <div className="filters">
        <Input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="coffee">Coffee</option>
          <option value="tea">Tea</option>
          <option value="pastry">Pastry</option>
          <option value="sandwich">Sandwich</option>
          <option value="salad">Salad</option>
          <option value="dessert">Dessert</option>
        </select>
      </div>

      {showForm && (
        <Card>
          <h3>{isEditing ? 'Edit Item' : 'Add New Item'}</h3>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Price</Label>
              <Input
                type="number"
                name="price"
                step="0.01"
                value={formState.price}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Category</Label>
              <select
                name="category"
                value={formState.category}
                onChange={handleInputChange}
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

            <FormGroup>
              <Label>Nutrition Facts</Label>
              <Input
                type="text"
                name="nutritionFacts"
                value={formState.nutritionFacts}
                onChange={handleInputChange}
              />
            </FormGroup>

            <Button type="submit" className="primary">
              {isEditing ? 'Update Item' : 'Add Item'}
            </Button>
          </form>
        </Card>
      )}

      <div className="menu-items-list">
        {filteredItems.map(item => (
          <Card key={item.id}>
            <div className="item-row">
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <span className="price">{formatINR(Number(item.price))}</span>
                <span className="category">{item.category}</span>
              </div>
              <div className="item-actions">
                <Button onClick={() => handleEdit(item)}>Edit</Button>
                <Button onClick={() => handleDelete(item.id)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default MenuManagement;