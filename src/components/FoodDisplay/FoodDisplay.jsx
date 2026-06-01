import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import Fooditem from '../Fooditem/Fooditem';

const FoodDisplay = ({ category, searchText }) => {
  const { foodList, loading } = useContext(StoreContext);

  const filteredFoods = foodList.filter(
    food =>
      (category === 'All' || food.category === category) &&
      food.name.toLowerCase().includes((searchText || '').toLowerCase())
  );

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="placeholder-glow">
                  <div className="placeholder bg-secondary" style={{ height: 200, width: '100%' }}></div>
                </div>
                <div className="card-body">
                  <h5 className="placeholder-glow">
                    <span className="placeholder col-8"></span>
                  </h5>
                  <p className="placeholder-glow">
                    <span className="placeholder col-12"></span>
                    <span className="placeholder col-10"></span>
                  </p>
                  <span className="placeholder col-4"></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredFoods.length === 0) {
    return (
      <div className="container text-center py-5">
        <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>
        <h5 className="text-muted">No food found</h5>
        <p className="text-muted small">
          {searchText
            ? `No results for "${searchText}"`
            : category !== 'All'
            ? `No items in "${category}" category yet`
            : 'No food items available. Check back soon!'}
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        {filteredFoods.map((food) => (
          <Fooditem
            key={food.id}
            name={food.name}
            description={food.description}
            id={food.id}
            price={food.price}
            imageUrl={food.imageUrl}
            category={food.category}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
