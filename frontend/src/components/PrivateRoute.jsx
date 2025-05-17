import {Navigate ,Outlet} from "react-router-dom";

const PrivateRoute =({ roles })=>{
    const user=JSON.parse(localStorage.getItem("user"));

    if(!user){
        return<Navigate to= "/login" />;
    }

    if(roles && !roles.includes(user.role)){
        return<Navigate to="/" />;
    }
    return<Outlet />;
};

export default PrivateRoute;