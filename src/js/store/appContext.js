import React, { useState, useEffect  } from "react";
import getState from "./flux.js";


export const Context = React.createContext({});

const injectContext = PassedComponent => {
	const StoreWrapper = props => {
		//this will be passed as the contenxt value
		const [state, setState] = useState(
			getState({
				getStore: () => state.store,
				getActions: () => state.actions,
				setStore: updatedStore =>
					setState({
						store: Object.assign(state.store, updatedStore),
						actions: { ...state.actions }
					})
			})
		);

		useEffect(() => {
            const token = localStorage.getItem("access_token");
            if (token) {
                setState((prevState) => ({
                    ...prevState,
                    store: { 
                        ...prevState.store, 
                        isLogged: true, 
                        registerStatus: true, // Si el usuario está logueado, asumimos que está registrado
                    },
                }));
            } else {
                setState((prevState) => ({
                    ...prevState,
                    store: { 
                        ...prevState.store, 
                        isLogged: false, 
                        registerStatus: false,
                    },
                }));
            }
        }, []); 

        const setLanguage = (lang) => {
            setState(prevState => ({
                ...prevState,
                store: {
                    ...prevState.store,
                    language: lang
                }
            }));
            //localStorage.setItem("language", lang); 
        };

        const setTheme = (newTheme) => {
            setState(prevState => ({
                ...prevState,
                store: {
                    ...prevState.store,
                    theme: newTheme
                }
            }));
            //localStorage.setItem("theme", newTheme); 
        };


		return (
			<Context.Provider value={{ ...state, setLanguage, setTheme  }}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};
	return StoreWrapper;
};

export default injectContext;