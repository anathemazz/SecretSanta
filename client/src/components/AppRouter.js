import React, {useContext} from 'react';
import {Routes, Route} from 'react-router-dom';
import {authRoutes, publicRoutes} from "../routes";
import {Context} from "../index";
import Rules from "../pages/RULES";


const AppRouter = () => {
    const {user} = useContext(Context)// просто заглушка для проверки авторизации пользователя
    console.log(user)
    return (
        <Routes>
            {user.isAuth && authRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component/>} exact/>
            )}

            {publicRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component/>} exact/>
            )}
            <Route key="*" path="*" element={<Rules/>} exact/>
        </Routes>
    );
};

export default AppRouter;