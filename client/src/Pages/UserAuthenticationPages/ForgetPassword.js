import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../../Component/Input";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Authentication/auth";

const ForgetPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { isLoading, forgotPassword } = useAuth();

    const handleForgotPassword = async (data) => {
        const { email } = data;
        await forgotPassword(email);
        setIsSubmitted(true);
    };

    return (
        <div className="flex items-center justify-center min-h-screen shadow-xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card w-full max-w-md"
            >
                <div className="card-body">
                    <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                        Forgot Password
                    </h2>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit(handleForgotPassword)}>
                            <p className="text-gray-300 mb-6 text-center">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>

                            <div className="form-control mb-4">
                                <Input
                                    icon={Mail}
                                    type="email"
                                    placeholder="Email Address"
                                    {...register("email", { required: "Email is required" })}
                                    required
                                />
                                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:from-green-600 hover:to-emerald-700"
                                type="submit"
                                disabled={isLoading}
                            >
                                Send Reset Link
                            </motion.button>
                        </form>
                    ) : (
                        <div className="text-center">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="p-4 text-emerald-400"
                            >
                                Reset email sent successfully!
                            </motion.div>

                            <Link to="/login" className="mt-4 text-green-500 hover:underline flex items-center justify-center">
                                <ArrowLeft className="mr-2" /> Back to Login
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ForgetPassword;
