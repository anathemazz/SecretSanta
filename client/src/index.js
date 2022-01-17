import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Users_santa from "./tainy_santa/Users_santa";

export const Context = createContext(null)


ReactDOM.render(
    <Context.Provider value={{
        user: new Users_santa()
    }}>
        <App />
    </Context.Provider>,
  document.getElementById('root')
);


