import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { sendEmailVerification } from 'firebase/auth';
import { AuthContext } from '../provider/AuthProvider';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';

const Register = () => {
  const { createUser, updateUser, logOut, googleLogIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    email: '',
    password: '',
    bio: '',
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async e => {
    e.preventDefault();
    const { name, photo, email, password, bio } = formData;
    setError('');

    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    try {
      const result = await createUser(email, password);
      const user = result.user;

      await updateUser({ displayName: name, photoURL: photo });

      if (!user.emailVerified) {
        await sendEmailVerification(user);
      }

      await axios.post('https://codenet-server.vercel.app/register', {
        name,
        email,
        photoURL: photo,
        bio,
        createdAt: new Date().toISOString(),
        last_loggedin: new Date().toISOString(),
      });

      Swal.fire({
        icon: 'success',
        title: 'Check Your Email',
        text: 'A verification link was sent to your email. Please verify before logging in.',
      });

      await logOut();
      navigate('/auth/login');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await googleLogIn();
      const user = result.user;

      await axios.post('https://codenet-server.vercel.app/social-login', {
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

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-cyan-400">Create an Account</h2>
        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="text"
            name="photo"
            placeholder="Photo URL"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <textarea
            name="bio"
            placeholder="Short Bio (optional)"
            rows={3}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-cyan-400"
          ></textarea>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full cursor-pointer bg-cyan-500 hover:bg-cyan-600 transition text-black py-3 rounded-md font-semibold"
          >
            Register
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
            Register with Google
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?
            <Link to="/auth/login" className="text-cyan-300 ml-1 underline hover:text-cyan-400">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
