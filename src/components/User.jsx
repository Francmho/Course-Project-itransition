import React, { useContext, useState } from "react";
import { Context } from "../js/store/appContext";
import { timeAgo } from "./timeAgo";

const User = ({ selectAll, onSelectAllChange }) => {
  const { store, actions } = useContext(Context); // Asumiendo que tienes los usuarios en el store
  //const [selectAll, setSelectAll] = useState(false); // Estado para manejar el checkbox de "seleccionar todos"




    // Función unificada para calcular el progreso y obtener el color de la barra
const calculateProgressAndColor = (isoDate, maxTimeInMonths = 3) => {
  const now = new Date();
  const timeDifference = now - new Date(isoDate);

  // Calculamos el tiempo máximo en milisegundos (maxTimeInMonths es el valor flexible de los meses)
  const maxTime = maxTimeInMonths * 30 * 24 * 60 * 60 * 1000; // Tiempo máximo en milisegundos

  // Cálculo de progreso: 0% es el tiempo máximo y 100% es el tiempo mínimo (hace menos de un minuto)
  const progress = Math.max(0, Math.min(100, (1 - (timeDifference / maxTime)) * 100)); 

  // Determinamos el color de la barra basado en el progreso
  let color;
  if (progress === 0) color = "gray"; 
  else if (progress <= 20) color = "black"; 
  else if (progress <= 40) color = "red"; 
  else if (progress <= 60) color = "orange"; 
  else if (progress <= 80) color = "yellow"; 
  else color = "green"; // Verde para el progreso superior al 80%

  return { progress, color };
};


  // Maneja la selección o deselección de todos los usuarios
  // const toggleSelectAll = () => {
  //   setSelectAll(!selectAll);
  //   actions.selectUsers([],!selectAll); // Accion para seleccionar o deseleccionar todos los usuarios
    
  // };

   // Maneja la selección individual de un usuario
   const handleSelectUser = (userId) => {
    const isSelected = store.users.find(user => user.id === userId).checked;
    actions.selectUsers([userId], !isSelected); // Cambia el estado de un solo usuario
    
  };
  

  return (
    <div className="container">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">
              <input 
              type="checkbox" 
              checked={selectAll}
              onChange={onSelectAllChange} //AdminPage.jsx
              /> 
            </th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {(store.filteredUsers.length > 0 ? store.filteredUsers : store.users).map((user) => (
            <tr key={user.id}>
              <td>
                <input 
                type="checkbox" 
                checked={user.checked} 
                onChange={() => handleSelectUser(user.id)} // Selecciona o deselecciona un solo usuario
                />
              </td>
              <td className={user.blocked ? "text-decoration-line-through text-muted" : ""}>
                {user.name}
              </td>
              <td className={user.blocked ? "text-muted" : ""}>
                {user.email}
              </td>
              <td>
                <div>
                  <small className={user.blocked ? "text-muted" : ""}>
                    {timeAgo(user.last_login)}
                  </small>
                </div>
                <div className="progress" style={{ height: "5px" }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ 
                      width: `${calculateProgressAndColor(user.last_login).progress}%`, // Calcula el progreso en base a los meses
                      backgroundColor: calculateProgressAndColor(user.last_login).color // Determina el color
                    }}
                    aria-valuenow={calculateProgressAndColor(user.last_login).progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default User;
