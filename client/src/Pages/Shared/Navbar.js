import React, { Fragment, useState, useEffect } from 'react';
import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'synthwave');

    // Function to handle theme change
    const handleThemeChange = (e) => {
        const selectedTheme = e.target.value;
        setTheme(selectedTheme);
    };

    // Update the `data-theme` attribute and save the theme in localStorage
    useEffect(() => {
        document.querySelector('html').setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const menuItems = <Fragment>
        <NavLink
            to='/'
            className={({ isActive }) =>
                `px-4 py-2 transition-colors duration-300 ${isActive ? 'font-bold text-blue-500 border-b-2 border-blue-500' : 'hover:text-orange-500'}`
            }
        >
            Home
        </NavLink>
        <NavLink
            to='/expense'
            className={({ isActive }) =>
                `px-4 py-2 transition-colors duration-300 ${isActive ? 'font-bold text-blue-500 border-b-2 border-blue-500' : 'hover:text-orange-500'}`
            }
        >
            Add Expense
        </NavLink>
        <NavLink
            to='/statics'
            className={({ isActive }) =>
                `px-4 py-2 transition-colors duration-300 ${isActive ? 'font-bold text-blue-500 border-b-2 border-blue-500' : 'hover:text-orange-500'}`
            }
        >
            Statics
        </NavLink>
    </Fragment>;

    const themeDropdown = (
        <ul className="dropdown-content shadow-2xl bg-base-100 z-[1] w-52 p-2">
            <li>
                <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                    aria-label="Default"
                    value="default"
                    checked={theme === "default"}
                    onChange={handleThemeChange}
                />

            </li>
            <li>
                <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                    aria-label="Retro"
                    value="retro"
                    checked={theme === "retro"}
                    onChange={handleThemeChange}
                />
            </li>
            <li>
                <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                    aria-label="Cyberpunk"
                    value="cyberpunk"
                    checked={theme === "cyberpunk"}
                    onChange={handleThemeChange}
                />
            </li>
            <li>
                <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                    aria-label="Valentine"
                    value="valentine"
                    checked={theme === "valentine"}
                    onChange={handleThemeChange}
                />
            </li>
            <li>
                <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                    aria-label="Aqua"
                    value="aqua"
                    checked={theme === "aqua"}
                    onChange={handleThemeChange}
                />
            </li>
        </ul>
    );

    return (
        <div className="navbar">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </label>
                    <ul tabIndex={1} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {menuItems}
                        {/* Theme dropdown for mobile */}
                        <li>
                            <details>
                                <summary className="cursor-pointer">Theme</summary>
                                {themeDropdown}
                            </details>
                        </li>
                    </ul>
                </div>
                <Link to='/' className="btn btn-ghost text-xl normal-case">Expense-Tracker</Link>
            </div>

            {/* Navbar Center */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal p-0 gap-4">
                    {menuItems}
                </ul>
                <ul>
                    <li>
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-ghost m-1">
                                Theme
                                <svg
                                    width="12px"
                                    height="12px"
                                    className="inline-block h-2 w-2 fill-current opacity-60"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 2048 2048">
                                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                                </svg>
                            </div>
                            {themeDropdown}
                        </div>
                    </li>
                </ul>

            </div>
        </div>
    );
};

export default Navbar;
