import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFilmById } from "../../../Utils/api.admin.util";

const DetailFilm = ()=>{
    const {id} = useParams();
    console.log("Film ID:", id);

    const [film, setFilm] = useState(null);

    useEffect(() => {
        const fetchFilm = async () => {
            const data = await getFilmById(id);
            setFilm(data);
        };
        fetchFilm();
    }, [id]);

    console.log("Film data:", film);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-full max-w-6xl bg-black rounded-2xl shadow-2xl overflow-hidden">
                {film ? (
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 flex-shrink-0 p-8 flex flex-col items-center justify-center bg-black">
                            <img
                                src={film.poster_url}
                                alt={film.title}
                                className="w-56 h-80 object-cover rounded-xl shadow-lg"
                            />
                        </div>
                        <div className="md:w-2/3 p-10 flex flex-col justify-between">
                            <h2 className="text-4xl font-extrabold text-white mb-6 pb-2">{film.title}</h2>
                            <video controls className="w-full rounded-xl mb-8 shadow-lg bg-black">
                                <source src={film.video_url} />
                                Your browser does not support the video tag.
                            </video>
                            <div className="flex items-center mb-6">
                                <span className="bg-red-700 text-white font-semibold px-4 py-2 rounded-full mr-4">
                                    {film.release_year}
                                </span>
                                <span className="text-gray-400 text-base">Năm phát hành</span>
                            </div>
                            <p className="text-gray-300 text-lg leading-relaxed">{film.description}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-96">
                        <span className="text-red-700 text-2xl animate-pulse">Đang tải phim...</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetailFilm;