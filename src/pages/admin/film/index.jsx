import { useEffect, useState } from "react";
import { deleteFilm, getFilms } from "../../../Utils/api.admin.util";
import CreateFilm from "./CreateFilm";
import { ToastContainer, toast } from 'react-toastify';
import UpdateFilm from "./UpdateFilm.";

const Film = () => {
    let [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClickAdd, setIsClickAdd] = useState(false);
    const [isClickUpdate, setIsClickUpdate] = useState(false);
    const [idUpdate, setIdUpdate] = useState(null);

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

    const handleDeleteFilm = (id) => {
        console.log("Deleting film with id:", id);
        const fetchFilms = async () => {
           try {
                await deleteFilm(id);
                setFilms(films => films.filter(film=> film.id != id));
                toast("Delete film successfully!")
           } catch (error) {
                toast("Failed!")
           }
        }
        fetchFilms()
    }
    const handleClickUpdate = (film) => {
        setIsClickUpdate(!isClickUpdate);
        setIdUpdate(film.id);
    }

    console.log(films)
    
    return (
        <div className="min-h-screen bg-black">
            {/* Header with Logo */}
            <header className="flex items-center px-8 py-4 bg-black">
                <span className="text-3xl font-extrabold">
                    <span className="text-red-700">Movi</span>
                    <span className="text-white">eWeb</span>
                    <span className="text-red-700">TD</span>
                </span>
            </header>
            {/* Film List Title */}
            <h1 className="text-3xl font-extrabold mb-8 mt-8 text-center text-white tracking-tight">Film List</h1>
            <div className="flex justify-end mb-6">
                <button
                    className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg shadow transition duration-200 font-semibold"
                    onClick={handleClickAdd}
                >
                    + Add Film
                </button>
            </div>
            {isClickAdd && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-black rounded-xl shadow-lg p-8 w-full max-w-lg relative border border-red-700">
                        <button
                            className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-2xl"
                            onClick={handleClickAdd}
                        >
                            &times;
                        </button>
                        <CreateFilm setIsClickAdd={setIsClickAdd} setFilms={setFilms} />
                    </div>
                </div>
            )}
            {isClickUpdate && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-black rounded-xl shadow-lg p-8 w-full max-w-lg relative border border-red-700">
                        <button
                            className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-2xl"
                            onClick={handleClickUpdate}
                        >
                            &times;
                        </button>
                        <UpdateFilm props = {{
                            id: idUpdate,
                            films: films.find(film => film.id === idUpdate),
                            setIsClickUpdate: setIsClickUpdate
                        }} />
                    </div>
                </div>
            )}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg font-semibold text-red-500 animate-pulse">Loading...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
                    {films.map(film => (
                        <div
                            key={film.id}
                            className="bg-black rounded-2xl shadow-lg overflow-hidden flex flex-col hover:scale-105 transition-transform duration-200 border border-red-700"
                        >
                            <img
                                src={film?.poster_url ? film.poster_url : "https://img.lovepik.com/photo/50084/7826.jpg_wh860.jpg"}
                                alt={film.title}
                                className="w-full h-56 object-cover"
                            />
                            <div className="p-5 flex-1 flex flex-col">
                                <h2 className="text-xl font-bold mb-2 text-white">{film.title}</h2>
                                <p className="text-gray-300 mb-3 flex-1">{film.description}</p>
                                <p className="text-sm text-red-400 mb-4">Release Date: {film.release_year}</p>
                                <div className="flex gap-3 mt-auto">
                                    <button onClick={() => handleDeleteFilm(film.id)} className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md transition font-medium">
                                        Delete
                                    </button>
                                    <button onClick={() => handleClickUpdate(film)} className="bg-black border border-red-600 hover:bg-red-700 hover:text-white text-red-400 px-4 py-2 rounded-md transition font-medium">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Film;