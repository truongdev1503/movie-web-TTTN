import { updateFilm } from "../../../Utils/api.admin.util";
// const [openForm, setOpenForm] = useState(false);
const UpdateFilm = ({ props }) => {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const title = event.target.title.value;
        const description = event.target.description.value;
        const release_year = event.target.release_year.value;
        const poster_url = event.target.poster.value;
        const video_url = event.target.video.value;
        const filmData = {
            title,
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

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <form 
                onSubmit={handleSubmit} 
                className="bg-black p-4 rounded-lg shadow-lg max-w-md w-full border border-gray-800 flex flex-col"
            >
                <h1 className="text-2xl font-bold mb-4 text-center text-red-600">Update Film</h1>
                <div className="mb-2 flex flex-col">
                    <label htmlFor="title" className="block text-gray-200 font-semibold mb-1">Title:</label>
                    <input defaultValue={props.films.title}
                    type="text" id="title" className="border border-gray-700 bg-gray-900 text-white p-2 w-full rounded-md focus:border-red-600 focus:ring-red-600" />
                </div>
                <div className="mb-2 flex flex-col">
                    <label htmlFor="description" className="block text-gray-200 font-semibold mb-1">Description:</label>
                    <textarea defaultValue={props.films.description} id="description" className="border border-gray-700 bg-gray-900 text-white p-2 w-full rounded-md focus:border-red-600 focus:ring-red-600"></textarea>
                </div>
                <div className="mb-2 flex flex-col">
                    <label htmlFor="release_year" className="block text-gray-200 font-semibold mb-1">Release Year:</label>
                    <input defaultValue={props.films.release_year} type="number" id="release_year" className="border border-gray-700 bg-gray-900 text-white p-2 w-full rounded-md focus:border-red-600 focus:ring-red-600" />
                </div>
                <div className="mb-2 flex flex-col">
                    <label htmlFor="poster" className="block text-gray-200 font-semibold mb-1">Poster URL:</label>
                    <input defaultValue={props.films.poster_url} type="text" id="poster" className="border border-gray-700 bg-gray-900 text-white p-2 w-full rounded-md focus:border-red-600 focus:ring-red-600" />
                </div>
                <div className="mb-2 flex flex-col">
                    <label htmlFor="video" className="block text-gray-200 font-semibold mb-1">Video URL:</label>
                    <input defaultValue={props.films.video_url} type="text" id="video" className="border border-gray-700 bg-gray-900 text-white p-2 w-full rounded-md focus:border-red-600 focus:ring-red-600" />
                </div>
                <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200 font-bold w-full mt-2">Update Film</button>
            </form>
        </div>
    )
}

export default UpdateFilm;