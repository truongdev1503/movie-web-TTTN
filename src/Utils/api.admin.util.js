import axios from "../services/config-axios.service.js";
import { getCookie } from "./cookie.util.js";

export const login = async (username, password)=>{
    const data = await axios.post('token/', {
        username, password
    });
    return data;
}

export const getFilms = async () => {
    const data = await axios.get('movies/');
    return data;
}

export const getFilmsSearched = async (key) => {
    const data = await axios.get('movies?search='+key);
    return data;
}

export const getFilmById = async (id) => {
    const data = await axios.get(`movies/${id}`);
    return data;
}

export const createFilm = async (filmData) => {
    const data = await axios.post('movies/', filmData);
    return data;
}

export const refreshToken = async () => {
    const refresh = getCookie("refresh");
    if (!refresh) {
        throw new Error('No refresh token found');
    }
    const data = await axios.post('token/refresh/', { refresh });
    return data;
}
