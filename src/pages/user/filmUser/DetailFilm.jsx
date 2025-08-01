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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
            <div className="w-full max-w-4xl bg-gray-950 rounded-xl shadow-2xl overflow-hidden border border-gray-800">
                {film ? (
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 flex-shrink-0 p-6 flex flex-col items-center justify-center bg-gray-900">
                            <img
                                src={film.poster_url}
                                alt={film.title}
                                className="w-48 h-72 object-cover rounded-lg shadow-lg border-4 border-gray-800"
                            />
                        </div>
                        <div className="md:w-2/3 p-8 flex flex-col justify-between">
                            <h2 className="text-3xl font-extrabold text-white mb-4">{film.title}</h2>
                            <video controls className="w-full rounded-lg mb-6 shadow-lg border border-gray-800 bg-black">
                                <source src={film.video_url} />
                                Your browser does not support the video tag.
                            </video>
                            <div className="flex items-center mb-4">
                                <span className="bg-yellow-500 text-gray-900 font-semibold px-3 py-1 rounded-full mr-3">
                                    {film.release_year}
                                </span>
                                <span className="text-gray-400 text-sm">Năm phát hành</span>
                            </div>
                            <p className="text-gray-300 text-base leading-relaxed">{film.description}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-96">
                        <span className="text-gray-400 text-xl animate-pulse">Đang tải phim...</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetailFilm;