import React, { useContext } from 'react';
import { Context } from '../js/store/appContext.js';
import { useNavigate } from 'react-router-dom'; 
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';



const Login = () => {
  const { store, actions } = useContext(Context);
  const { t } = useTranslation("global"); 
  const navigate = useNavigate(); 
  
  const schema = yup.object({
    email: yup.string().email(t("validations.email_invalid")).required(t("validations.email_required")),
    password: yup.string().min(6,  t("validations.password_min_length")).required(t("validations.password_required")),
  }).required();

   // Use useForm with Yup validation
   const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });


  const handleLogin = async (data) => {
    const { email, password } = data;
    try {
        const userData = await actions.login(email, password);
        if (userData) {
          navigate('/adminpage');
        }
      } catch (error) {
        console.error("Error de login:", error);
      }
  };
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-6">
          <div className={`card m-5 p-5 
            ${store.theme === 'dark' ? 'bg-dark text-light border border-light-subtle' : 'bg-light text-dark'}`}>
            <h1 className="d-flex m-4 pt-2 justify-content-center fs-5">{t('common.login')}</h1>
            <h5 className="d-flex m-5 p-1 justify-content-center">Logotype</h5>
  
            <form onSubmit={handleSubmit(handleLogin)}>
              <div className="my-3">
                <label htmlFor="email" className="form-label">{t('common.email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''} ${store.theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}
                  {...register('email')}  // Registering input with react-hook-form
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>
  
              <div className="mb-3">
                <label htmlFor="password" className="form-label">{t('common.password')}</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''} ${store.theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}
                  {...register('password')}  // Registering input with react-hook-form
                />
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </div>
  
              <button type="submit" className="btn btn-primary w-100">{t('common.login')}</button>
            </form>
  
            {/* Display error if login fails */}
            {store.loginError && <div className="alert alert-danger mt-3">{store.loginError}</div>}
          </div>
        </div>
      </div>
    </div>
  );
  

};

export default Login;


  // return (
  //   <div className={`card m-5 p-5 ${store.theme === 'dark' ? 'bg-dark text-light border border-light-subtle' : 'bg-light text-dark'}`}>
  //     <h2 className="d-flex mb-4 pt-2 p-5 justify-content-center">{t('common.login')}</h2>
  //     <h5 className="d-flex mb-5 p-1 justify-content-center">Logotype</h5>

  //     <form onSubmit={handleSubmit(handleLogin)}>
  //       <div className="mb-3">
  //         <label htmlFor="email" className="form-label">{t('common.email')}</label>
  //         <input
  //           type="email"
  //           id="email"
  //           name="email"
  //           className={`form-control  ${errors.email ? 'is-invalid' : ''} ${store.theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}
  //           {...register('email')}  // Registering input with react-hook-form
  //         />
  //         {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
  //       </div>

  //       <div className="mb-3">
  //         <label htmlFor="password" className="form-label">{t('common.password')}</label>
  //         <input
  //           type="password"
  //           id="password"
  //           name="password"
  //           className={`form-control ${errors.password ? 'is-invalid' : ''} ${store.theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}
  //           {...register('password')}  // Registering input with react-hook-form
  //         />
  //         {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
  //       </div>

  //       <button type="submit" className="btn btn-primary">{t('common.login')}</button>
  //     </form>

  //     {/* Display error if login fails */}
  //     {store.loginError && <div className="alert alert-danger mt-3">{store.loginError}</div>}
  //   </div>
  // );