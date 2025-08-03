import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../provider/AuthProvider';

const Updateprof = () => {
  const navigate = useNavigate();
  const { user, setUser, updateUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    photoURL: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.displayName || '',
        photoURL: user.photoURL || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const { name, photoURL } = formData;
    if (!name || !photoURL) {
      setError('Please fill in all required fields.');
      return;
    }
    updateUser({ displayName: name, photoURL })
      .then(() => {
        setUser({ ...user, displayName: name, photoURL });
        navigate('/myprofile');
      })
      .catch((error) => {
        setError(error.message || 'Failed to update profile.');
      });
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800 tracking-wide">
          Update Profile
        </h2>

        <form onSubmit={handleUpdate} className="space-y-7">
          <div>
            <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-5 py-4 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="photoURL" className="block mb-2 font-medium text-gray-700">
              Photo URL
            </label>
            <input
              id="photoURL"
              name="photoURL"
              type="text"
              placeholder="Your Photo URL"
              value={formData.photoURL}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-5 py-4 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl transition-shadow shadow-lg hover:shadow-indigo-400"
          >
            Update Profile
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/myprofile"
            className="inline-block text-indigo-700 hover:text-indigo-900 font-semibold"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Updateprof;
