import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/AuthProvider';
import { FaThumbsUp, FaThumbsDown, FaTrash, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router';

const Home = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);

  // Bio state
  const [userBio, setUserBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState('');

  // Fetch posts from backend
  const fetchPosts = async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
      const res = await axios.get('https://codenet-server.vercel.app/posts');
      setPosts(res.data.reverse());
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
    setLoading(false);
  };

  // Fetch user bio on mount and when user changes
  useEffect(() => {
    if (user?.email) {
      axios.get(`https://codenet-server.vercel.app/users/${user.email}`)
        .then(res => {
          const bio = res.data.bio || '';
          setUserBio(bio);
          setBioInput(bio);
        })
        .catch(err => {
          console.error('Failed to fetch user bio:', err);
          setUserBio('');
          setBioInput('');
        });
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Save bio to backend
  const saveBio = async () => {
    if (!bioInput.trim()) {
      Swal.fire('Error', 'Bio cannot be empty.', 'error');
      return;
    }

    try {
      await axios.patch(`https://codenet-server.vercel.app/users/${user.email}`, {
        bio: bioInput.trim(),
      });
      setUserBio(bioInput.trim());
      setEditingBio(false);
      Swal.fire('Success', 'Bio updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update bio:', err);
      Swal.fire('Error', 'Failed to update bio.', 'error');
    }
  };

  // Create a post
  const handlePost = async () => {
    if (!user || !content.trim()) return;

    const newPost = {
      userName: user.displayName,
      userEmail: user.email,
      userPhoto: user.photoURL,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: [],
      dislikes: []
    };

    try {
      const res = await axios.post('https://codenet-server.vercel.app/posts', newPost);
      if (res.data.insertedId) {
        await fetchPosts();
        setContent('');
      }
    } catch (error) {
      console.error('Post failed:', error);
    }
  };

  // Like or Dislike post
  const updateReactions = async (postId, actionType) => {
    const post = posts.find(p => p._id === postId);
    if (!post || !user) return;

    const userEmail = user.email;
    let updatedLikes = post.likes || [];
    let updatedDislikes = post.dislikes || [];

    if (actionType === 'like') {
      if (updatedLikes.includes(userEmail)) {
        updatedLikes = updatedLikes.filter(e => e !== userEmail);
      } else {
        updatedLikes.push(userEmail);
        updatedDislikes = updatedDislikes.filter(e => e !== userEmail);
      }
    } else {
      if (updatedDislikes.includes(userEmail)) {
        updatedDislikes = updatedDislikes.filter(e => e !== userEmail);
      } else {
        updatedDislikes.push(userEmail);
        updatedLikes = updatedLikes.filter(e => e !== userEmail);
      }
    }

    try {
      await axios.patch(`https://codenet-server.vercel.app/posts/${postId}`, {
        likes: updatedLikes,
        dislikes: updatedDislikes
      });
      setPosts(prev =>
        prev.map(p =>
          p._id === postId
            ? { ...p, likes: updatedLikes, dislikes: updatedDislikes }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Delete post with confirmation
  const handleDelete = (postId) => {
    const post = posts.find(p => p._id === postId);
    if (!post || post.userEmail !== user.email) {
      return Swal.fire('Error', 'You can only delete your own posts.', 'error');
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete your post.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://codenet-server.vercel.app/posts/${postId}?email=${user.email}`);
          setPosts(prev => prev.filter(p => p._id !== postId));
          Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
        } catch (err) {
          console.error('Failed to delete post:', err);
          Swal.fire('Error', 'Failed to delete post.', 'error');
        }
      }
    });
  };

   if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[90vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }


  return (
    <div className="flex flex-col lg:flex-row-reverse gap-10 px-6 md:px-16  min-h-[90vh] py-10">
      {/* Sidebar Profile */}
      <aside className="w-full lg:w-1/3 space-y-8">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 text-center transition-transform hover:scale-[1.02] duration-300">
          <Link to='/myprofile'>
            <img
              src={user?.photoURL || 'https://i.ibb.co/4pDNDk1/avatar.png'}
              alt="User"
              className="w-28 h-28 rounded-full mx-auto mb-5 object-cover border-4 border-blue-200"
            />
          </Link>
          <h3 className="text-xl font-semibold text-gray-900">{user?.displayName}</h3>
          <p className="text-sm text-gray-500 mt-1">{user?.email}</p>

          {/* Bio section */}
          <div className="mt-2 flex flex-col gap-3 max-w-full">
            {!editingBio ? (
              <>
                <p
                  className={`text-indigo-400 whitespace-pre-wrap break-words ${
                    userBio ? '' : 'italic text-indigo-400'
                  }`}
                  title={userBio || 'No bio added yet'}
                >
                  {userBio || 'You haven’t added a bio yet.'}
                </p>
                <button
                  onClick={() => setEditingBio(true)}
                  className={
                    "px-4 py-2 rounded-md flex items-center justify-center text-white font-semibold transition " +
                    (userBio
                      ? "bg-indigo-600 cursor-pointer hover:bg-indigo-700"
                      : "bg-indigo-700 cursor-pointer hover:bg-indigo-800")
                  }
                  aria-label={userBio ? 'Edit bio' : 'Add bio'}
                >
                  <FaEdit className="inline mr-2" />{userBio ? 'Edit Bio' : 'Add Bio'}
                </button>
              </>
            ) : (
              <>
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  rows={4}
                  className="w-full border border-indigo-400 rounded-md px-3 py-2 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Write something about yourself..."
                />
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setBioInput(userBio);
                      setEditingBio(false);
                    }}
                    className="px-4 cursor-pointer py-2 rounded-md border border-indigo-600 hover:bg-indigo-100 font-semibold transition"
                    aria-label="Cancel bio edit"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveBio}
                    className="px-4 cursor-pointer py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 font-semibold transition"
                    aria-label="Save bio"
                  >
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Post Feed */}
      <main className="w-full lg:w-2/3 space-y-2">
        {/* Post Input */}
        <section className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-28 resize-none border border-gray-300 rounded-xl p-4 text-base placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
          />
          <div className="text-right mt-4">
            <button
              onClick={handlePost}
              disabled={!content.trim()}
              className="bg-blue-600 disabled:bg-blue-300 text-white px-6 py-3 rounded-xl text-base font-medium hover:bg-blue-700 transition"
            >
              Post
            </button>
          </div>
        </section>

        {/* Render Posts */}
        {posts.length === 0 ? (
          <p className="text-center text-gray-400 text-lg font-light mt-12">
            No posts to display yet.
          </p>
        ) : (
          posts.map((post) => (
            <article
              key={post._id}
              className="bg-white p-6 rounded-3xl shadow-md border border-gray-200 flex gap-5 items-start hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={post.userPhoto || 'https://i.ibb.co/4pDNDk1/avatar.png'}
                alt={post.userName}
                className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-blue-200"
              />
              <div className="flex-1">
                <header className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{post.userName}</h4>
                  <time className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleString().replace(',', ' at')}
                  </time>
                </header>
                <p className="text-gray-700 mb-4 whitespace-pre-line">{post.content}</p>
                <footer className="flex items-center gap-6 text-sm select-none">
                  <button
                    onClick={() => updateReactions(post._id, 'like')}
                    className={`flex items-center gap-2 cursor-pointer ${post.likes?.includes(user.email)
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-600 hover:text-blue-600'
                      } transition-colors`}
                    aria-label="Like post"
                  >
                    <FaThumbsUp size={18} />
                    <span>{post.likes?.length || 0}</span>
                  </button>
                  <button
                    onClick={() => updateReactions(post._id, 'dislike')}
                    className={`flex items-center gap-2 cursor-pointer ${post.dislikes?.includes(user.email)
                        ? 'text-red-600 font-semibold'
                        : 'text-gray-600 hover:text-red-600'
                      } transition-colors`}
                    aria-label="Dislike post"
                  >
                    <FaThumbsDown size={18} />
                    <span>{post.dislikes?.length || 0}</span>
                  </button>
                  {post.userEmail === user.email && (
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="flex items-center cursor-pointer gap-2 text-red-700 hover:text-red-900 transition-colors"
                      title="Delete Post"
                      aria-label="Delete post"
                    >
                      <FaTrash size={18} />
                    </button>
                  )}
                </footer>
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
