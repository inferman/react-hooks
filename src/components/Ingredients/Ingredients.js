import React, {useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import IngredientsList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const url = 'https://react-http-d27a2.firebaseio.com/ingredients.json';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const filterHandler = useCallback(filteredIngredients => {setIngredients(filteredIngredients)}, [])

  const deleteIngredientReq = (ingredientId) => (
    fetch(`https://react-http-d27a2.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    })
  )

  const addIngredientsHandler = (ingredient) => {
    setLoading(true);
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        setLoading(false);
        return response.json()
      })
      .then(res => {setIngredients(prevIngredient => [...prevIngredient, {id: res.name, ...ingredient}])})
  }
  const removeIngredientHandler = id => {
    setLoading(true);
    deleteIngredientReq(id)
      .then(setIngredients(prevIngredient => prevIngredient.filter(i => i.id !== id)))
      .then(() => {setLoading(false)})
      .catch(err => {
        setError('Something went wrong');
        setLoading(false);
      })
  }

  const clearError = () => { setError(null) }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientsHandler} loading={isLoading}/>

      <section>
        <Search onLoadIgrediants={filterHandler}/>
        <IngredientsList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
