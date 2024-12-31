import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../js/store/appContext.js';  // Asegúrate de que sea el contexto correcto de tu aplicación
import { Link, useNavigate } from 'react-router-dom';
import Register from '../views/Register.jsx'; // El componente de Register
import { useTranslation } from 'react-i18next';


const Navbar = () => {
  const { store, actions, setTheme } = useContext(Context); // Accede al estado de autenticación desde el Contexto
  const [showRegister, setShowRegister] = useState(false); // Controla la visibilidad del Offcanvas para el registro
  const navigate = useNavigate(); 
  const { t , i18n } = useTranslation("global");
  
  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleSetTheme = (newTheme) => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);  // Asegúrate de que setTheme esté definido correctamente
  };

  const handleShow = () => setShowRegister(true);
  const handleClose = () => setShowRegister(false);

  useEffect(() => {
    if (store.theme === "light") {
      document.body.classList.remove("bg-dark");
      document.body.classList.add("bg-light");
    } else if (store.theme === "dark") {
      document.body.classList.remove("bg-light");
      document.body.classList.add("bg-dark");
    } else {
      document.body.classList.remove("bg-light", "bg-dark"); // Tema del sistema
    }
  }, [store.theme]);

  const logOut = () => {
    actions.logout(); 
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand mx-3" to="/">LogoApp</Link>
       
        <div className="dropdown">
          <button className="btn btn-light dropdown-toggle" type="button" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false" aria-haspopup="true"
          > <i className="fa-solid fa-language"></i>
          </button>
          <ul className="dropdown-menu" aria-labelledby="languageDropdown" role="menu">
            <li role="none"><button className="dropdown-item" role="menuitem" onClick={() => handleChangeLanguage('en')} >English </button> </li>
            <li role="none"> <button className="dropdown-item" role="menuitem" onClick={() => handleChangeLanguage('es')} >Español  </button> </li>
          </ul>
        </div>

        <div className="dropdown mx-3">
          <button className="btn btn-light dropdown-toggle" type="button" id="themeDropdown" data-bs-toggle="dropdown" aria-expanded="false" aria-haspopup="true" >
            <i className="fa-solid fa-moon"></i>
          </button>
          <ul className="dropdown-menu" aria-labelledby="themeDropdown">
            <li role="none"><button className="dropdown-item" role="menuitem" onClick={() => handleSetTheme('light')}>{t('theme.light_mode')}</button></li>
            <li role="none"><button className="dropdown-item" role="menuitem" onClick={() => handleSetTheme('dark')}>{t('theme.dark_mode')}</button></li>
            <li role="none"><button className="dropdown-item" role="menuitem" onClick={() => handleSetTheme('system')}>{t('theme.system_mode')}</button></li>
          </ul>
        </div>

        <div id="navbarNav">
          <ul className="navbar-nav">
            {!store.registerStatus && !store.isLogged && (
              <li className="nav-item">
                <button className="btn btn-sm btn-outline-primary mx-3" onClick={handleShow}>{t('common.register')}</button>
              </li>
            )}
            {store.isLogged && (
              <li className="nav-item">
                <button className="btn btn-sm btn-outline-secondary mx-3" onClick={logOut}>{t('common.log_out')}</button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      <div className={`offcanvas offcanvas-start ${showRegister ? 'show' : ''}`} tabIndex="-1" id="offcanvasRegister" aria-labelledby="offcanvasRegisterLabel" data-bs-scroll="true" data-bs-backdrop="true">
        <div className="offcanvas-header">
          <h5 id="offcanvasRegisterLabel">{t('common.register')}</h5>
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