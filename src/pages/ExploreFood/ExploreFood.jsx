import React, { useState, useContext } from 'react';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import { StoreContext } from '../../context/StoreContext';

const ExploreFood = () => {
  const [category, setCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const { foodList } = useContext(StoreContext);

  // Build dynamic category list from actual food data
  const allCategories = [...new Set(foodList.map(f => f.category).filter(Boolean))].sort();

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="input-group mb-3">
                <select
                  className="form-select mt-2"
                  style={{ maxWidth: '200px' }}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {allCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Search your Favourite Dish..."
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                />
                <button className="btn btn-primary mt-2" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <FoodDisplay category={category} searchText={searchText} />
    </>
  );
};

export default ExploreFood;
