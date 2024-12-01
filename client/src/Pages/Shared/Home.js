import React from 'react';
import { useAuth } from '../../Authentication/auth';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Home = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen p-2">
            <Helmet>
                <title>Home - Expense Tracker</title>
            </Helmet>

            <h1 className="text-4xl font-bold text-center text-accent">
                Hello,
                <span className="tooltip" data-tip="Click to view profile">
                    <Link to="/profile" className="hover:text-violet-400">{user.displayName || user.name}</Link>
                </span>

                <span className="tooltip" data-tip="Logout">
                    <button onClick={handleLogout} className="ml-2">
                        <span>👋</span>
                    </button>
                </span>
            </h1>
            <h3 className="text-2xl mt-4"> Welcome to Expense Tracker</h3>
            <h3 className="text-xl mt-2 text-primary"> Let's Keep Track of what you are Spending</h3>

        </div>
    );
};

export default Home;
