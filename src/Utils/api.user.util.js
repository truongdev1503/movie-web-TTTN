import axios from "../services/config-axios.service.js";

const sendComment = async (id, name, content)=>{
    const data = await axios.post(`movies/${id}/comments/`, {
        name, content
    });
    return data;
}

// Trả lời bình luận
const sendReply = async (id, parent, name, content)=>{
    const data = await axios.post(`movies/${id}/comments/`, {
        parent, name, content
    });
    return data;
}

const getComments = async (id)=>{
    let data = await axios.get(`movies/${id}/comments/`);
    data = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return data;
    // {
    //     "id": 2,
    //     "name": "truong",
    //     "content": "Great movie!",
    //     "created_at": "2025-08-12T08:54:15.424099Z",
    //     "movie": 36
    //   },
}

const sendRating = async (id, score)=>{
    const data = await axios.post(`movies/${id}/ratings/`, {
        score
    });
    return data;
}

const getRating = async (id)=>{
    const data = await axios.get(`movies/${id}/ratings/`);
    return data;
    // [
    //     {
    //       "id": 2,
    //       "score": 3,
    //       "created_at": "2025-08-12T09:02:23.163316Z",
    //       "movie": 36
    //     },
    //     {
    //       "id": 3,
    //       "score": 4,
    //       "created_at": "2025-08-12T09:02:29.423861Z",
    //       "movie": 36
    //     }
    //   ]
}
const likeFilm = async (id)=>{
    const data = await axios.post(`movies/${id}/like/`);
    return data;
    // {"likes": 4} kết quả trả về
}

const watchFilm = async (id)=>{
    const data = await axios.get(`movies/${id}/watch/`);
    return data;
    // { "video_url": "https://...mp4" }
}

const dislikeFilm = async (id)=>{
    const data = await axios.post(`movies/${id}/dislike/`);
    return data;
    // { "dislikes": 1 }
}

export { sendComment, sendReply, getComments, sendRating, getRating, likeFilm, watchFilm, dislikeFilm };
