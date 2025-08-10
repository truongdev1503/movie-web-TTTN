import { useRef } from "react";
import { createGenres } from "../../../Utils/api.admin.util";

const CreateGenre = ()=>{
    const genreNameRef = useRef()
    const handleSubmit = (e)=>{
        
        e.preventDefault();
        const fecth = async ()=>{
            console.log("hello")
            const data = await createGenres({
                name: e.target.genreName.value,
                description: e.target.genreDesc.value
            })
            console.log(data)
            if(data){
                alert("them the loai thanh cong")
            }else alert("them the loai that bai")
            e.target.reset()
            genreNameRef.current.focus()
        }
        fecth()
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input ref={genreNameRef} placeholder="genreName"  type="text" name ="genreName" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1 rounded-full transition-colors duration-200 shadow "/>
                <input placeholder="genreDesc" type="text" name ="genreDesc" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1 rounded-full transition-colors duration-200 shadow "/>
                <button>CreateGenre</button>
            </form>
        </>
    )
}
export default CreateGenre