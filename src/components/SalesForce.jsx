import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../js/store/appContext.js'; 
import { useTranslation } from 'react-i18next';

const SalesForce = () => {
  const { store, actions } = useContext(Context);
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');

  const { name, email } = useParams();

  useEffect(() => {
      if (name && email) {
          setFormName(name);
          setFormEmail(email);
          handleShow();  // Abre el offcanvas automáticamente
      }
  }, [name, email]);

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const name = urlParams.get('name');
//     const email = urlParams.get('email');

//     if (name && email) {
//         setFormName(name);
//         setFormEmail(email);
//         handleShow();  // Abre el offcanvas automáticamente
//     }
// }, []);


  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleAuth = () => {
    actions.salesForceAuth();
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Lógica para obtener token de Salesforce y crear cuenta
    actions.salesForceRegister()
  };


  return (
    <div>
      <button className={`btn btn-sm ${store.theme === 'dark' ? 'btn-light' : 'btn-light border-dark'}`} onClick={handleAuth}>
        {/* onClick={() => { handleShow(); handleAuth(); }} // Llama a ambas funciones */}
        {t('register.register_sf')}
      </button>

      {show && (
        <div className={`card mt-5 p-5 offcanvas offcanvas-start show
        ${store.theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`} style={{ visibility: 'visible' }}>
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">{t('register.register_sf')}</h5>
            <button type="button" className={`btn-close ${store.theme === 'dark' ? 'btn-close-white' : ''}`} onClick={handleClose}></button>
          </div>
          <div className="offcanvas-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name">{t('register.name')}</label>
                <input type="text" id="name" name="name" value={formName} placeholder={t('register.enter_name')} className="form-control" />
              </div>
              <div className="mb-3">
                <label htmlFor="email">{t('register.email')}</label>
                <input type="text" id="email" email="email" value={formEmail} placeholder={t('register.enter_email')} className="form-control" />
              </div>
              <div className="mb-3">
                <label htmlFor="password">{t('common.password')}</label>
                <input type="password" id="password" placeholder={t('register.enter_password')} className="form-control" />
              </div>
              <div className="mb-3">
                <label for="city" className="form-label">{t('register.city')}</label>
                <input type="text" className="form-control" id="city" name="city" placeholder={t('register.enter_city')} required/>
              </div>
              <div className="mb-3">
                <label for="zip_code" className="form-label">{t('register.zip_code')}</label>
                <input type="text" className="form-control" id="zip_code" name="zip_code" placeholder={t('register.enter_zip_code')} required/>
              </div>
              <div className="mb-3">
                <label for="phone" className="form-label">{t('register.phone')}</label>
                <input type="text" className="form-control" id="phone" name="phone" placeholder={t('register.enter_phone')} required/>
              </div>

              <button type="submit" className="btn btn-success">{t('register.submit')}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default SalesForce;

