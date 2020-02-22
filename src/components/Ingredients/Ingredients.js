import React, {useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import IngredientsList from './IngredientList';
import Search from './Search';

const url = 'https://react-http-d27a2.firebaseio.com/ingredients.json';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  const filterHandler = useCallback(filteredIngredients => {setIngredients(filteredIngredients)}, [])

  const deleteIngredientReq = (ingredientId) => (
    fetch(`https://react-http-d27a2.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    })
  )

  const addIngredientsHandler = (ingredient) => {
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(res => {setIngredients(prevIngredient => [...prevIngredient, {id: res.name, ...ingredient}])})
  }
  const removeIngredientHandler = id => {
    deleteIngredientReq(id)
      .then(setIngredients(prevIngredient => prevIngredient.filter(i => i.id !== id)))
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientsHandler}/>

      <section>
        <Search onLoadIgrediants={filterHandler}/>
        <IngredientsList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
