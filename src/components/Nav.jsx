import React, { use } from 'react';
import { NavLink } from 'react-router';
import { AuthContext } from '../provider/AuthProvider';
import userIcon from '../assets/user.png'
import logo from '/logo.png'
import Swal from 'sweetalert2'
import { FaHome, FaUser } from 'react-icons/fa';
const Nav = () => {
    const { user, logOut } = use(AuthContext)

    const handleLogOut = () => {
        logOut().then(() => {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "You Logged Out Successfully",
                showConfirmButton: false,
                timer: 1500
            });
        }).catch(() => {
            // An error happened.
        });
    }

    const links = <>
        <li><NavLink
            className={({ isActive }) =>
                `block px-4 py-2 rounded-md text-base font-medium flex items-center gap-2 ${isActive ? 'bg-blue-50 text-blue-500' : 'text-gray-700 hover:bg-blue-100'
                }`
            }
            to='/'
        >
            <FaHome />
            Home
        </NavLink>

        </li>

        <li><NavLink
            className={({ isActive }) =>
                `block px-4 py-2 rounded-md text-base font-medium flex items-center gap-2 ${isActive ? 'bg-blue-50 text-blue-500' : 'text-gray-700 hover:bg-blue-100'
                }`
            }
            to='/myprofile'
        >
            <FaUser />
            My Profile
        </NavLink>
        </li>

    </>

    return (
        <div className="navbar shadow-md  md:px-8 lg:px-12 bg-transparent">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {links}
                    </ul>
                </div>
                <NavLink to='/' className="text-2xl font-bold flex items-center justify-center"><img height={34} width={34} src={logo} alt="logo" /><span className='text-blue-500 '>Code</span>Net</NavLink>
            </div>
            <div className="navbar-center hidden lg:flex lg:gap-3">
                <ul className="menu menu-horizontal px-1">
                    {links}
                </ul>
            </div>

            <div className="navbar-end gap-6 flex">
                <p className='text-blue-600 font-semibold hidden md:block text-sm'> {user && user.email}</p>
                <div className="tooltip tooltip-bottom tooltip-info" data-tip={user && user.displayName}>
                    <div className='avatar'>
                        <div className='w-10 rounded-full cursor-pointer'>
                            <img src={
                                user ? user.photoURL : userIcon
                            } alt="User Photo" />
                        </div>
                    </div>
                </div>
                {
                    user ? <button
                        onClick={handleLogOut}
                        className="px-5 cursor-pointer py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
                    >
                        Log Out
                    </button>

                        : <NavLink
                            to="/auth/login"
                            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
                        >
                            Login
                        </NavLink>

                }

            </div>
        </div>
    );
};

export default Nav;