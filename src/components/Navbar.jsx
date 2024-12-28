import React, { useState, useContext } from 'react';
import { Context } from '../js/store/appContext.js';  // Asegúrate de que sea el contexto correcto de tu aplicación
import { Link, useNavigate } from 'react-router-dom';
import Register from '../views/Register.jsx'; // El componente de Register


const Navbar = () => {
  const { store, actions } = useContext(Context); // Accede al estado de autenticación desde el Contexto
  const [showRegister, setShowRegister] = useState(false); // Controla la visibilidad del Offcanvas para el registro
  const navigate = useNavigate(); 

  const handleShow = () => setShowRegister(true);
  const handleClose = () => setShowRegister(false);

  // const isLogged = store.isLogged;  // Obtener si está logueado
  // const registerStatus = store.registerStatus;  // Obtener si ya está registrado

  const logOut = () => {
    actions.logout(); 
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand mx-3" to="/">LogoApp</Link>
       
        <div id="navbarNav">
          <ul className="navbar-nav">
            {!store.registerStatus && !store.isLogged && (
              <li className="nav-item">
                <button className="btn btn-sm btn-outline-primary mx-3" onClick={handleShow}>Register</button>
              </li>
            )}
            {store.isLogged && (
              <li className="nav-item">
                <button className="btn btn-sm btn-outline-secondary mx-3" onClick={logOut}>Log Out</button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      <div className={`offcanvas offcanvas-start ${showRegister ? 'show' : ''}`} tabIndex="-1" id="offcanvasRegister" aria-labelledby="offcanvasRegisterLabel" data-bs-scroll="true" data-bs-backdrop="true">
        <div className="offcanvas-header">
          <h5 id="offcanvasRegisterLabel">Register</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" onClick={handleClose}></button>
        </div>
        <div className="offcanvas-body">
          <Register/>
        </div>
      </div>
    </>
  );

};

export default Navbar;

// import React, { useState, useContext } from 'react';
// import { Context } from '../js/store/appContext.js';  // Asegúrate de que sea el contexto correcto de tu aplicación
// import { Link } from 'react-router-dom';
// import Register from '../views/Register.jsx'; // El componente de Register


// const Navbar = () => {
//   const { store, actions } = useContext(Context); // Accede al estado de autenticación desde el Contexto
//   const [showRegister, setShowRegister] = useState(false); // Controla la visibilidad del Offcanvas para el registro

//   const handleShow = () => setShowRegister(true);
//   const handleClose = () => setShowRegister(false);

//   return (
//     <>
//       <nav className="navbar navbar-expand-lg navbar-light bg-light">
//         <Link className="navbar-brand" to="/">MyApp</Link>
       
//         <div id="navbarNav">
//           <ul className="navbar-nav">
//             {!isLogged && (
//               <li className="nav-item">
//                 <button className="btn btn-outline-primary" onClick={handleShow}>Register</button>
//               </li>
//             )}
//             {isLogged && (
//               <li className="nav-item">
//                 <button className="btn btn-outline-secondary" onClick={logOut}>Log Out</button>
//               </li>
//             )}
//           </ul>
//         </div>
//       </nav>

//       <div className={`offcanvas offcanvas-start ${showRegister ? 'show' : ''}`} tabIndex="-1" id="offcanvasRegister" aria-labelledby="offcanvasRegisterLabel">
//         <div className="offcanvas-header">
//           <h5 id="offcanvasRegisterLabel">Register</h5>
//           <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" onClick={handleClose}></button>
//         </div>
//         <div className="offcanvas-body">
//           <Register/>
//         </div>
//       </div>
//     </>
//   );

// };

// export default Navbar;

// import React from 'react'
// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   return (
//     <div>
//         Navbar
//         <li> <Link to="/">Home</Link> </li>
//         <li> <Link to="/contact">Contact</Link> </li>

//     </div>
//   )
// }

// export default Navbar