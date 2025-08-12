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
    const dataConsole = JSON.stringify(data)
    console.log(dataConsole );
    // [{"id":37,"title":"Thanh gươm diệt quỷ","description":"Phim anime Nhật Bản mới ra mắt cực hay","video_url":"https://res.cloudinary.com/dvoh0scvq/video/upload/v1754054614/VIDEO_DOWNLOAD_1738462816342_1739158999123_yxrngh.mp4","poster_url":"https://images2.thanhnien.vn/zoom/1200_630/528068263637045248/2025/3/6/thanh-guom-diet-quy-17412466104021905275850-75-0-653-1104-crop-1741246642994505406803.png","release_year":2025,"genres":[{"id":2,"name":"Phim Hành Động"},{"id":49,"name":"Phim Hot 11"}],"average_rating":null,"rating_count":0},{"id":36,"title":"Quà tặng cuộc sống","description":"Nhưng bài học  ý nghĩa trong cuộc sống","video_url":"https://res.cloudinary.com/dvoh0scvq/video/upload/v1754054614/VIDEO_DOWNLOAD_1738462816342_1739158999123_yxrngh.mp4","poster_url":"https://st.download.com.vn/data/image/2021/06/24/qtcs-700.jpg","release_year":2025,"genres":[{"id":2,"name":"Phim Hành Động"},{"id":49,"name":"Phim Hot 11"}],"average_rating":3.6,"rating_count":9},{"id":35,"title":"Buổi tối gần cuối cùng với mọi người Maxflow","description":"Buổi tối vui vẻ","video_url":"https://res.cloudinary.com/dvoh0scvq/video/upload/v1754054614/VIDEO_DOWNLOAD_1738462816342_1739158999123_yxrngh.mp4","poster_url":"https://phunuvietnam.mediacdn.vn/zoom/660_412/media/news/1171d78d0d618b225dfa50bc2ebb2399/thumb/khoanh-khac-yeu-thuong-truyen-cam-xuc-manh-me-gd-thumb43.jpg","release_year":2025,"genres":[{"id":49,"name":"Phim Hot 11"},{"id":50,"name":"Anh Là Kẻ May Mắn"}],"average_rating":4.3,"rating_count":3}]

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

export const getFilmsByGenre = async (genreId) => {
    const data = await axios.get(`genres/${genreId}/movies/`);
    return data;
}

export const createFilm = async (filmData) => {
    const data = await axios.post('movies/', filmData);
    return data;
}
export const deleteFilm = async (id) => {
    const data = await axios.delete(`movies/${id}/`);
    return data;
}
export const updateFilm = async (id, filmData) => {
    const data = await axios.patch(`movies/${id}/`, filmData);
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

export const createGenres = async (genresValue) => {
    const data = await axios.post('genres/', genresValue);
    return data;
}

export const getGenres = async () => {
    const data = await axios.get('genres/');
    // [
    //     {
    //       "id": 2,
    //       "name": "Phim Hành Động"
    //     },
    //     {
    //       "id": 49,
    //       "name": "Phim Hot 11"
    //     },
    //     {
    //       "id": 50,
    //       "name": "Anh Là Kẻ May Mắn"
    //     }
    //   ]
    return data;
}

export const deleteGenre = async (id) => {
    const data = await axios.delete(`genres/${id}/`);
    return data;
}

export const editGenre = async (id, genresValue) => {
    const data = await axios.patch(`genres/${id}/`, genresValue);
    return data;
}

