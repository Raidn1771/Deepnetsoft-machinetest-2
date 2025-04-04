import { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import './home.css';

const Home = () => {
  // State
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('food');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'food',
    ingredients: '',
    price: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Debugging logger
  const logger = (message, data) => {
    console.log(`[DEBUG] ${message}`, data);
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        logger('Initiating data fetch...', { lastRefresh });

        // 1. Fetch categories
        const categoriesRes = await fetch(
          `http://localhost:3000/api/menu/categories?t=${lastRefresh}`
        );
        logger('Categories response status:', categoriesRes.status);

        if (!categoriesRes.ok) throw new Error('Categories fetch failed');
        const categoriesData = await categoriesRes.json();
        logger('Categories data received:', categoriesData);

        // 2. Set categories and active category
        const loadedCategories = categoriesData.data?.length
          ? categoriesData.data
          : ['food', 'drinks', 'brunch'];

        setCategories(loadedCategories);
        logger('Categories set:', loadedCategories);

        // 3. Fetch menu items
        const itemsRes = await fetch(
          `http://localhost:3000/api/menu?category=${activeCategory}&t=${lastRefresh}`
        );
        logger('Items response status:', itemsRes.status);

        if (!itemsRes.ok) throw new Error('Items fetch failed');
        const itemsData = await itemsRes.json();
        logger('Raw items data:', itemsData);

        // Convert to array if needed
        const itemsArray = Array.isArray(itemsData)
          ? itemsData
          : itemsData.data || [];

        setMenuItems(itemsArray);
        logger('Processed menu items:', itemsArray);
      } catch (error) {
        console.error('Data fetch error:', error);
        setMenuItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeCategory, lastRefresh]);

  // Manual refresh
  const refreshData = () => {
    logger('Manual refresh triggered');
    setLastRefresh(Date.now());
  };

  // Form handlers
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      logger('Submitting form data:', formData);
      const response = await fetch('http://localhost:3000/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ingredients: formData.ingredients.split(',').map(i => i.trim()),
          category: formData.category.toLowerCase(),
        }),
      });

      if (!response.ok) throw new Error('Submission failed');
      const data = await response.json();
      logger('Submission response:', data);

      if (data.success) {
        refreshData();
        setIsModalOpen(false);
        setFormData({
          name: '',
          category: 'food',
          ingredients: '',
          price: '',
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="maindiv">
        <div className="heroContainer">
          <h1>MENU</h1>
          <p>
            Please take a look at our menu. If you'd like to place an order, use
            the "Order Online" button located below the menu.
          </p>
        </div>

        <div className="menuItemBar">
          {categories.map(category => (
            <button
              key={category}
              className={`menuButton ${
                activeCategory === category ? 'active' : ''
              }`}
              onClick={() => {
                logger('Category changed to:', category);
                setActiveCategory(category);
              }}
            >
              {category.toUpperCase()}
            </button>
          ))}
          <button
            className="menuButton addButton"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Item
          </button>
        </div>

        <div className="menuCard">
          <img className="frameR" src="/FrameR.png" alt="" />
          <div className="menuListBox">
            <img className="cocktail2" src="/cocktail2.png" alt="" />
            <img className="cocktail1" src="/cocktail1.png" alt="" />

            <div className="menuHeader">
              <div className="line"></div>
              <h1 className="category">{activeCategory.toUpperCase()}</h1>
              <div className="line"></div>
            </div>

            <div className="menuList">
              {isLoading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading menu items...</p>
                </div>
              ) : menuItems.length > 0 ? (
                <div className="menuItemsGrid">
                  {menuItems.map((item, index) => (
                    <div key={item._id || index} className="menuItemCard">
                      <h2>{item.name}</h2>
                      <p className="ingredients">
                        {Array.isArray(item.ingredients)
                          ? item.ingredients.join(', ')
                          : item.ingredients}
                      </p>
                      <p className="price">
                        ${item.price?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="noItems">
                  No items found.
                  <button onClick={() => setIsModalOpen(true)}>
                    Add the first item
                  </button>
                </p>
              )}
            </div>
          </div>
          <img className="frameL" src="/FrameL.png" alt="" />
        </div>

        <button
          onClick={refreshData}
          className="refresh-button"
          title="Force data refresh from server"
        >
          ⟳ Refresh Data
        </button>

        {isModalOpen && (
          <div className="modalOverlay">
            <div className="modalContent">
              <h2>Add New Menu Item</h2>
              <button
                className="closeButton"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
              <form onSubmit={handleSubmit}>
                <div className="formGroup">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    minLength="2"
                  />
                </div>
                <div className="formGroup">
                  <label>Category:</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    list="categories"
                    required
                    minLength="2"
                  />
                  <datalist id="categories">
                    {categories.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div className="formGroup">
                  <label>Ingredients (comma separated):</label>
                  <input
                    type="text"
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="formGroup">
                  <label>Price ($):</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="submitButton"
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add Item'}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="aboutDiv">
          <div className="aboutBox">
            <div className="about1">
              <h1>CONNECT WITH US</h1>
              <img className="about" src="/phone.png" alt="" />
              <img className="about" src="/email.png" alt="" />
            </div>
            <div className="about1">
              <img className="aboutLogo" src="/Logo.png" alt="" />
              <div className="logoTitle">
                <p style={{ color: '#008bff' }}>DEEP</p>
                <p style={{ color: 'white' }}>NET</p>
                <p style={{ color: '#857878' }}>SOFT</p>
              </div>
              <img
                className="about aboutSocial"
                src="/socialmedia.png"
                alt=""
              />
            </div>
            <div className="about1">
              <h1>FIND US</h1>
              <img className="about aboutLocation" src="/location.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
