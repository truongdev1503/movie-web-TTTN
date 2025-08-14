import { useEffect, useMemo, useState } from "react";
import CreateGenre from "./CreateGenre";
import { getGenres, deleteGenre, editGenre } from "../../../Utils/api.admin.util";

const GenresPage = () => {
    let [genreList, setGenreList] = useState([])
    const [isAddGenre, setIsAddGenre] = useState(false)
    const [isEditGenre, setIsEditGenre] = useState(false)
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 12
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)
    useEffect(() => {
        const fecth = async () => {
            const data = await getGenres()
            setGenreList(Array.isArray(data) ? data : [])
        }
        fecth()
    }, [])
    const handleOnClick = () => {
        setIsAddGenre(true)
    }
    const handleDeleteGenre = (id) => {
        const fecth = async () => {
            const data = await deleteGenre(id)
            setGenreList(pre => pre.filter(genre => genre.id != id))
        }
        fecth()
    }

    const handleSetIsEdit = () => {
        setIsEditGenre(true)
    }

    const handleSumitEdit = (e) =>{
        e.preventDefault();
        const fecth = async () => {
            const idInput = +e.target.genreId.getAttribute("genreid")
            const data = await editGenre(idInput, {
                name: e.target.genreId.value
            })
            setGenreList( pre => {
                const found = pre.findIndex(element => element.id === idInput )
                pre[found].name = e.target.genreId.value
                return [...pre]
            })
            setIsEditGenre(false)
        }
        fecth()
    }
    const filtered = useMemo(() => {
        const key = (search || "").toLowerCase().trim()
        if (!key) return genreList
        return genreList.filter(g => String(g?.name || "").toLowerCase().includes(key))
    }, [genreList, search])

    const totalPages = Math.ceil((filtered.length || 0) / pageSize) || 1
    const currentItems = filtered.slice((currentPage-1)*pageSize, (currentPage-1)*pageSize + pageSize)

    return (
        <div className="min-h-screen bg-black">
            <header className="flex items-center px-8 py-4 bg-black">
                <span className="text-3xl font-extrabold">
                    <span className="text-red-700">Movi</span>
                    <span className="text-white">eWeb</span>
                    <span className="text-red-700">TD</span>
                </span>
            </header>
            <div className="max-w-5xl mx-auto p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">Quản lý thể loại</h2>
                    <button
                        onClick={handleOnClick}
                        className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
                    >
                        + Thêm thể loại
                    </button>
                </div>
                <div className="mb-4">
                    <input
                        value={search}
                        onChange={(e)=>{ setSearch(e.target.value); setCurrentPage(1); }}
                        placeholder="Tìm thể loại..."
                        className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-red-700 outline-none"
                    />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {currentItems.map((genre) => (
                        <div key={genre.id} className="group rounded-md overflow-hidden bg-neutral-900 hover:shadow-lg transition p-3">
                            {isEditGenre ? (
                                <form onSubmit={handleSumitEdit} className="space-y-2">
                                    <input
                                        name="genreId"
                                        genreid={genre.id}
                                        type="text"
                                        className="w-full text-sm bg-zinc-800 text-white px-3 py-2 rounded outline-none"
                                        defaultValue={genre.name}
                                    />
                                    <button className="w-full text-sm bg-red-700 hover:bg-red-800 text-white px-3 py-2 rounded">
                                        Lưu
                                    </button>
                                </form>
                            ) : (
                                <>
                                    <div className="text-white font-semibold truncate">{genre.name}</div>
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={handleSetIsEdit}
                                            className="flex-1 text-sm bg-black border border-red-600 hover:bg-red-700 hover:text-white text-red-400 px-3 py-1.5 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setConfirmDeleteId(genre.id)}
                                            className="flex-1 text-sm bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-center gap-2 mt-4 select-none">
                    <button
                        className="px-3 py-1.5 rounded border border-neutral-700 text-sm hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage((p)=> Math.max(1, p-1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    {Array.from({length: totalPages}, (_,i)=> i+1).map((p)=> (
                        <button
                            key={p}
                            className={`px-3 py-1.5 rounded text-sm border ${p === currentPage ? 'bg-red-600 border-red-600 text-white' : 'border-neutral-700 hover:bg-neutral-800'}`}
                            onClick={() => { setCurrentPage(p); window.scrollTo({top:0, behavior:'smooth'}); }}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        className="px-3 py-1.5 rounded border border-neutral-700 text-sm hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage((p)=> Math.min(totalPages, p+1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>

                {isAddGenre && (
                    <div className="mt-6">
                        <CreateGenre setGenreList={setGenreList} />
                    </div>
                )}
                {confirmDeleteId !== null && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-black rounded-xl shadow-lg p-6 w-full max-w-md border border-red-700">
                            <h3 className="text-xl font-bold text-white mb-2">Xác nhận xóa</h3>
                            <p className="text-gray-300 mb-6">Bạn có chắc chắn muốn xóa thể loại này? Hành động này không thể hoàn tác.</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-800 text-white"
                                    onClick={() => setConfirmDeleteId(null)}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="px-4 py-2 rounded bg-red-700 hover:bg-red-800 text-white"
                                    onClick={() => { handleDeleteGenre(confirmDeleteId); setConfirmDeleteId(null); }}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenresPage;
