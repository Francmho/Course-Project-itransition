import React, { useState, useContext } from 'react';
import { Context } from '../js/store/appContext.js';  // Asegúrate de que sea el contexto correcto de tu aplicación
import { Link, useNavigate } from 'react-router-dom';
import Register from '../views/Register.jsx'; // El componente de Register
import { useTranslation } from 'react-i18next';


const Navbar = () => {
  const { store, actions } = useContext(Context); // Accede al estado de autenticación desde el Contexto
  const [showRegister, setShowRegister] = useState(false); // Controla la visibilidad del Offcanvas para el registro
  const navigate = useNavigate(); 
  const { t , i18n } = useTranslation("global");

  

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    actions.setLanguage(lang);
  };

  const handleThemeChange = (theme) => {
    actions.setTheme(theme);
  };


  const handleShow = () => setShowRegister(true);
  const handleClose = () => setShowRegister(false);

  const logOut = () => {
    actions.logout(); 
    navigate("/");
  };


  return (
    <>
      <nav className={`navbar navbar-expand ${store.theme === 'dark' ? 'bg-dark text-light navbar-light' : 'bg-light text-dark navbar-dark'}`}>
        <Link className="navbar-brand mx-3" to="/">LogoApp</Link>
        <div className="container-fluid d-flex flex-wrap">
          <div className="d-flex ms-auto">
            <div className="dropdown">
              <button className="btn btn-light dropdown-toggle" type="button" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false" aria-haspopup="true"
              > <i className="fa-solid fa-language"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown" role="menu">
                <li role="none"><button className="dropdown-item" role="menuitem" onClick={() => handleChangeLanguage('en')} >English</button> </li>
                <li role="none"> <button className="dropdown-item" role="menuitem" onClick={() => handleChangeLanguage('es')} >Español</button> </li>
              </ul>
            </div>

            <div className="dropdown mx-3">
              <button className="btn btn-light dropdown-toggle" type="button" id="themeDropdown" data-bs-toggle="dropdown" aria-expanded="false" aria-haspopup="true" >
                <i className="fa-solid fa-moon"></i>
              </button>
              <ul className="dropdown-menu" aria-labelledby="themeDropdown">
                <li role="none"><button className="dropdown-item" role="menuitem" onClick={() => handleThemeChange('light')}>{t('theme.light_mode')}</button></li>
                <li role="none"><button className="dropdown-item" role="menuitem" onClick={() => handleThemeChange('dark')}>{t('theme.dark_mode')}</button></li>
                {/* <li role="none"><button className="dropdown-item" role="menuitem" onClick={() => handleThemeChange('system')}>{t('theme.system_mode')}</button></li> */}
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
          </div>
        </div>
      </nav>
      <div className={`offcanvas offcanvas-start ${showRegister ? 'show' : ''} 
      ${store.theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}
      ${store.isLogged ? 'alert alert-success' : ''}
      `} tabIndex="-1" id="offcanvasRegister" aria-labelledby="offcanvasRegisterLabel" data-bs-scroll="true" data-bs-backdrop="true">
        <div className="offcanvas-header fs-5">
          <h5 className="offcanvas-title" id="offcanvasRegisterLabel">{t('common.register')}</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close" 
          onClick={handleClose}
          ></button>
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