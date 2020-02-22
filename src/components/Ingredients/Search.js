import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const url = 'https://react-http-d27a2.firebaseio.com/ingredients.json';

const Search = React.memo(props => {
  const {onLoadIgrediants} = props;
  const [ filteringChar, setfilteringChar ] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      if(filteringChar === inputRef.current.value) getIngredients()
    }, 1000);
    ;
  }, [filteringChar, onLoadIgrediants, inputRef]);

  const getIngredients = () => {
    const query = filteringChar.length ? `?orderBy="title"&equalTo="${filteringChar}"` : '';
    fetch(url+query)
      .then(response => response.json())
      .then(res => {
        const data = [];
        for(const key in res) {
          data.push({
            id: key,
            title: res[key].title,
            amount: res[key].amount,
          })
        }
        onLoadIgrediants(data)
        //...
      })
  }

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" value={filteringChar} onChange={e => setfilteringChar(e.target.value)} ref={inputRef} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
