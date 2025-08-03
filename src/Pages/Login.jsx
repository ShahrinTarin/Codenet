import React, { useState, useContext } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../provider/AuthProvider';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

const Login = () => {
    const { signIn, setUser, googleLogIn, email, setEmail, logOut } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
    try {
      const result = await googleLogIn();
      const user = result.user;

      await axios.post('http://localhost:3000/social-login', {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        last_loggedin: new Date().toISOString(),
      });

      navigate('/');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: err.message,
      });
    }
  };

    const handleLogIn = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        signIn(email, password)
            .then(result => {
                const user = result.user;

                if (user.emailVerified) {
                    setUser(user);
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "You have successfully logged in",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    navigate(location.state || '/');
                } else {
                    Swal.fire({
                        icon: "warning",
                        title: "Email not verified",
                        text: "Please verify your email before logging in.",
                        confirmButtonColor: "#f59e0b"
                    });
                    logOut(); // Optional: force logout if not verified
                }
            })
            .catch(error => {
                setError(error.code);
            });
    };

  return (
  <div className="min-h-[90vh] flex items-center justify-center px-4">
    <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
      <h2 className="text-3xl font-bold text-center text-cyan-400">Welcome Back</h2>
      <form onSubmit={handleLogIn} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            name="email"
            id="email"
            placeholder="example@mail.com"
            className="w-full px-4 py-3 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <input
            required
            type={showPass ? 'text' : 'password'}
            name="password"
            id="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute top-9 right-4 text-gray-600"
          >
            {showPass ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>

        <div className="flex justify-end text-sm">
          <Link to="/auth/forget" className="text-cyan-300 hover:underline">Forgot Password?</Link>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="w-full cursor-pointer bg-cyan-500 hover:bg-cyan-600 transition text-black py-3 rounded-md font-semibold"
        >
          Sign In
        </button>

        <div className="flex items-center gap-2 my-4">
          <hr className="flex-grow border-gray-600" />
          <span className="text-sm text-gray-400">OR</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full cursor-pointer flex items-center justify-center gap-3 bg-white text-black py-2 rounded-md font-medium hover:shadow-md transition hover:bg-gray-100"
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Don't have an account?
          <Link to="/auth/register" className="text-cyan-300 ml-1 underline hover:text-cyan-400">
            Register
          </Link>
        </p>
      </form>
    </div>
  </div>
);

};

export default Login;
