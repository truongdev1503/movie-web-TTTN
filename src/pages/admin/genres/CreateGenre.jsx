import { useRef } from "react";
import { createGenres } from "../../../Utils/api.admin.util";

const CreateGenre = (props)=>{
    const genreNameRef = useRef()
    const handleSubmit = (e)=>{
        
        e.preventDefault();
        const fecth = async ()=>{
            const data = await createGenres({
                name: e.target.genreName.value,
            })
            if(data){
                alert("them the loai thanh cong")
                props.setGenreList(pre => [...pre, data])
            }else alert("them the loai that bai")
            e.target.reset()
            genreNameRef.current.focus()

        }
        fecth()
    }
    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-start">
                <input
                    ref={genreNameRef}
                    placeholder="Tên thể loại"
                    type="text"
                    name="genreName"
                    className="bg-gray-100 text-gray-800 font-medium px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded transition-colors duration-200 shadow"
                >
                    Thêm thể loại
                </button>
            </form>
        </>
    )
}
export default CreateGenre