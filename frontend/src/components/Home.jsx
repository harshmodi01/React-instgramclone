// import React from 'react'
// import Feed from './Feed'
// import { Outlet } from 'react-router-dom'
// import RightSidebar from './RightSidebar'
// import useGetAllPost from '@/hooks/useGetAllPosts'

// // import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

// const Home = () => {
//      useGetAllPost();
//     // useGetSuggestedUsers();
//     return (
//         <div className='flex'>
//             <div className='flex-grow'>
//                 <Feed />
//                 <Outlet />
//             </div>
//             <RightSidebar />
//         </div>
//     )
// }

// export default Home

import React from 'react'


import RightSidebar from './RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPosts'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

const Home = () => {
    useGetAllPost();
    useGetSuggestedUsers();
    return (
        <div className='flex'>
            <div className='flex-grow'>
                <Feed />
                <Outlet />
            </div>
            <RightSidebar />
        </div>
    )
}

export default Home