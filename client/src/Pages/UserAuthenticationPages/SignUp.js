import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Authentication/auth';
import { Helmet } from 'react-helmet';
import PasswordStrengthMeter from './PasswordStrengthMeter';

const SignUp = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [signUpError, setSignUPError] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { signup, isLoading, error } = useAuth();

    const handleSignUp = async (data) => {
        const { name, email, password } = data;

        try {
            await signup(email, password, name);
            navigate("/");
        } catch (error) {
            setSignUPError(error.message || "Error signing up");
        }
    };

    return (
        <div className='h-screen flex justify-center items-center'>
            <Helmet>
                <title>Signup - Expense Tracker</title>
            </Helmet>
            <div className='w-96 p-7'>
                <h2 className='text-xl text-center'>Sign Up</h2>
                <form onSubmit={handleSubmit(handleSignUp)}>
                    <div className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Name</span></label>
                        <input
                            type="text"
                            {...register("name", { required: "Name is required" })}
                            className="input input-bordered w-full max-w-xs"
                        />
                        {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
                    </div>

                    <div className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Email</span></label>
                        <input
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            className="input input-bordered w-full max-w-xs"
                        />
                        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                    </div>

                    <div className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Password</span></label>
                        <input
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be 6 characters long" },
                                pattern: {
                                    value: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])/,
                                    message: 'Password must have uppercase, number and special characters'
                                }
                            })}
                            className="input input-bordered w-full max-w-xs"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Capture the password input
                        />
                        {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                    </div>

                    {/* Render PasswordStrengthMeter only if password exists */}
                    {password && <PasswordStrengthMeter password={password} />}

                    <input className='btn btn-accent w-full mt-4' value="Sign Up" type="submit" disabled={isLoading} />
                    {signUpError && <p className='text-red-600'>{signUpError}</p>}
                    {error && <p className='text-red-600'>{error}</p>}
                </form>

                <p>Already have an account? <Link className='text-secondary' to="/login">Please Login</Link></p>
                <div className="divider">OR</div>
                <button className='btn btn-outline w-full'>CONTINUE WITH GOOGLE</button>
            </div>
        </div>
    );
};

export default SignUp;
