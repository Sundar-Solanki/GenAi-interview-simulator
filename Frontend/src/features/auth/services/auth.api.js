// To communicate with backend by frontend we need to install package axios.
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:2026/api/auth',
    withCredentials: true
})

export async function register({username, email, password}) {
    try{
        const response = await api.post('/register', {username, email, password})
        return response.data;
    } catch(error){
        console.log(error);
        throw error;
    }
}

export async function login({email, password}) {
    try{
        const response = await api.post('/login', {email, password})
        return response.data;
    } catch(error){
        console.log(error);
        throw error;
    }
}

export async function logout(){
    try{
        const response = await api.get('/logout')
        return response.data;
    } catch(error){
        console.log(error);
        throw error;
    }
}

export async function getMe(){
    try{
        const response = await api.get('/get-me')
        return response.data;
    } catch(error){
        throw error;
    }
}