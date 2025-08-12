import { useEffect, useState } from "react";
import { updateFilm, getGenres } from "../../../Utils/api.admin.util";
// const [openForm, setOpenForm] = useState(false);
const UpdateFilm = ({ props }) => {
    const [genreList, setGenreList] = useState([]);

    useEffect(() => {
        const fetchGenres = async () => {
            const genres = await getGenres();
            setGenreList(Array.isArray(genres) ? genres : []);
        };
        fetchGenres();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const title = event.target.title.value;
        const genre_ids = Array.from(event.target.genre.selectedOptions).map((o) => +o.value);
        const description = event.target.description.value;
        const release_year = event.target.release_year.value;
        const poster_url = event.target.poster.value;
        const video_url = event.target.video.value;
        const filmData = {
            title,
            genre_ids,
            description,
            release_year,
            poster_url,
            video_url
        };
        try {
            const data = await updateFilm(props.id, filmData);
            if (data) {
                alert("Film updated successfully!");
                
            } else {
                alert("Failed to update film. Please try again.");
            }
            props.setIsClickUpdate(false);
        } catch (error) {
            console.error("Error updating film:", error);
            alert("An error occurred while updating the film.");
        }
        event.target.reset(); // Reset the form fields after submission
    }
    console.log("render")
    const defaultGenreIds = Array.isArray(props?.films?.genres)
        ? props.films.genres.map((g) => g.id)
        : Array.isArray(props?.films?.genre_ids)
        ? props.films.genre_ids
        : [];

    return (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <form 
                onSubmit={handleSubmit} 
                className="bg-black p-4 rounded-lg shadow-lg max-w-sm w-full border border-gray-800 flex flex-col"
                style={{ maxHeight: "420px", overflowY: "auto" }} // Giới hạn chiều cao form
            >
                <h1 className="text-2xl font-bold mb-3 text-center text-red-600">Update Film</h1>
                <div className="mb-1 flex flex-col">
                    <label htmlFor="title" className="block text-gray-200 font-semibold mb-1">Title:</label>
                    <input defaultValue={props.films.title}
                    type="text" id="title" className="border border-gray-700 bg-gray-900 text-white p-2 w-full rounded-md text-sm h-8" />
                </div>
                <div className="mb-1 flex flex-col">
                    <label htmlFor="description" className="block text-gray-200 font-semibold mb-1">Description:</label>
                    <textarea defaultValue={props.films.description} id="description" className="border border-gray-700 bg-gray-900 text-white p-2 w-full rounded-md text-sm h-10"></textarea>
                </div>
                <div className="mb-1 flex flex-col">
                    <label htmlFor="release_year" className="block text-gray-200 font-semibold mb-1">Release Year:</label>
                    <input defaultValue={props.films.release_year} type="number" id="release_year" className="border border-gray-700 bg-gray-900 text-white p-2 w-full rounded-md text-sm h-8" />
                </div>
                <div className="mb-1 flex flex-col">
                    <label htmlFor="poster" className="block text-gray-200 font-semibold mb-1">Poster URL:</label>
                    <input defaultValue={props.films.poster_url} type="text" id="poster" className="border border-gray-700 bg-gray-900 text-white p-2 w-full rounded-md text-sm h-8" />
                </div>
                <div className="mb-1 flex flex-col">
                    <label htmlFor="genre" className="block text-gray-200 font-semibold mb-1">Genre:</label>
                    <select
                        id="genre"
                        name="genre"
                        multiple
                        size={3}
                        defaultValue={defaultGenreIds}
                        className="border border-gray-700 bg-gray-900 text-white p-2 w-full rounded-md text-sm h-30 overflow-y-auto"
                    >
                        {genreList.map((genre) => (
                            <option key={genre.id} value={genre.id}>{genre.name}</option>
                        ))}
                    </select>
                    <div className="mt-1 flex flex-wrap gap-1">
                        {defaultGenreIds.length ? (
                            defaultGenreIds.map((id) => {
                                const g = genreList.find((x) => x.id === id);
                                return (
                                    <span key={id} className="px-2 py-0.5 text-xs rounded-full bg-red-700 text-white">
                                        {g?.name || id}
                                    </span>
                                );
                            })
                        ) : (
                            <span className="text-gray-400 text-xs">Chưa có thể loại</span>
                        )}
                    </div>
                </div>
                
                <div className="mb-1 flex flex-col"></div>
                <div className="mb-2 flex flex-col">
                    <label htmlFor="video" className="block text-gray-200 font-semibold mb-1">Video URL:</label>
                    <input defaultValue={props.films.video_url} type="text" id="video" className="border border-gray-700 bg-gray-900 text-white p-2 w-full rounded-md focus:border-red-600 focus:ring-red-600 h-8" />
                </div>
                
                <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200 font-bold w-full mt-2">Update Film</button>
            </form>
        </div>
    )
}

export default UpdateFilm;