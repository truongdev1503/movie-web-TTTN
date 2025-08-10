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
            <header>Film searched</header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {films && (
                    films.map(film => (
                        <div key={film.id}>
                            <div
                                key={film.id}
                                className="bg-black rounded-lg shadow-md overflow-hidden flex flex-col"
                                onClick={() => navigate(`/film/${film.id}`)}
                            >
                                <img
                                    src={film?.poster_url ? film.poster_url : "https://img.lovepik.com/photo/50084/7826.jpg_wh860.jpg"}
                                    alt={film.title}
                                    className="w-full h-56 object-cover"
                                />
                                <div className="p-4 flex-1 flex flex-col">
                                    <h2 className="text-xl font-bold mb-2 text-white">{film.title}</h2>
                                    <p className="text-white mb-2 flex-1">{film.description}</p>
                                    <p className="text-sm text-red-500">Release Date: {film.release_year}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </>
    )
}
export default MovieSearch