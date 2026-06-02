import React, { useRef, useContext } from 'react';
import { categories } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import './ExploreMenu.css';

const ExploreMenu = ({ category, setCategory }) => {
  const menuRef = useRef(null);
  const { foodList } = useContext(StoreContext);

  // Get all unique categories from actual food data
  const foodCategories = [...new Set(foodList.map(f => f.category).filter(Boolean))];

  // Build display list: known categories with icons first, then any extra from food data
  const knownCats = categories.map(c => c.category);
  const extraCats = foodCategories.filter(c => !knownCats.includes(c)).sort();

  // Extra categories without icons use emoji placeholder
  const extraItems = extraCats.map(c => ({ category: c, icon: null }));
  const allItems = [...categories, ...extraItems];

  const scrollLeft = () => {
    menuRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    menuRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

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

      <div
        className="d-flex gap-4 overflow-auto explore-menu-list"
        ref={menuRef}
      >
        {allItems.map((item, index) => (
          <div
            key={index}
            className="text-center explore-menu-list-item flex-shrink-0"
            onClick={() =>
              setCategory(prev =>
                prev === item.category ? 'All' : item.category
              )
            }
          >
            {item.icon ? (
              <img
                src={item.icon}
                alt={item.category}
                className={
                  item.category === category
                    ? 'rounded-circle active'
                    : 'rounded-circle'
                }
                height={128}
                width={128}
              />
            ) : (
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center ${item.category === category ? 'active-cat-circle' : 'cat-circle'}`}
                style={{ width: 128, height: 128, fontSize: '2.5rem', background: '#f8f9fa', border: item.category === category ? '3px solid #f97316' : '3px solid #dee2e6' }}
              >
                🍽️
              </div>
            )}
            <p className="mt-2 fw-bold" style={{fontSize:'0.8rem', maxWidth:128, wordBreak:'break-word'}}>{item.category}</p>
          </div>
        ))}
      </div>

      <hr />
    </div>
  );
};

export default ExploreMenu;
