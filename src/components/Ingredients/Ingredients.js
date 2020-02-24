import React, {useReducer, useCallback} from 'react';

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

const httpReducer = (httpState, action) => {
  switch(action.type) {
    case 'REQUEST':
      return {...httpState, loading: true}
    case 'FAIL':
      return {loading: false, error: action.error}
    case 'COMPLETE':
    case 'CLEAR':
      return {loading: false, error: null}
    default:
      throw new Error('some thing went wrong')
  }
}

const url = 'https://react-http-d27a2.firebaseio.com/ingredients.json';

const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingredientsReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null})

  const filterHandler = useCallback(filteredIngredients => {dispatch({type: 'SET', ingredients: filteredIngredients})}, [])

  const deleteIngredientReq = (ingredientId) => (
    fetch(`https://react-http-d27a2.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    })
  )

  const addIngredientsHandler = (ingredient) => {
    dispatchHttp({type: 'REQUEST'})
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        dispatchHttp({type: 'COMPLETE'})
        return response.json()
      })
      .then(res => {dispatch({type: 'ADD', ingredient: {id: res.name, ...ingredient}})})
  }
  const removeIngredientHandler = id => {
    dispatchHttp({type: 'REQUEST'})
    deleteIngredientReq(id)
      .then(dispatch({type: 'DELETE', id}))
      .then(() => {dispatchHttp({type: 'COMPLETE'})})
      .catch(err => {
        dispatchHttp({type: 'FAIL', error: 'Something went wrong'})
      })
  }

  const clearError = () => { dispatchHttp({type: 'CLEAR'}) }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientsHandler} loading={httpState.loading}/>

      <section>
        <Search onLoadIgrediants={filterHandler}/>
        <IngredientsList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
