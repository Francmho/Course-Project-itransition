import React, { useContext } from 'react'
import { Context } from '../js/store/appContext.js';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';



const Register = () => {
    const { store, actions } = useContext(Context)
    const { t } = useTranslation("global"); 

    const schema = yup.object({
        name: yup.string().required(t("validations.name_required")),
        email: yup.string().email(t("validations.email_invalid")).required(t("validations.email_required")),
        password: yup.string().min(6, t("validations.password_min_length")).required(t("validations.password_required")),
      }).required();
    
    // Set up react-hook-form with Yup validation
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const handleRegister = (data) => {
        const { name, email, password } = data;
        console.log("ENTRA EN HANDLER REGISTER")
        actions.registers(name, email, password);
      }; 


    return (
    <div 
    className={`card m-5 p-5 ${store.theme === 'dark' ? 'bg-dark text-light border border-light-subtle' : 'bg-light text-dark'}`}
    >
        <h5 className="d-flex mb-4 pt-2 p-5 justify-content-center">Logotype</h5>
        {store.registerStatus && <div className="alert alert-success mt-3">{t('register.successfully_registered')}</div>}
        <form onSubmit={handleSubmit(handleRegister)}>
        <div className="mb-3">
            <label htmlFor="name" className="form-label">{t('register.name')}</label>
            <input
            type="text"
            id="nameId"
            name="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''} ${store.theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}
            {...register('name')}
            />
            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
        </div>

        <div className="mb-3">
            <label htmlFor="email" className="form-label">{t('common.email')}</label>
            <input
            type="email"
            id="emailId"
            name="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''} ${store.theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}
            {...register('email')}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>

        <div className="mb-3">
            <label htmlFor="password" className="form-label">{t('common.password')}</label>
            <input
            type="password"
            id="passwordId"
            name="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''} ${store.theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}
            {...register('password')}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>

        <button type="submit" className="btn btn-primary">{t('common.register')}</button>
        </form>


        </div>
    );
};

export default Register;