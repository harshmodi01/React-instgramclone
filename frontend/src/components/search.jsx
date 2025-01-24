import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { FiSearch } from 'react-icons/fi';

const SearchPage = () => {
    const [username, setUsername] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Handle username input change
    const handleInputChange = (e) => {
        setUsername(e.target.value);
    };

    // Perform the search
    const handleSearch = async () => {
        if (!username) {
            setError('Please enter a username to search');
            return;
        }
        try {
            const response = await axios.get(`http://localhost:3000/api/v1/user/search?username=${username}`);
            setSearchResults(response.data);
            setError('');
        } catch (err) {
            setError('Error fetching users');
        }
    };

    return (
        <div className="my-12 w-full max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">User Search</h2>
            
            <div className="relative mb-6">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={username}
                    onChange={handleInputChange}
                    placeholder="Search for a username..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                />
                <button
                    onClick={handleSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-colors"
                >
                    Search
                </button>
            </div>
            
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

            <div className="mt-6 space-y-4">
                {searchResults.length > 0 ? (
                    searchResults.map((user) => (
                        <div key={user._id} className="flex items-center p-4 bg-gray-100 rounded-lg shadow hover:shadow-md transition-shadow">
                            <Link to={`/profile/${user._id}`} className="flex-shrink-0">
                                <Avatar>
                                    <AvatarImage src={user.profilePicture} alt="user profile" className="w-12 h-12 rounded-full" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </Link>
                            <div className="ml-4">
                                <h1 className="font-semibold text-lg text-gray-800">
                                    <Link to={`/profile/${user._id}`} className="hover:underline">{user.username}</Link>
                                </h1>
                                <p className="text-gray-600 text-sm">{user.bio || 'No bio available'}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm text-center">No User Found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
