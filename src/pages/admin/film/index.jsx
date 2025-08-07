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
            <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">Film List</h1>
            <div className="flex justify-end mb-6">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition duration-200 font-semibold"
                    onClick={handleClickAdd}
                >
                    + Add Film
                </button>
            </div>
            {isClickAdd && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                            onClick={handleClickAdd}
                        >
                            &times;
                        </button>
                        <CreateFilm />
                    </div>
                </div>
            )}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg font-semibold text-gray-500 animate-pulse">Loading...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
                    {films.map(film => (
                        <div
                            key={film.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:scale-105 transition-transform duration-200"
                        >
                            <img
                                src={film?.poster_url ? film.poster_url : "https://img.lovepik.com/photo/50084/7826.jpg_wh860.jpg"}
                                alt={film.title}
                                className="w-full h-56 object-cover"
                            />
                            <div className="p-5 flex-1 flex flex-col">
                                <h2 className="text-xl font-bold mb-2 text-gray-900">{film.title}</h2>
                                <p className="text-gray-600 mb-3 flex-1">{film.description}</p>
                                <p className="text-sm text-gray-500 mb-4">Release Date: {film.release_year}</p>
                                <div className="flex gap-3 mt-auto">
                                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition font-medium">
                                        Delete
                                    </button>
                                    <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-md transition font-medium">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default Film;