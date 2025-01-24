// import useGetUserProfile from '@/hooks/useGetUserProfile'
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
// import React, { useState } from 'react'
// import { useSelector } from 'react-redux'
// import { Link, useParams } from 'react-router-dom'
// import { Button } from './ui/button'
// import { AtSign, Heart, MessageCircle } from 'lucide-react'
// import { Badge } from './ui/badge';

// const Profile = () => {
//   const params = useParams();
//   const userId = params.id;
//   useGetUserProfile(userId);
//   const [activeTab, setActiveTab] = useState('posts');

//   const { userProfile, user } = useSelector(store => store.auth);
//   // console.log(userProfile);
//   const isLoggedInUserProfile = user?._id === userProfile?._id;
//   const isFollowing = false;


//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//   }

//   const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

//   return (
//     <div className='flex max-w-5xl justify-center mx-auto pl-10'>
//       <div className='flex flex-col gap-20 p-8'>
//         <div className='grid grid-cols-2'>
//           <section className='flex items-center justify-center'>
//             <Avatar className='h-32 w-32'>
//               <AvatarImage src={userProfile?.userProfile} alt="profilephoto" />
//               <AvatarFallback>CN</AvatarFallback>
//             </Avatar>
//           </section>
//           <section>
//             <div className='flex flex-col gap-5'>
//               <div className='flex items-center gap-2'>
//                 <span>{userProfile?.username}</span>
//                 {
//                   isLoggedInUserProfile ? (
//                     <>
//                       <Link to="/account/edit"><Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit profile</Button></Link>
//                       <Button variant='secondary' className='hover:bg-gray-200 h-8'>View archive</Button>
//                       <Button variant='secondary' className='hover:bg-gray-200 h-8'>Ad tools</Button>
//                     </>
//                   ) : (
//                     isFollowing ? (
//                       <>
//                         <Button variant='secondary' className='h-8'>Unfollow</Button>
//                         <Button variant='secondary' className='h-8'>Message</Button>
//                       </>
//                     ) : (
//                       <Button className='bg-[#0095F6] hover:bg-[#3192d9] h-8'>Follow</Button>
//                     )
//                   )
//                 }
//               </div>
//               <div className='flex items-center gap-4'>
//                 <p><span className='font-bold'>{userProfile?.posts.length} </span>posts</p>
//                 <p><span className='font-bold'>{userProfile?.followers.length} </span>followers</p>
//                 <p><span className='font-bold'>{userProfile?.following.length} </span>following</p>
//               </div>
//               <div className='flex flex-col gap-1'>
                

//                 <Badge className='w-fit' variant='secondary'><AtSign /> <span className='pl-1'>{userProfile?.username}</span> </Badge>
//                 <span className='font-semibold'>{userProfile?.bio || ''}</span>
//               </div>
//             </div>
//           </section>
//         </div>
//         <div className='border-t border-t-gray-200'>
//           <div className='flex items-center justify-center gap-10 text-sm'>
//             <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}>
//               POSTS
//             </span>
//             <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange('saved')}>
//               SAVED
//             </span>
//             {/* <span className='py-3 cursor-pointer'>REELS</span>
//             <span className='py-3 cursor-pointer'>TAGS</span> */}
//           </div>
//           <div className='grid grid-cols-3 gap-1'>
//             {
//               displayedPost?.map((post) => {
//                 return (
//                   <div key={post?._id} className='relative group cursor-pointer'>
//                     <img src={post.image} alt='postimage' className='rounded-sm my-2 w-full aspect-square object-cover' />
//                     <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
//                       <div className='flex items-center text-white space-x-4'>
//                         <Button className='flex items-center gap-2 hover:text-gray-300'>
//                           <Heart />
//                           <span>{post?.likes.length}</span>
//                         </Button>
//                         <Button className='flex items-center gap-2 hover:text-gray-300'>
//                           <MessageCircle />
//                           <span>{post?.comments.length}</span>
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })
//             }
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// };

// export default Profile

import useGetUserProfile from '@/hooks/useGetUserProfile'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import React, { useState,useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Button } from './ui/button'
import { AtSign, Heart, MessageCircle } from 'lucide-react'
import { Badge } from './ui/badge';
import { followOrUnfollowUser } from '../components/followunfollow'; 

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const { userProfile, user } = useSelector(store => store.auth);
  // console.log(userProfile);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  useEffect(() => {
    if (userProfile?.followers.includes(user?._id)) {
      setIsFollowing(true); // Set to true if the current user is already following the profile
    } else {
      setIsFollowing(false); // Set to false if not following
    }
  }, [userProfile, user]);
  const handleFollowToggle = async () => {
    try {
      const response = await followOrUnfollowUser(userId); // Call API to toggle follow/unfollow
      if (response.success) {
        setIsFollowing((prev) => !prev); // Toggle follow/unfollow state
        setUserProfile((prevProfile) => {
          const newFollowers = isFollowing
            ? prevProfile.followers.filter((followerId) => followerId !== user._id)
            : [...prevProfile.followers, user._id];
          return { ...prevProfile, followers: newFollowers };
        });
        // Optionally dispatch an action to update the profile in the store
        dispatch({ type: 'UPDATE_USER_PROFILE', payload: response.updatedProfile });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }
  const displayedPost = 
  activeTab === 'posts' ? userProfile?.posts :
  activeTab === 'saved' ? userProfile?.bookmarks :
  userProfile?.favorites;
 // const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className='flex max-w-5xl justify-center mx-auto pl-10'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center'>
            <Avatar className='h-32 w-32'>
              <AvatarImage src="data:image/jpeg;base64,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" alt="profilephoto" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
            <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {user?._id === userProfile?._id ? (
                  <>
                    <Link to="/account/edit">
                      <Button variant="secondary" className="hover:bg-gray-200 h-8">
                        Edit profile
                      </Button>
                    </Link>
                    {/* <Button variant="secondary" className="hover:bg-gray-200 h-8">
                      View archive
                    </Button>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">
                      Ad tools
                    </Button> */}
                  </>
                ) : (
                  <Button
                    onClick={handleFollowToggle}
                    className={`h-8 ${isFollowing ? 'bg-gray-200' : 'bg-[#0095F6] hover:bg-[#3192d9]'}`}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
              </div>
              <div className='flex items-center gap-4'>
                <p><span className='font-bold'>{userProfile?.posts.length} </span>posts</p>
                <p><span className='font-bold'>{userProfile?.followers.length} </span>followers</p>
                <p><span className='font-bold'>{userProfile?.following.length} </span>following</p>
              </div>
              <div className='flex flex-col gap-1'>
                

                <Badge className='w-fit' variant='secondary'><AtSign /> <span className='pl-1'>{userProfile?.username}</span> </Badge>
                <span className='font-semibold'>{userProfile?.bio || ''}</span>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}>
              POSTS
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange('saved')}>
              SAVED
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'favorites' ? 'font-bold' : ''}`} onClick={() => handleTabChange('Favorites')}>
              FAVORITES
            </span>
            
          </div>
          <div className='grid grid-cols-3 gap-1'>
            {
              displayedPost?.map((post) => {
                return (
                  <div key={post?._id} className='relative group cursor-pointer'>
                    <img src={post.image} alt='postimage' className='rounded-sm my-2 w-full aspect-square object-cover' />
                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='flex items-center text-white space-x-4'>
                        <Button className='flex items-center gap-2 hover:text-gray-300'>
                          <Heart />
                          <span>{post?.likes.length}</span>
                        </Button>
                        <Button className='flex items-center gap-2 hover:text-gray-300'>
                          <MessageCircle />
                          <span>{post?.comments.length}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
};

export default Profile