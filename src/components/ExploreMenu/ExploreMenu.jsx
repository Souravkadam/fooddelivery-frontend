import React, { useRef, useContext } from 'react';
import { categories } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import './ExploreMenu.css';

const ExploreMenu = ({ category, setCategory }) => {
  const menuRef = useRef(null);
  const { foodList } = useContext(StoreContext);

  // Get all unique categories from actual food data
  const foodCategories = [...new Set(foodList.map(f => f.category).filter(Boolean))];

  // Known categories with icons
  const knownCats = categories.map(c => c.category.toLowerCase());

  // Extra categories not in the known list
  const extraCats = foodCategories.filter(c => !knownCats.includes(c.toLowerCase())).sort();

  // For extra categories, use first food image in that category
  const extraItems = extraCats.map(cat => {
    const firstFood = foodList.find(f => f.category === cat);
    return { category: cat, icon: null, imageUrl: firstFood?.imageUrl || null };
  });

  const allItems = [...categories, ...extraItems];

  const scrollLeft = () => menuRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  const scrollRight = () => menuRef.current?.scrollBy({ left: 200, behavior: 'smooth' });

  // Case-insensitive active check
  const isActive = (itemCat) => category?.toLowerCase() === itemCat?.toLowerCase();

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
        {allItems.map((item, index) => (
          <div
            key={index}
            className="text-center explore-menu-list-item flex-shrink-0"
            onClick={() =>
              setCategory(prev =>
                prev?.toLowerCase() === item.category?.toLowerCase() ? 'All' : item.category
              )
            }
          >
            {item.icon ? (
              <img
                src={item.icon}
                alt={item.category}
                className={isActive(item.category) ? 'rounded-circle active' : 'rounded-circle'}
                height={128}
                width={128}
                style={{ objectFit: 'cover' }}
              />
            ) : item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.category}
                className={isActive(item.category) ? 'rounded-circle active' : 'rounded-circle'}
                height={128}
                width={128}
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div
                className={isActive(item.category) ? 'rounded-circle active' : 'rounded-circle'}
                style={{ width: 128, height: 128, background: '#f8f9fa', border: '3px solid #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}
              >
                🍽️
              </div>
            )}
            <p className="mt-2 fw-bold" style={{ fontSize: '0.8rem', maxWidth: 128, wordBreak: 'break-word' }}>
              {item.category}
            </p>
          </div>
        ))}
      </div>

      <hr />
    </div>
  );
};

export default ExploreMenu;
