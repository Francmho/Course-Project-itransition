import React, { useContext } from 'react'
import { Context } from '../js/store/appContext.js';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


const schema = yup.object({
    name: yup.string().required('Name is a must'),
    email: yup.string().email('Invalid Email').required('Email is a must'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is a must'),
  }).required();

const Register = () => {

    const { store, actions } = useContext(Context)

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
    className="card m-5 p-5"
    >
        <h5 className="d-flex mb-4 pt-2 p-5 justify-content-center">Logotype</h5>
        {/* Display success message */}
        {store.registerStatus && <div className="alert alert-success mt-3">Registro Exitoso</div>}
        <form onSubmit={handleSubmit(handleRegister)}>
        <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
            type="text"
            id="name"
            name="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            {...register('name')}
            />
            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
        </div>

        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
            type="email"
            id="email"
            name="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            {...register('email')}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>

        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
            type="password"
            id="password"
            name="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            {...register('password')}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>

        <button type="submit" className="btn btn-primary">Register</button>
        </form>


        </div>
    );
};

export default Register;