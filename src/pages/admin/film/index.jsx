import { useEffect, useState } from "react";
import { getFilms } from "../../../Utils/api.admin.util";
import CreateFilm from "./CreateFilm";

const Film = () => {
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClickAdd, setIsClickAdd] = useState(false);

    const handleClickAdd = () => {
        setIsClickAdd(!isClickAdd);
    }

    useEffect(() => {
        const fetchFilms = async () => {
            const films = await getFilms();
            setFilms(films);
            setLoading(false);
        }
        fetchFilms();
    }, []);

    return (
        <>
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Film List</h1>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleClickAdd}>+Add Film</button>
            {
                isClickAdd && (
                    <div className="Model-create-film">
                        <CreateFilm />
                    </div>
                )
            }
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg font-semibold text-gray-500">Loading...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    {films.map(film => (
                        <div
                            key={film.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
                        >
                            <img
                                src={film?.poster ? film.poster : "https://img.lovepik.com/photo/50084/7826.jpg_wh860.jpg"}
                                alt={film.title}
                                className="w-full h-56 object-cover"
                            />
                            <div className="p-4 flex-1 flex flex-col">
                                <h2 className="text-xl font-bold mb-2 text-gray-800">{film.title}</h2>
                                <p className="text-gray-600 mb-2 flex-1">{film.description}</p>
                                <p className="text-sm text-gray-500">Release Date: {film.release_year}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default Film;