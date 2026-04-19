import {AuthContext} from "../auth.context";
import {login, register, logout, getMe} from "../services/auth.api";
import {useContext, useEffect} from "react";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const {user,setUser,loading,setLoading} = context;

    const handleLogin = async (email, password) => {
        setLoading(true);
        try{
            const data = await login({email, password});
            setUser(data.user);
            return true;
        } catch(error){
            return false;
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async (username, email, password) => {
        setLoading(true);
        try{
            const data = await register({username, email, password});
            setUser(data.user);  
            return true;  
        } catch(error){
            return false;
        } finally {
            setLoading(false);
        } 
    }

    const handleLogout = async () => {
        setLoading(true);
        try{
            await logout();
            setUser(null);
            return true;
        } catch(error){
            return false;
        } finally {
            setLoading(false);
        }
    }
    const handleGetMe = async () => {
        setLoading(true);
        try{
            const data = await getMe();
            setUser(data.user);
        } catch(error){
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    return {user, loading, handleLogin, handleRegister, handleLogout, handleGetMe}
}