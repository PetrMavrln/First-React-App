import { AuthContext } from 'context';
import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { privateRoutes, publicRoutes } from 'router/routs';
import Loader from './UI/Loader/Loader';

const AppRouter = () => {
    const {isAuth, isLoading} = useContext(AuthContext);

    if (isLoading) {
      return <Loader/>;
    }

    return (
      isAuth
        ?
        <Routes>
          {privateRoutes.map(route =>
            <Route 
              key={route.path}
              path={route.path} 
              element={<route.element/>} 
              exact={route.exact}
            />
          )}
          <Route 
            path="*" 
            element={<Navigate to='posts'/>}
          />
        </Routes>
        :
        <Routes>
          {publicRoutes.map(route =>
            <Route 
              key={route.path}
              path={route.path} 
              element={<route.element/>} 
              exact={route.exact}
            />
          )}
          <Route 
            path="*" 
            element={<Navigate to='login'/>}
          />
        </Routes>
    );
};

export default AppRouter;