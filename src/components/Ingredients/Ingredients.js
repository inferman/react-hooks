import React, {useState, useReducer, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import IngredientsList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientsReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id)
    default:
      throw new Error('some thing went wrong with reducer')
  }
}

const url = 'https://react-http-d27a2.firebaseio.com/ingredients.json';

const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingredientsReducer, []);
  // const [ingredients, setIngredients] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const filterHandler = useCallback(filteredIngredients => {dispatch({type: 'SET', ingredients: filteredIngredients})}, [])

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
      .then(res => {dispatch({type: 'ADD', ingredient: {id: res.name, ...ingredient}})})
  }
  const removeIngredientHandler = id => {
    setLoading(true);
    deleteIngredientReq(id)
      .then(dispatch({type: 'DELETE', id}))
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
