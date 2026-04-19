import {useAuth} from "../hooks/useAuth";
import {Navigate} from "react-router";

const Protected = ({children}) => {
    const {user, loading} = useAuth();
    if(loading){
        return <div><main><h1>Loading...</h1></main></div>
    }
    if(!user){
        return <Navigate to="/login" />
    }
    return children;
}

export default Protected;
