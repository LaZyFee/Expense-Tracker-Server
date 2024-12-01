import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../Authentication/auth";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../Component/Input";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { resetPassword, error, isLoading, message } = useAuth();

    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        // Add basic password validation (optional)
        if (password.length < 6 || !/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password)) {
            toast.error("Password must be at least 6 characters long, contain an uppercase letter, and a special character");
            return;
        }

        try {
            await resetPassword(token, password);
            toast.success("Password reset successfully, redirecting to login page...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Error resetting password");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card w-full max-w-md bg-base-100 shadow-xl"
            >
                <div className="card-body">
                    <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                        Reset Password
                    </h2>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-control mb-4">
                            <Input
                                icon={Lock}
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="form-control mb-6">
                            <Input
                                icon={Lock}
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="input input-bordered w-full"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Resetting..." : "Set New Password"}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
