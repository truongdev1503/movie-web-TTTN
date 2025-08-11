import { useEffect, useState } from "react";
import CreateGenre from "./CreateGenre";
import { getGenres, deleteGenre} from "../../../Utils/api.admin.util";

const GenresPage = () => {
    const [genreList, setGenreList] = useState([])
    const [isAddGenre, setIsAddGenre] = useState(false)
    const [isEditGenre, setIsEditGenre] = useState(false)
    useEffect(() => {
        const fecth = async () => {
            const data = await getGenres()
            setGenreList(data)
        }
        fecth()
    }, [])
    const handleOnClick = () => {
        setIsAddGenre(true)
    }
    const handleDeleteGenre = (id) => {
            const fecth = async () => {
                const data = await deleteGenre(id)
                setGenreList( pre => pre.filter( genre => genre.id != id))
            }
            fecth()
    }

    const handleEditGenre = () =>{
        setIsEditGenre(true)
    }
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Danh sách thể loại</h2>
                <div className="space-y-4">
                    {genreList.map((genre) => (
                        <div
                            key={genre.id}
                            className="flex items-center justify-between bg-gray-100 rounded px-4 py-2"
                        >

                            {
                                (isEditGenre ? 
                                    <div>
                                        <input className="text-lg font-medium text-gray-700">{genre.name} </input>
                                        <button  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                    Access
                                        </button>
                                    </div>
                                     :
                                    <div> 
                                        <span className="text-lg font-medium text-gray-700">{genre.name} </span>
                                        <button onClick={handleEditGenre} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                    Edit
                                    </button>
                                    </div>
                                )
                            }
                            <div className="space-x-2">
                                <button onClick={() => {
                                    handleDeleteGenre(
                                        genre.id
                                    )
                                }} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                                    Delete
                                </button>  
                                
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleOnClick}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                        Thêm thể loại
                    </button>
                </div>
                {isAddGenre && (
                    <div className="mt-6">
                        <CreateGenre setGenreList={setGenreList} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenresPage;
