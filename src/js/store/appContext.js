import React, { useState, useEffect } from "react";
import getState from "./flux.js";
import Navbar from "../../components/Navbar.jsx";
import Login from "../../views/Login.jsx";


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


		// State for user login
        const [isLoggedIn, setIsLoggedIn] = useState(false);
        const [user, setUser] = useState(null);
		const { actions } = state;

		useEffect(() => {
			const token = localStorage.getItem('access_token');
			  if (token) {
				   setIsLoggedIn(true);
				const userData = JSON.parse(localStorage.getItem('user_data')); // O la decodificación del token si es necesario
				setUser(userData);
				console.log(token);
				actions.fetchUsers();
			}
		}, []);

		// Functions for login management
        const logIn = async (email, password) => {
			try {
				// Aquí llamas al login de flux para realizar la solicitud y obtener el responseData
				const userData = await actions.login(email, password);
		
				// Si la respuesta es exitosa y contiene el token
				if (userData && userData.access_token) {
					setIsLoggedIn(true);  
					setUser(userData);  // Guardas todo el userData como el usuario
					localStorage.setItem('access_token', JSON.stringify(userData.access_token));  // Guardas todo en localStorage
				}
			} catch (error) {
				console.error("(AppContext) Error during login:", error);
			}
		};
		

		const logOut = () => {
            setIsLoggedIn(false);
            setUser(null);
			localStorage.removeItem('access_token');
        };


		return (
			<Context.Provider value={{ ...state, isLoggedIn, user, logIn, logOut }}>
				{/* <Navbar/> */}
				{/* <Login/> */}
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};
	return StoreWrapper;
};

export default injectContext;