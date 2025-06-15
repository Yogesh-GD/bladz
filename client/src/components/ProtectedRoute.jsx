import { Navigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUserProfile } from '../features/auth/authSlice';
import Loader from './Loader';

function ProtectedRoute({ children }) {


  
  const dispatch = useDispatch()
  const {user,userLoading,error,isUSerAuthenticated} = useSelector((state) => state.auth)

  

  useEffect(() => {
   if(!user || !isUSerAuthenticated){
     dispatch(getUserProfile())
   }
  },[dispatch])

  if(userLoading){
    return <Loader />
  }

  

  return isUSerAuthenticated && user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
