import { useEffect , useState} from "react";
import { createFilm, getGenres } from "../../../Utils/api.admin.util";

const CreateFilm = (props) => {
    const [genreList, setGenreList] = useState([]);
    useEffect(() => {
        const fetchGenres = async () => {
            const genres = await getGenres(); 
            setGenreList(genres);
        };
        fetchGenres();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const title = event.target.title.value;
        const genre = Array.from(event.target.genre.selectedOptions).map((option) =>  +option.value);
        const description = event.target.description.value;
        const release_year = event.target.release_year.value;
        const poster_url = event.target.poster.value;
        const video_url = event.target.video.value;
        const filmData = {
            title,
            genre_ids: genre,
            description,
            release_year,
            poster_url,
            video_url
        };
        try {
            const data = await createFilm(filmData);
            if (data) {
                alert("Film created successfully!");
                props.setFilms(films => {
                    films.push(data);
                    return films;
                });
                props.setIsClickAdd(false);
            } else {
                alert("Failed to create film. Please try again.");
            }
        } catch (error) {
            console.error("Error creating film:", error);
            alert("An error occurred while creating the film.");
        }
        event.target.reset(); 
    }
    console.log("re-render CreatFilm")
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <form 
                onSubmit={handleSubmit} 
                className="bg-black p-3 rounded-lg shadow-lg max-w-2xl w-full border border-gray-800"
            >
                <h1 className="text-2xl font-bold mb-3 text-center text-red-600">Create Film</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col">
                        <label htmlFor="title" className="block text-gray-200 font-semibold mb-1">Title:</label>
                        <input type="text" id="title" className="border border-gray-700 bg-gray-900 text-white p-2 w-full rounded-md focus:border-red-600 focus:ring-red-600" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="release_year" className="block text-gray-200 font-semibold mb-1">Release Year:</label>
                        <input type="number" id="release_year" className="border border-gray-700 bg-gray-900 text-white p-2 w-full rounded-md focus:border-red-600 focus:ring-red-600" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="poster" className="block text-gray-200 font-semibold mb-1">Poster URL:</label>
                        <input type="text" id="poster" className="border border-gray-700 bg-gray-900 text-white p-2 w-full rounded-md focus:border-red-600 focus:ring-red-600" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="video" className="block text-gray-200 font-semibold mb-1">Video URL:</label>
                        <input type="text" id="video" className="border border-gray-700 bg-gray-900 text-white p-2 w-full rounded-md focus:border-red-600 focus:ring-red-600" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="genre" className="block text-gray-200 font-semibold mb-1">Genre:</label>
                        <select
                            id="genre"
                            name="genre"
                            multiple
                            size={3}
                            className="border border-gray-700 bg-gray-900 text-white p-2 w-full rounded-md focus:border-red-600 focus:ring-red-600 h-24 overflow-y-auto"
                        >
                            <option value="" disabled>Chọn thể loại...</option>
                            {genreList.map((genre) => (
                                <option key={genre.id} value={genre.id}>{genre.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="description" className="block text-gray-200 font-semibold mb-1">Description:</label>
                        <input type="text" id="description" className="border border-gray-700 bg-gray-900 text-white p-2 w-full rounded-md focus:border-red-600 focus:ring-red-600" />
                    </div>
                    <button type="submit" className="md:col-span-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200 font-bold w-full">Create Film</button>
                </div>
            </form>
        </div>
    )
}

export default CreateFilm;