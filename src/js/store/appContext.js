import React, { useState, useEffect  } from "react";
import getState from "./flux.js";
import i18n from "i18next";


export const Context = React.createContext({});

const injectContext = PassedComponent => {
	const StoreWrapper = props => {
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
            const savedLanguage = localStorage.getItem('language') || 'en';
            const savedTheme = localStorage.getItem("theme") || "system"; 
        
            setState((prevState) => ({
                ...prevState,
                store: { 
                    ...prevState.store, 
                    isLogged: !!token,  
                    language: savedLanguage,
                    theme: savedTheme,
                },
            }));
        
            i18n.changeLanguage(savedLanguage);
            
            const body = document.body;
            const currentTheme = savedTheme === 'system' ? 'light' : savedTheme;
            
            // Actualizamos el tema y el fondo con el valor guardado en localStorage
            if (currentTheme === 'dark') {
                body.classList.remove('bg-light');
                body.classList.add('bg-dark');
            } else {
                body.classList.remove('bg-dark');
                body.classList.add('bg-light');
            }
        }, []); 
        
		// useEffect(() => {
        //     const token = localStorage.getItem("access_token");
        //     const savedLanguage = localStorage.getItem('language') || 'en';
        //     const savedTheme = localStorage.getItem("theme") || "system"; 
        //     if (token) {
        //         setState((prevState) => ({
        //             ...prevState,
        //             store: { 
        //                 ...prevState.store, 
        //                 isLogged: true, 
        //                 registerStatus: true,
        //                 language: savedLanguage,
        //                 theme: savedTheme,  // Si el usuario está logueado, asumimos que está registrado
        //             },
        //         }));
        //         i18n.changeLanguage(savedLanguage);
        //         setTheme(savedTheme);
        //     } else {
        //         setState((prevState) => ({
        //             ...prevState,
        //             store: { 
        //                 ...prevState.store, 
        //                 isLogged: false, 
        //                 registerStatus: false,
        //                 language: savedLanguage,
        //                 theme: savedTheme,
        //             },
        //         }));
        //     }
        //     document.body.classList.add(savedTheme === 'dark' ? 'bg-dark' : 'bg-light');

        // }, []); 

        useEffect(() => {
            const theme = state.store.theme;
        
            // Seleccionar el body
            const body = document.body;
        
            // Limpiar las clases previas
            body.classList.remove('bg-light', 'bg-dark');
        
            // Agregar la clase correspondiente al nuevo tema
            if (theme === 'dark') {
                body.classList.add('bg-dark');
            } else {
                body.classList.add('bg-light');
            }
        }, [state.store.theme]); 

        // const setTheme = (theme) => {
        //     setState(prevState => ({
        //         ...prevState,
        //         store: {
        //             ...prevState.store,
        //             theme: theme
        //         }
        //     }));
        //     localStorage.setItem("theme", theme); 
        //     document.body.classList.remove('bg-light', 'bg-dark'); // Removemos las clases anteriores
        //     document.body.classList.add(theme === 'dark' ? 'bg-dark' : 'bg-light');
        // };


        // useEffect(() => {
        //     document.body.setAttribute('data-theme', state.store.theme); // Cambia el atributo data-theme en body
        //   }, [state.store.theme]);
    

		return (
			<Context.Provider value={{ ...state }}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};
	return StoreWrapper;
};

export default injectContext;