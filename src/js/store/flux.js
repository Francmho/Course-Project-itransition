import SalesForce from '../../components/SalesForce.jsx';
import { timeAgo } from '../../components/timeAgo.jsx'; 

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			registerStatus: false,
			isLogged: false,
			language: "",
			theme:"light",
			filteredUsers: [],
			salesForce: false,
			users: [
				{
				  id: 1,
				  name: "Clare, Alex",
				  email: "a_clare42@gmail.com",
				  last_login: "2024-12-10T14:59:30Z", // Simulación de datos para la gráfica
				  checked: true,
				},
				{
				  id: 2,
				  name: "Morrison, Jim",
				  email: "dtimer9@dealyaari.com",
				  lastLogin: "2024-12-09T14:59:30Z",
				  checked: false,
				},
				{
				  id: 3,
				  name: "Simone, Nina",
				  email: "marishabelin@giftcode-ao.com",
				  last_login: "2024-11-10T14:59:30Z",
				  checked: true,
				},
				{
				  id: 4,
				  name: "Nicole, Mora",
				  email: "mora@giftcode-ao.com",
				  last_login: "2024-09-10T14:59:30Z",
				  checked: true,
				},
				// Más usuarios...
			  ]
		},
		actions: {

			setLanguage: (lang) => {
				setStore({ language: lang });
				localStorage.setItem('language', lang);
				console.log("Language switched");
			},

			setTheme: (theme) => {
				setStore({ theme: theme });
				localStorage.setItem('theme', theme);
				console.log("Theme switched", theme);
			},


			salesForceAuth: async () => {
				try {
					const apiUrl = process.env.REACT_APP_API_URL; // Usa localhost si no está definida la URL
        			window.location.href = `${apiUrl}/salesforce/loginSF`;
				} catch (error) {
					console.error('Error al redirigir a Salesforce:', error);
				}
			},

			
			salesForceRegister : async (e) => {
				e.preventDefault();
				const response = await fetch(`${process.env.REACT_APP_API_URL} /salesforce/register`, {
					method: 'POST',
					headers: {
					  'Content-Type': 'application/json',
					},
					body: JSON.stringify({
					  name: e.target.formName.value,
					  email: e.target.formEmail.value,
					  // más datos...
					}),
				  });
				
				//   try {
				// 	// Redirige a la página de autenticación de Salesforce
				// 		window.location.href = `${process.env.REACT_APP_API_URL}/salesforce/loginSF`;
				// 	} catch (error) {
				// 		console.error('Error al redirigir a Salesforce:', error);
				// 	}

				const data = await response.json();
				if (data.success) {
					console.log('Successful Auth Salesforce');
				} else {
					console.log('Error in auth in Salesforce');
				}
			},


			searchUser: (query) => {
				const store = getStore();
			  
				const filteredUsers = store.users.filter(user => {
				  const nameMatches = user.name.toLowerCase().includes(query.toLowerCase());
				  const emailMatches = user.email.toLowerCase().includes(query.toLowerCase());
				  
				  // Calculamos el timeAgo de last_login
				  const lastLoginText = user.last_login ? timeAgo(user.last_login).toLowerCase() : '';
			  
				  // Filtramos por el texto generado por timeAgo
				  const lastLoginMatches = lastLoginText.includes(query.toLowerCase());
			  
				  return nameMatches || emailMatches || lastLoginMatches;
				});
			  
				setStore({ ...store, filteredUsers });
			  },
			

			selectUsers: (userIds, isSelected) => {
				const store = getStore();
				const updatedUsers = store.users.map(user => 
					(userIds.length === 0 || userIds.includes(user.id)) 
					? { ...user, checked: isSelected }  // Cambia el estado de `checked` según `isSelected`
					: user
				);
				setStore({ ...store, users: updatedUsers });
				},


			blockUnblockUsers: (isBlock) => {
				const store = getStore();
				const updatedUsers = store.users.map(user => {
					// Si el usuario está seleccionado, lo bloqueamos o desbloqueamos
					if (user.checked) {
					return {
						...user,
						blocked: isBlock, // Alterna el estado de 'blocked'
						checked: false // Desmarca el usuario después de bloquear/desbloquear
					};
					}
					return user;
				});
				
				setStore({ ...store, users: updatedUsers });
				},

			//SF integration
			// blockUnblockUsers: (isBlock) => {
			// 	const store = getStore();
			// 	const selectedUserIds = store.users.filter(user => user.checked).map(user => user.id);
			
			// 	// Si no hay usuarios seleccionados, no hacemos nada
			// 	if (selectedUserIds.length === 0) {
			// 		return;
			// 	}
			
			// 	fetch(`${process.env.REACT_APP_API_URL}/salesforce/users/block_unblock`, {
			// 		method: 'POST',
			// 		headers: {
			// 			'Content-Type': 'application/json',
			// 		},
			// 		body: JSON.stringify({
			// 			user_ids: selectedUserIds,
			// 			action: isBlock ? 'block' : 'unblock'  // Decide si bloquear o desbloquear
			// 		})
			// 	})
			// 	.then(resp => {
			// 		if (!resp.ok) throw new Error("Error al bloquear/desbloquear usuarios.");
			// 		return resp.json();
			// 	})
			// 	.then(data => {
			// 		const updatedUsers = store.users.map(user => {
			// 			// Si el usuario fue bloqueado/desbloqueado, actualizamos el estado
			// 			if (user.checked) {
			// 				return {
			// 					...user,
			// 					blocked: isBlock, // Alterna el estado de 'blocked'
			// 					checked: false    // Desmarca el usuario después de bloquear/desbloquear
			// 				};
			// 			}
			// 			return user;
			// 		});
			
			// 		setStore({ ...store, users: updatedUsers });
			// 		console.log(data.message);  // Muestra el mensaje recibido desde Flask
			// 	})
			// 	.catch(error => console.error(error));
			// },

			
			
			deleteSelectedUsers: () => {
				const store = getStore();
				const remainingUsers = store.users.filter(user => !user.checked); // Mantén solo los no seleccionados
				setStore({ ...store, users: remainingUsers });
				},

			// SF integration
			// deleteSelectedUsers: () => {
			// 	const store = getStore();
			// 	const selectedUserIds = store.users.filter(user => user.checked).map(user => user.id);
			
			// 	// Si no hay usuarios seleccionados, no hacemos nada
			// 	if (selectedUserIds.length === 0) {
			// 		return;
			// 	}
			
			// 	fetch(`${process.env.REACT_APP_API_URL} + "/salesforce/users/delete"`, {
			// 		method: 'POST',
			// 		headers: {
			// 			'Content-Type': 'application/json',
			// 		},
			// 		body: JSON.stringify({ user_ids: selectedUserIds })
			// 	})
			// 	.then(resp => {
			// 		if (!resp.ok) throw new Error("Error al eliminar usuarios.");
			// 		return resp.json();
			// 	})
			// 	.then(data => {
			// 		const remainingUsers = store.users.filter(user => !selectedUserIds.includes(user.id));  // Filtra los usuarios eliminados
			// 		setStore({ ...store, users: remainingUsers });
			// 		console.log(data.message);  // Muestra el mensaje recibido desde Flask
			// 	})
			// 	.catch(error => console.error(error));
			// },

			//REGISTER AND LOGIN 
			registers: async(name, email, password) => {
				try {
					console.log("enters register (flux)")
					const data = {
						name: name,
						email: email,
						password: password
					};

					const response = await fetch(process.env.REACT_APP_API_URL+ "/admin/users", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(data)
					});

					const statusCode = response.status;
					const responseData = await response.json();
					console.log(responseData)

					if (statusCode === 201) {
						setStore({ ...getStore(), registerStatus: true });
						//
					}
					return responseData


				} catch (error) {
					console.error("Error:", error);
					throw error;
				}
			},

			login: async (email, password) => {
				try {
					console.log("Enters flux-login");

					const response = await fetch(process.env.REACT_APP_API_URL + "/admin/token", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ email, password })
					});
			
					const statusCode = response.status;
					const responseData = await response.json();
					console.log(responseData);
					
					if (statusCode === 200) {
						console.log("Login successful, token received:", responseData.access_token);
						localStorage.setItem('access_token', responseData.access_token);
						// document.cookie = `access_token=${responseData.access_token}; HttpOnly; Secure`;
						setStore({ isLogged: true });
						return responseData;  // Retorna el token para usarlo donde sea necesario
					} else {
						console.log("Error in login:", responseData.error || "Error from backend");
					}
			
				} catch (error) {
					console.error("(Flux) Error during login:", error);
					throw error;
				}
			},

			logout: () => {
                //document.cookie = 'access_token=; Max-Age=0; Secure';
				localStorage.removeItem('access_token'); 
                setStore({ isLogged: false });
				console.log("Logged out successful");
            }
			

		}
	};
};

export default getState;

//"https://itransition-task4-web-application-with.onrender.com/admin/users"
//process.env.REACT_APP_API_URL+