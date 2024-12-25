import { timeAgo } from '../../components/timeAgo.jsx'; 

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			personas: ["Pedro", "Maria"],
			registerStatus: false,
			filteredUsers: [],
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

			exampleFunction: () => {
				console.log("hola")
				return
			},

			fetchUsers: async () => {
				const token = JSON.parse(localStorage.getItem('access_token')); // Recuperar el token desde localStorage
				try {
					const response = await fetch("https://itransition-task4-web-application-with.onrender.com/admin/users", {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado de autorización
							'Content-Type': 'application/json'
						}
					});
					console.log(response);
			
					if (!response.ok) {
						throw new Error('Error fetching users: ' + response.statusText);
					}
			
					const users = await response.json();
					setStore({ ...getStore(), users });
					console.log(users);
					
				} catch (error) {
					console.error("Error fetching users: ", error);
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

			// blockSelectedUsers: async () => {
			// 	const store = getStore();
			// 	const selectedUsers = store.users.filter(user => user.checked);
			
			// 	try {
			// 		const response = await fetch('/api/block-users', {
			// 			method: 'POST',
			// 			headers: {
			// 				'Content-Type': 'application/json',
			// 			},
			// 			body: JSON.stringify({ users: selectedUsers.map(user => user.id) }),
			// 		});
			// 		if (response.ok) {
			// 			const updatedUsers = store.users.map(user => 
			// 				selectedUsers.includes(user) ? { ...user, blocked: true, checked: false  } : user
			// 			);
			// 			setStore({ ...store, users: updatedUsers });
			// 		}
			// 	} catch (error) {
			// 		console.error("Error blocking users: ", error);
			// 	}
			// },


			// unblockSelectedUsers: async () => {
			// 	const store = getStore();
			// 	const selectedUsers = store.users.filter(user => user.checked);
			
			// 	try {
			// 		const response = await fetch('/api/unblock-users', {
			// 			method: 'POST',
			// 			headers: {
			// 				'Content-Type': 'application/json',
			// 			},
			// 			body: JSON.stringify({ users: selectedUsers.map(user => user.id) }),
			// 		});
			// 		if (response.ok) {
			// 			const updatedUsers = store.users.map(user => 
			// 				selectedUsers.includes(user) ? { ...user, blocked: false, checked: false  } : user
			// 			);
			// 			setStore({ ...store, users: updatedUsers });
			// 		}
			// 	} catch (error) {
			// 		console.error("Error unblocking users: ", error);
			// 	}
			// },
			
			
			deleteSelectedUsers: () => {
				const store = getStore();
				const remainingUsers = store.users.filter(user => !user.checked); // Mantén solo los no seleccionados
				setStore({ ...store, users: remainingUsers });
				},

			// deleteSelectedUsers: async () => {
			// 	const store = getStore();
			// 	const selectedUsers = store.users.filter(user => user.checked);
			
			// 	try {
			// 		const response = await fetch('/api/delete-users', {
			// 			method: 'DELETE',
			// 			headers: {
			// 				'Content-Type': 'application/json',
			// 			},
			// 			body: JSON.stringify({ users: selectedUsers.map(user => user.id) }),
			// 		});
			// 		if (response.ok) {
			// 			const remainingUsers = store.users.filter(user => !selectedUsers.includes(user));
			// 			setStore({ ...store, users: remainingUsers });
			// 		}
			// 	} catch (error) {
			// 		console.error("Error deleting users: ", error);
			// 	}
			// },
				

  
			//REGISTER AND LOGIN 

			registers: async(name, email, password) => {
				try {
					console.log("entra en register")
					const data = {
						name: name,
						email: email,
						password: password
					};

					const response = await fetch("https://itransition-task4-web-application-with.onrender.com/admin/users", {
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
			
					const data = {
						email: email,
						password: password
					};
			
					const response = await fetch("https://itransition-task4-web-application-with.onrender.com/admin/token", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(data)
					});
			
					const statusCode = response.status;
					const responseData = await response.json();
					console.log(responseData);
					
			
					if (statusCode === 200) {
						console.log("Login exitoso, token recibido:", responseData.access_token);

						//localStorage.setItem('access_token', responseData.access_token);
						return responseData;  // Retorna el token para usarlo donde sea necesario
					} else {
						console.log("Error en el login:", responseData.error || "Error desconocido");
					}
			
				} catch (error) {
					console.error("Error durante la autenticación:", error);
					throw error;
				}
			}
			

		}
	};
};

export default getState;

//"https://itransition-task4-web-application-with.onrender.com/admin/users"