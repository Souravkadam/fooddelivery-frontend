import React, { useRef, useContext } from 'react';
import { categories } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import './ExploreMenu.css';

const ExploreMenu = ({ category, setCategory }) => {
  const menuRef = useRef(null);
  const { foodList } = useContext(StoreContext);

  // Get all unique categories from actual food data
  const foodCategories = [...new Set(foodList.map(f => f.category).filter(Boolean))];

  // Build icon map: category name (lowercase) → first food image URL
  const foodImageMap = {};
  foodList.forEach(f => {
    if (f.category && f.imageUrl && !foodImageMap[f.category.toLowerCase()]) {
      foodImageMap[f.category.toLowerCase()] = f.imageUrl;
    }
  });

  // Known categories with fallback local icons
  const knownIconMap = {};
  categories.forEach(c => { knownIconMap[c.category.toLowerCase()] = c.icon; });

  // Build full list: all categories that have food, sorted
  // Known ones first (Biryani, Burger, etc.), then extras
  const knownCatNames = categories.map(c => c.category);
  const knownWithFood = knownCatNames.filter(c =>
    foodCategories.some(fc => fc.toLowerCase() === c.toLowerCase())
  );
  const extraCats = foodCategories
    .filter(fc => !knownCatNames.some(kc => kc.toLowerCase() === fc.toLowerCase()))
    .sort();

  const allItems = [
    ...knownWithFood.map(c => ({ category: c })),
    ...extraCats.map(c => ({ category: c })),
  ];

  // Get best image for a category: food image first, then local icon, then null
  const getImage = (cat) => {
    return foodImageMap[cat.toLowerCase()] || knownIconMap[cat.toLowerCase()] || null;
  };

  const isActive = (itemCat) =>
    category?.toLowerCase() === itemCat?.toLowerCase();

  const scrollLeft = () => menuRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  const scrollRight = () => menuRef.current?.scrollBy({ left: 200, behavior: 'smooth' });

  return (
    <div className="explore-menu position-relative">
      <h1 className="d-flex align-items-center justify-content-between">
        Explore Our Menu
        <div className="d-flex">
          <i className="bi bi-arrow-left-circle scroll-icon" onClick={scrollLeft}></i>
          <i className="bi bi-arrow-right-circle scroll-icon" onClick={scrollRight}></i>
        </div>
      </h1>
      <p>Explore curated lists of dishes from top categories</p>

      <div className="d-flex gap-4 overflow-auto explore-menu-list" ref={menuRef}>
        {allItems.map((item, index) => {
          const img = getImage(item.category);
          return (
            <div
              key={index}
              className="text-center explore-menu-list-item flex-shrink-0"
              onClick={() =>
                setCategory(prev =>
                  prev?.toLowerCase() === item.category?.toLowerCase() ? 'All' : item.category
                )
              }
            >
              {img ? (
                <img
                  src={img}
                  alt={item.category}
                  className={isActive(item.category) ? 'rounded-circle active' : 'rounded-circle'}
                  height={128}
                  width={128}
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div
                  className={isActive(item.category) ? 'rounded-circle active' : 'rounded-circle'}
                  style={{
                    width: 128, height: 128, background: '#f8f9fa',
                    border: isActive(item.category) ? '3px solid #f97316' : '3px solid #dee2e6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.5rem'
                  }}
                >
                  🍽️
                </div>
              )}
              <p className="mt-2 fw-bold" style={{ fontSize: '0.78rem', maxWidth: 128, wordBreak: 'break-word' }}>
                {item.category}
              </p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
