import axios from 'axios';

export const followOrUnfollowUser = async (userId) => {
  try {
 const response = await axios.post(`http://localhost:3000/api/v1/user/followOrUnfollow/${userId}`,{}, { withCredentials: true });

    return response.data;
  } catch (error) {
    console.error('Error following/unfollowing user:', error);
    throw error;
  }
};
