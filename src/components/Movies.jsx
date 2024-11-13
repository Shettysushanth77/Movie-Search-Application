import React, { useReducer, useState } from 'react';
import "./Movies.css"
import noimg from "../../public/images/noimages.png"


const ACTIONS = {
    MAKE_REQUEST: 'make-request',
    GET_DATA: 'get-data',
    ERROR: 'error',
};


const initialState = {
    movies: [],
    loading: false,
    error: false,
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.MAKE_REQUEST:
            return { ...state, loading: true, error: false, movies: [] };
        case ACTIONS.GET_DATA:
            return { ...state, loading: false, movies: action.payload, error: false };
        case ACTIONS.ERROR:
            return { ...state, loading: false, error: true, movies: [] };
        default:
            return state;
    }
}

function MovieSearch() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const [query, setQuery] = useState('');

    
    const fetchMovies = async () => {
        if (!query) return; 

        
        dispatch({ type: ACTIONS.MAKE_REQUEST });

        try {
            const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=5b0e82b5`);
            const data = await response.json();
            console.log(data);

            if (data.Response === 'True') {
                dispatch({ type: ACTIONS.GET_DATA, payload: data.Search });
            } else {
                dispatch({ type: ACTIONS.ERROR });
            }
        } catch (error) {
            dispatch({ type: ACTIONS.ERROR });
        }
    };


    const handleSearch = (e) => {
        e.preventDefault(); 
        fetchMovies(); 
    };

    return (
        <section className='main'>
            <div className="topsection">
                <div className="heading">
                <h1>Movies</h1>
                </div>
                <div className="searchbar">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Enter movie title"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
                </div>
            </div>
            <div className='load'>
            {state.loading && <p>Loading...</p>} 
            {state.error && <p>Error fetching data.</p>} 
            </div>
            <div className='cards'>
                {state.movies.length > 0 && (
                    <ul>
                        {state.movies.map((movie) => (
                            <li key={movie.imdbID}>
                                <div className='contents'>
                                    <h1>{movie.Title}</h1>
                                    <img src={(movie.Poster === "N/A")?noimg:movie.Poster} alt="" />
                                    <h3>{movie.Year}</h3>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

export default MovieSearch;
