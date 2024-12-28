import React, { useState } from "react";
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


		// // State for user login
        // const [isLoggedIn, setIsLoggedIn] = useState(false);
		// const { actions } = state;
		// const token = localStorage.getItem('access_token');

		// useEffect(() => {
		// 	  if (token) {
		// 		setIsLoggedIn(true);
		// 		actions.fetchUsers();
		// 	}
		// }, [token, actions]);

		// // Functions for login management
        // const logIn = async (email, password) => {
		// 	try {
		// 		// Aquí llamas al login de flux para realizar la solicitud y obtener el responseData
		// 		const userData = await actions.login(email, password);
		
		// 		// Si la respuesta es exitosa y contiene el token
		// 		if (userData && userData.access_token) {
		// 			setIsLoggedIn(true);  
		// 			localStorage.setItem('access_token', JSON.stringify(userData.access_token));  // Guardas todo en localStorage
		// 		}
		// 	} catch (error) {
		// 		console.error("(AppContext) Error during login:", error);
		// 	}
		// };
		

		// const logOut = () => {
        //     setIsLoggedIn(false);
		// 	localStorage.removeItem('access_token');
        // };


		return (
			<Context.Provider value={{ ...state }}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};
	return StoreWrapper;
};

export default injectContext;