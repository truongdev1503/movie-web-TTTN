import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { getFilmsSearched } from "../../../Utils/api.admin.util";

function MovieSearch() {
    const [params, setParams] = useSearchParams();
    const keySearch = params.get("key");
    const [films, setfilms] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        const fetch = async () => {
            const films = await getFilmsSearched(keySearch);
            setfilms(films);
        }
        fetch();
    }, [keySearch])
    console.log(films)
    return (
        <>
            <header className="text-center text-2xl font-bold text-white mb-4">Kết quả tìm kiếm</header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-3 sm:p-4">
                {Array.isArray(films) && films.map((film) => (
                    <div key={film.id}
                        className="bg-black rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
                        onClick={() => navigate(`/film/${film.id}`)}
                    >
                        <img
                            src={film?.poster_url ? film.poster_url : "https://img.lovepik.com/photo/50084/7826.jpg_wh860.jpg"}
                            alt={film.title}
                            className="w-full h-48 sm:h-56 object-cover"
                        />
                        <div className="p-3 sm:p-4 flex-1 flex flex-col">
                            <h2 className="text-lg sm:text-xl font-bold mb-2 text-white line-clamp-1">{film.title}</h2>
                            <p className="text-white mb-2 flex-1 line-clamp-3">{film.description}</p>
                            <p className="text-xs sm:text-sm text-red-500">Release Date: {film.release_year}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
export default MovieSearch