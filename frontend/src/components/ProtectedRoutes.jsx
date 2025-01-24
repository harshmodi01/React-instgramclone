// import { Store, User } from 'lucide-react'
// import React, { useEffect } from 'react'
// import { useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom';

// const ProtectedRoutes = ({children}) => {
//   const {User} = useSelector(Store=>Store.auth);
//   const navigate =useNavigate();
//   useEffect(()=>{
//     if(!User){
//       navigate("/Login")
//     }
//   },[])
//   return <>{children}</>

// }

// export default ProtectedRoutes;

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  // Use 'user' to avoid conflict with 'User' import from lucide-react
  const user = useSelector((state) => state.auth.User);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
    // navigate("/Login");
    }
  }, [user, navigate]); // Add user and navigate as dependencies

  return <>{children}</>;
};

export default ProtectedRoutes;
