import { useEffect, useState } from "react";
import CreateGenre from "./CreateGenre";
import { getGenres } from "../../../Utils/api.admin.util";

const GenresPage = () => {
    const [genreList, setGenreList] = useState([])
    const [isAddGenre, setIsAddGenre] = useState(false)
    useEffect( () =>{
        const fecth = async () =>{
            const data = await getGenres()
            setGenreList(data)
            console.log(data)
        }
        fecth()
        
    },[])
    const handleOnClick = ()=>{
        setIsAddGenre(true)
    }
    return (
        <div>
            <button>Danh sách thể loại</button>
            {
                genreList.map( (genre) =>(
                    <div key={genre.id} > {genre.name} </div>
                )

                )
            }
            <br />
            <button onClick={handleOnClick}>Thêm thể loại</button>
            {
                (isAddGenre && 
                    <CreateGenre/>
                )
            }
        </div>
        

    );
};

export default GenresPage;
