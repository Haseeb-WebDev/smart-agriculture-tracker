import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CommunityForum() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [commentText, setCommentText] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const navigate = useNavigate();
  
  const username = localStorage.getItem('username');
  const userRole = localStorage.getItem('userRole');

  // Load posts from localStorage on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('forumPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Sample posts
      const samplePosts = [
        {
          id: 1,
          title: 'Best time to plant tomatoes?',
          content: 'I want to know when is the best season to plant tomatoes in Punjab region.',
          author: 'Ali',
          role: 'farmer',
          timestamp: '2025-11-03 10:30 AM',
          comments: [
            {
              id: 1,
              text: 'October to November is ideal for tomato plantation.',
              author: 'Ahmed',
              role: 'admin',
              timestamp: '2025-11-03 11:00 AM'
            }
          ]
        },
        {
          id: 2,
          title: 'Potato prices rising',
          content: 'Has anyone noticed potato prices going up in Sindh? Should we sell now?',
          author: 'Hassan',
          role: 'farmer',
          timestamp: '2025-11-02 02:15 PM',
          comments: []
        }
      ];
      setPosts(samplePosts);
      localStorage.setItem('forumPosts', JSON.stringify(samplePosts));
    }
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('forumPosts', JSON.stringify(posts));
    }
  }, [posts]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    const post = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      author: username,
      role: userRole,
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      comments: []
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '' });
    alert('Post created successfully!');
  };

  const handleAddComment = (postId) => {
    const comment = commentText[postId];
    
    if (!comment || !comment.trim()) {
      alert('Please write a comment');
      return;
    }

    const newComment = {
      id: Date.now(),
      text: comment,
      author: username,
      role: userRole,
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));

    setCommentText({ ...commentText, [postId]: '' });
  };

  const handleDeletePost = (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    setPosts(posts.filter(post => post.id !== postId));
    alert('Post deleted successfully!');
  };

  const handleDeleteComment = (postId, commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter(comment => comment.id !== commentId)
        };
      }
      return post;
    }));
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setNewPost({ title: post.title, content: post.content });
  };

  const handleUpdatePost = (e) => {
    e.preventDefault();
    
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    setPosts(posts.map(post => {
      if (post.id === editingPost.id) {
        return {
          ...post,
          title: newPost.title,
          content: newPost.content
        };
      }
      return post;
    }));

    setEditingPost(null);
    setNewPost({ title: '', content: '' });
    alert('Post updated successfully!');
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setNewPost({ title: '', content: '' });
  };

  const getRoleBadgeColor = (role) => {
    return role === 'admin' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-green-100 text-green-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <span className="text-gray-600">Welcome, </span>
            <span className="font-semibold text-gray-800">{username}</span>
            <span className={`ml-2 px-2 py-1 text-xs rounded ${getRoleBadgeColor(userRole)}`}>
              {userRole}
            </span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate(userRole === 'admin' ? '/admin' : '/farmer')}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            💬 Community Forum
          </h1>
          <p className="text-gray-600">Share knowledge and discuss farming topics</p>
        </div>

        {/* Create/Edit Post Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editingPost ? 'Edit Post' : 'Create New Post'}
          </h2>
          
          <form onSubmit={editingPost ? handleUpdatePost : handleCreatePost}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Enter post title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Write your post content..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                {editingPost ? 'Update Post' : 'Create Post'}
              </button>
              {editingPost && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
              No posts yet. Be the first to create one!
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Post Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {post.title}
                    </h3>
                    {post.author === username && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-4">{post.content}</p>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">{post.author}</span>
                    <span className={`px-2 py-1 rounded text-xs ${getRoleBadgeColor(post.role)}`}>
                      {post.role}
                    </span>
                    <span>•</span>
                    <span>{post.timestamp}</span>
                    <span>•</span>
                    <span>{post.comments.length} comments</span>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="p-6 bg-gray-50">
                  <h4 className="font-semibold text-gray-800 mb-4">Comments</h4>
                  
                  {/* Existing Comments */}
                  <div className="space-y-3 mb-4">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="bg-white p-4 rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800 text-sm">
                              {comment.author}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${getRoleBadgeColor(comment.role)}`}>
                              {comment.role}
                            </span>
                            <span className="text-xs text-gray-500">
                              {comment.timestamp}
                            </span>
                          </div>
                          {comment.author === username && (
                            <button
                              onClick={() => handleDeleteComment(post.id, comment.id)}
                              className="text-red-600 hover:text-red-800 text-xs font-medium"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm">{comment.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText[post.id] || ''}
                      onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                      placeholder="Write a comment..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CommunityForum;