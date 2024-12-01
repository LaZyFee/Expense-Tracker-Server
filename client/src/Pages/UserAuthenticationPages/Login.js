import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Authentication/auth';
import { Helmet } from 'react-helmet';

const Login = () => {
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuth();

    const handleLogin = async (data) => {
        const { email, password } = data;

        try {
            await login(email, password);
            navigate("/");
        } catch (error) {
            setLoginError(error.message || "Error logging in");
        }
    };

    return (
        <div className='h-screen flex justify-center items-center'>
            <Helmet>
                <title>Login - Expense Tracker</title>
            </Helmet>
            <div className='w-96 p-7'>
                <h2 className='text-xl text-center'>Login</h2>
                <form onSubmit={handleSubmit(handleLogin)}>
                    <div className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Email</span></label>
                        <input type="text" {...register("email", {
                            required: "Email Address is required"
                        })} className="input input-bordered w-full max-w-xs" />
                        {errors.email && <p className='text-red-600'>{errors.email.message}</p>}
                    </div>

                    <div className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Password</span></label>
                        <input type="password" {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: 'Password must be 6 characters or longer' }
                        })} className="input input-bordered w-full max-w-xs" />
                        {errors.password && <p className='text-red-600'>{errors.password.message}</p>}
                    </div>

                    <label className="label"> <Link className="label-text" to="/forgot-password">Forget Password?</Link></label>
                    <input className='btn btn-accent w-full' value="Login" type="submit" disabled={isLoading} />

                    {loginError && <p className='text-red-600'>{loginError}</p>}
                    {error && <p className='text-red-600'>{error}</p>}
                </form>

                <p>New to Expense Tracker? <Link className='text-secondary' to="/signup">Create new Account</Link></p>
                <div className="divider">OR</div>
                <button className='btn btn-outline w-full'>CONTINUE WITH GOOGLE</button>
            </div>
        </div>
    );
};

export default Login;
