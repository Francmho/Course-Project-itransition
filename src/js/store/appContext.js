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
                // Actualizamos el estado solo una vez para no duplicar setStore
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


		return (
			<Context.Provider value={{ ...state }}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};
	return StoreWrapper;
};

export default injectContext;