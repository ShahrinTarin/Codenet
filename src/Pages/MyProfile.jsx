import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/AuthProvider';
import { FaThumbsUp, FaThumbsDown, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import Loading from '../components/Loading';

const MyProfile = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState(null);

  // New loading state for data fetching
  const [loading, setLoading] = useState(true);

  // Fetch user profile data (bio)
  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(`https://codenet-server.vercel.app/users/${user.email}`);
      setUserData(res.data);
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  };

  // Fetch user's posts
  const fetchMyPosts = async () => {
    try {
      const res = await axios.get(`https://codenet-server.vercel.app/posts-all?email=${user.email}`);
      setPosts(res.data.reverse());
    } catch (err) {
      console.error('Failed to load posts:', err);
    }
  };

  // Fetch both user data and posts concurrently and control loading
  useEffect(() => {
    const fetchData = async () => {
      if (user?.email) {
        setLoading(true);
        await Promise.all([fetchUserDetails(), fetchMyPosts()]);
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.email]);

  const handleDelete = async (postId) => {
    Swal.fire({
      title: 'Delete this post?',
      text: 'You won’t be able to undo this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://codenet-server.vercel.app/posts/${postId}?email=${user.email}`);
          setPosts((prev) => prev.filter(p => p._id !== postId));
          Swal.fire('Deleted!', 'Your post has been removed.', 'success');
        } catch (error) {
          Swal.fire('Error', 'Failed to delete post.', 'error');
          console.log(error);
        }
      }
    });
  };

  // Show loader if auth is loading OR data is loading
  if (authLoading || loading) {
    return (
      <Loading></Loading>
    );
  }

  return (
    <div className="px-3 md:px-16 min-h-[90vh] py-10">
      {/* Profile Card */}
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border shadow text-center mb-10 relative">
        <img
          src={user?.photoURL || 'https://i.ibb.co/4pDNDk1/avatar.png'}
          alt="User"
          className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-blue-200 mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-800">{user?.displayName}</h2>
        <p className="text-sm text-gray-500">{user?.email}</p>

        {/* Bio Section */}
        {userData?.bio && (
          <div className="mt-6 text-left w-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">About Me</h3>
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-4 rounded-xl text-gray-800 leading-relaxed whitespace-pre-wrap shadow-inner">
              {userData.bio}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/auth/updateprofile')}
          className="mt-6 cursor-pointer px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
        >
          Update Profile
        </button>
      </div>

      {/* User Posts */}
      <div className="max-w-3xl mx-auto space-y-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400">You haven’t posted anything yet.</p>
        ) : (
          posts.map(post => (
            <article
              key={post._id}
              className="bg-white p-6 rounded-3xl shadow border border-gray-200 flex gap-5 items-start"
            >
              <img
                src={post.userPhoto || 'https://i.ibb.co/4pDNDk1/avatar.png'}
                alt={post.userName}
                className="w-14 h-14 rounded-full object-cover border-2 border-blue-200"
              />
              <div className="flex-1">
                <header className="flex justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{post.userName}</h4>
                  <time className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleString().replace(',', ' at')}
                  </time>
                </header>
                <p className="text-gray-700 mb-4 whitespace-pre-line">{post.content}</p>

                <footer className="flex gap-6 text-sm select-none">
                  <div className="flex cursor-pointer items-center gap-2 text-blue-600">
                    <FaThumbsUp size={16} />
                    <span>{post.likes?.length || 0}</span>
                  </div>
                  <div className="flex cursor-pointer items-center gap-2 text-red-600">
                    <FaThumbsDown size={16} />
                    <span>{post.dislikes?.length || 0}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="ml-auto cursor-pointer flex items-center gap-2 text-red-700 hover:text-red-900"
                    title="Delete Post"
                  >
                    <FaTrash size={16} />
                    <span>Delete</span>
                  </button>
                </footer>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default MyProfile;
