import React, { createContext, useContext, useState, useEffect } from 'react';

const MenuContext = createContext();

export const useMenu = () => useContext(MenuContext);

const initialMenuItems = [
    // Coffee Items
    {
      id: 1,
      name: "Espresso",
      price: 199,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZXNwcmVzc298ZW58MHx8MHx8fDA%3D",
      description: "Rich, concentrated coffee shot with perfect crema",
      prepTime: "1–2",
      ingredients: ["Finely ground coffee", "Hot water"],
      nutrition: { calories: '5 kcal', protein: '0g', carbs: '1g', fat: '0g', sugar: '0g', caffeine: '80mg' }
    },
    {
      id: 2,
      name: "Cappuccino",
      price: 259,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1710173472469-9d28e977914c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fENhcHB1Y2Npbm98ZW58MHx8MHx8fDA%3D",
      description: "Espresso with steamed milk and thick foam",
      prepTime: "3–5",
      ingredients: ["Espresso", "Steamed milk", "Thick milk foam"],
      nutrition: { calories: '120 kcal', protein: '6g', carbs: '10g', fat: '6g', sugar: '9g', caffeine: '80mg' }
    },
    {
      id: 3,
      name: "Latte",
      price: 289,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=1200&q=90",
      description: "Smooth espresso with steamed milk and light foam",
      prepTime: "3–5",
      ingredients: ["Espresso shot", "Steamed milk", "Milk foam"],
      nutrition: { calories: '190 kcal', protein: '12g', carbs: '19g', fat: '7g', sugar: '18g', caffeine: '80mg' }
    },
    {
      id: 4,
      name: "Americano",
      price: 215,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1551030173-122aabc4489c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Espresso with hot water for a clean, strong taste",
      prepTime: "2–3",
      ingredients: ["Espresso shot", "Hot water"],
      nutrition: { calories: '15 kcal', protein: '0g', carbs: '2g', fat: '0g', sugar: '0g', caffeine: '80mg' }
    },
    {
      id: 5,
      name: "Iced Coffee",
      price: 239,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=90",
      description: "Refreshing cold brew coffee served over ice",
      prepTime: "2–3",
      ingredients: ["Brewed coffee", "Ice cubes", "Optional milk/syrup"],
      nutrition: { calories: '80 kcal', protein: '1g', carbs: '20g', fat: '0g', sugar: '15g', caffeine: '150mg' }
    },
    {
      id: 6,
      name: "Mocha",
      price: 349,
      category: 'coffee',
      image: "https://plus.unsplash.com/premium_photo-1668970851336-6c81cc888ba7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TW9jaGF8ZW58MHx8MHx8fDA%3D",
      description: "Rich espresso with chocolate and steamed milk",
      prepTime: "4–6",
      ingredients: ["Espresso", "Steamed milk", "Chocolate syrup", "Whipped cream"],
      nutrition: { calories: '290 kcal', protein: '10g', carbs: '35g', fat: '12g', sugar: '27g', caffeine: '90mg' }
    },
    {
      id: 7,
      name: "Macchiato",
      price: 359,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=90",
      description: "Espresso with a dollop of foamed milk",
      prepTime: "2–3",
      ingredients: ["Espresso", "Small amount of milk foam"],
      nutrition: { calories: '100 kcal', protein: '5g', carbs: '10g', fat: '5g', sugar: '8g', caffeine: '80mg' }
    },
    
    // Tea Items
    {
      id: 8,
      name: "Earl Grey Tea",
      price: 249,
      category: 'tea',
      image: "https://images.unsplash.com/photo-1744160252607-1f195a3564c2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Classic black tea with bergamot oil",
      prepTime: "3–4",
      ingredients: ["Black tea leaves", "Bergamot oil", "Hot water"],
      nutrition: { calories: '0 kcal', protein: '0g', carbs: '0g', fat: '0g', sugar: '0g', caffeine: '40mg' }
    },
    {
      id: 9,
      name: "Green Tea Latte",
      price: 299,
      category: 'tea',
      image: "https://plus.unsplash.com/premium_photo-1673459683998-c6f7e2804f92?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8R3JlZW4lMjBUZWElMjBMYXR0ZXxlbnwwfHwwfHx8MA%3D%3D",
      description: "Matcha green tea with steamed milk",
      prepTime: "3–4",
      ingredients: ["Matcha green tea powder", "Steamed milk", "Sweetener"],
      nutrition: { calories: '190 kcal', protein: '8g', carbs: '28g', fat: '5g', sugar: '25g', caffeine: '70mg' }
    },
    {
      id: 10,
      name: "Chamomile Tea",
      price: 250,
      category: 'tea',
      image: "https://images.unsplash.com/photo-1654713803623-3d2b9d39f6b3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Soothing herbal tea perfect for relaxation",
      prepTime: "4–5",
      ingredients: ["Chamomile flowers", "Hot water"],
      nutrition: { calories: '0–2 kcal', protein: '0g', carbs: '0g', fat: '0g', sugar: '0g', caffeine: '0mg' }
    },
    {
      id: 11,
      name: "Chai Latte",
      price: 99,
      category: 'tea',
      image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=1200&q=90",
      description: "Spiced tea blend with steamed milk and foam",
      prepTime: "4–6",
      ingredients: ["Black tea", "Milk", "Chai spices (cinnamon, ginger, cardamom)", "Sugar"],
      nutrition: { calories: '200 kcal', protein: '7g', carbs: '33g', fat: '5g', sugar: '32g', caffeine: '50mg' }
    },
    
    // Pastries
    {
      id: 12,
      name: "Croissant",
      price: 350,
      category: 'pastry',
      image: "https://plus.unsplash.com/premium_photo-1670333242784-46b220ef90a2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&id=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fENyb2lzc2FudHxlbnwwfHwwfHx8MA%3D%3D",
      description: "Buttery, flaky French pastry",
      prepTime: "5–7",
      ingredients: ["Flour", "Butter", "Yeast", "Milk", "Sugar", "Salt"],
      nutrition: { calories: '~270 kcal', protein: '6g', carbs: '31g', fat: '14g', sugar: '6g', caffeine: '0mg' }
    },
    {
      id: 13,
      name: "Blueberry Muffin",
      price: 270,
      category: 'pastry',
      image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&id=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Qmx1ZWJlcnJ5JTIwTXVmZmlufGVufDB8fDB8fHww",
      description: "Moist muffin packed with fresh blueberries",
      prepTime: "5–7",
      ingredients: ["Flour", "Blueberries", "Sugar", "Butter", "Eggs", "Milk"],
      nutrition: { calories: '~380 kcal', protein: '5g', carbs: '55g', fat: '16g', sugar: '30g', caffeine: '0mg' }
    },
    {
        id: 14,
        name: "Chocolate Chip Cookie",
        price: 150,
        category: 'pastry',
        image: "https://images.unsplash.com/photo-1593289297423-c76c8a3c6f7a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&id=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q2hvY29sYXRlJTIwQ2hpcCUyMENvb2tpZXxlbnwwfHwwfHx8MA%3D%3D",
        description: "Classic cookie with rich chocolate chips",
        prepTime: "3–5",
        ingredients: ["Flour", "Butter", "Sugar", "Chocolate chips", "Eggs", "Vanilla"],
        nutrition: { calories: '~220 kcal', protein: '2g', carbs: '30g', fat: '11g', sugar: '18g', caffeine: '5mg' }
    }
];

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState(() => {
    try {
      const savedMenu = localStorage.getItem('menuItems');
      const base = savedMenu ? JSON.parse(savedMenu) : initialMenuItems;
      // Remove specific static items from defaults
      const filtered = Array.isArray(base)
        ? base.filter(it => !['espresso','cappuccino','croissant'].includes((it.name || '').toLowerCase()))
        : [];
      return filtered;
    } catch (error) {
      console.error("Could not parse menu items from localStorage", error);
      return initialMenuItems.filter(it => !['espresso','cappuccino','croissant'].includes((it.name || '').toLowerCase()));
    }
  });

  useEffect(() => {
    try {
      // Normalize ids before persisting
      const normalized = (menuItems || []).map(it => {
        const id = it.id || it._id || Date.now() + Math.random();
        return { ...it, id };
      });
      localStorage.setItem('menuItems', JSON.stringify(normalized));
    } catch (error) {
      console.error("Could not save menu items to localStorage", error);
    }
  }, [menuItems]);

  const addMenuItem = (item) => {
    setMenuItems(prevItems => {
      const id = item.id || item._id || Date.now();
      return [...prevItems, { ...item, id }];
    });
  };

  const updateMenuItem = (updatedItem) => {
    setMenuItems(prevItems => 
      prevItems.map(item => {
        const a = item.id || item._id;
        const b = updatedItem.id || updatedItem._id;
        return a === b ? { ...item, ...updatedItem, id: b } : item;
      })
    );
  };

  const deleteMenuItem = (id) => {
    setMenuItems(prevItems => prevItems.filter(item => (item.id || item._id) !== id));
  };

  return (
    <MenuContext.Provider value={{ menuItems, addMenuItem, updateMenuItem, deleteMenuItem }}>
      {children}
    </MenuContext.Provider>
  );
};