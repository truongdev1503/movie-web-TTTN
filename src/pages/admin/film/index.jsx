import { useEffect, useMemo, useState } from "react";
import { deleteFilm, getFilms } from "../../../Utils/api.admin.util";
import { likeFilm, dislikeFilm } from "../../../Utils/api.user.util";
import CreateFilm from "./CreateFilm";
import { ToastContainer, toast } from 'react-toastify';
import UpdateFilm from "./UpdateFilm.";

const Film = () => {
    let [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 18;
    const [likingIds, setLikingIds] = useState(new Set());
    const [dislikingIds, setDislikingIds] = useState(new Set());
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [isClickAdd, setIsClickAdd] = useState(false);
    const [isClickUpdate, setIsClickUpdate] = useState(false);
    const [idUpdate, setIdUpdate] = useState(null);

    const handleClickAdd = () => {
        setIsClickAdd(!isClickAdd);
    }
    
    useEffect(() => {
        const fetchFilms = async () => {
            const list = await getFilms();
            const sorted = Array.isArray(list) ? [...list].sort((a,b)=> (Number(a?.id)||0) - (Number(b?.id)||0)) : [];
            setFilms(sorted);
            setCurrentPage(1);
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
    const handleLike = async (id) => {
        if (likingIds.has(id)) return;
        setLikingIds((prev)=> new Set(prev).add(id));
        try {
            const res = await likeFilm(id);
            setFilms((prev) => prev.map((f) => {
                if (f.id !== id) return f;
                const serverLikes = typeof res?.likes === 'number' ? res.likes : null;
                const currentLikes = typeof f.likes === 'number' ? f.likes : 0;
                return { ...f, likes: serverLikes ?? (currentLikes + 1) };
            }));
        } finally {
            setLikingIds((prev)=>{
                const s = new Set(prev);
                s.delete(id);
                return s;
            });
        }
    }

    const handleDislike = async (id) => {
        if (dislikingIds.has(id)) return;
        setDislikingIds((prev)=> new Set(prev).add(id));
        try {
            const res = await dislikeFilm(id);
            setFilms((prev) => prev.map((f) => {
                if (f.id !== id) return f;
                const serverDislikes = typeof res?.dislikes === 'number' ? res.dislikes : null;
                const currentDislikes = typeof f.dislikes === 'number' ? f.dislikes : 0;
                return { ...f, dislikes: serverDislikes ?? (currentDislikes + 1) };
            }));
        } finally {
            setDislikingIds((prev)=>{
                const s = new Set(prev);
                s.delete(id);
                return s;
            });
        }
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
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
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
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
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
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4">
                        {films.slice((currentPage-1)*pageSize, (currentPage-1)*pageSize + pageSize).map(film => (
                            <div
                                key={film.id}
                                className="group rounded-md overflow-hidden bg-neutral-900 hover:shadow-lg transition"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={film?.poster_url ? film.poster_url : "https://img.lovepik.com/photo/50084/7826.jpg_wh860.jpg"}
                                        alt={film.title}
                                        className="w-full aspect-[2/3] object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                    />
                                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-black/60 text-white">
                                        <span>👁</span>
                                        <span>{typeof film.views === 'number' ? film.views : 0}</span>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <h2 className="text-sm font-semibold text-white truncate">{film.title}</h2>
                                    <div className="flex items-center justify-between mt-1">
                                        <p className="text-xs text-gray-400">{film.release_year}</p>
                                        <div className="flex gap-1 overflow-hidden">
                                            {(film?.genres || []).slice(0, 1).map((g) => (
                                                <span key={g.id} className="px-1.5 py-0.5 text-[10px] rounded bg-red-700 text-white whitespace-nowrap">{g.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <button
                                            aria-label="Dislike film"
                                            onClick={() => handleDislike(film.id)}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${dislikingIds.has(film.id) ? 'opacity-70' : ''} bg-black/60 hover:bg-black/80 text-white`}
                                        >
                                            <span>👎</span>
                                            <span>{typeof film.dislikes === 'number' ? film.dislikes : 0}</span>
                                        </button>
                                        <button
                                            aria-label="Like film"
                                            onClick={() => handleLike(film.id)}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${likingIds.has(film.id) ? 'opacity-70' : ''} bg-black/60 hover:bg-black/80 text-white`}
                                        >
                                            <span className="text-red-500">❤</span>
                                            <span>{typeof film.likes === 'number' ? film.likes : 0}</span>
                                        </button>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => handleClickUpdate(film)} className="flex-1 text-sm bg-black border border-red-600 hover:bg-red-700 hover:text-white text-red-400 px-3 py-1.5 rounded">Edit</button>
                                        <button onClick={() => setConfirmDeleteId(film.id)} className="flex-1 text-sm bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2 mb-6 select-none">
                        <button
                            className="px-3 py-1.5 rounded border border-neutral-700 text-sm hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                            onClick={() => setCurrentPage((p)=> Math.max(1, p-1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        {Array.from({length: Math.ceil(films.length / pageSize) || 1}, (_,i)=> i+1).map((p)=> (
                            <button
                                key={p}
                                className={`px-3 py-1.5 rounded text-sm border ${p === currentPage ? 'bg-red-600 border-red-600 text-white' : 'border-neutral-700 hover:bg-neutral-800'} text-white`}
                                onClick={() => { setCurrentPage(p); window.scrollTo({top:0, behavior:'smooth'}); }}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            className="px-3 py-1.5 rounded border border-neutral-700 text-sm hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                            onClick={() => setCurrentPage((p)=> Math.min(Math.ceil(films.length / pageSize) || 1, p+1))}
                            disabled={currentPage === (Math.ceil(films.length / pageSize) || 1)}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {confirmDeleteId !== null && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-black rounded-xl shadow-lg p-6 w-full max-w-md border border-red-700">
                        <h3 className="text-xl font-bold text-white mb-2">Xác nhận xóa</h3>
                        <p className="text-gray-300 mb-6">Bạn có chắc chắn muốn xóa phim này? Hành động này không thể hoàn tác.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-800 text-white"
                                onClick={() => setConfirmDeleteId(null)}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-red-700 hover:bg-red-800 text-white"
                                onClick={() => { handleDeleteFilm(confirmDeleteId); setConfirmDeleteId(null); }}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Film;