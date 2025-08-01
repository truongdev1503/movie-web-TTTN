import { createFilm } from "../../../Utils/api.admin.util";

const CreateFilm = () => {
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
            const data = await createFilm(filmData);
            if (data) {
                alert("Film created successfully!");
            } else {
                alert("Failed to create film. Please try again.");
            }
        } catch (error) {
            console.error("Error creating film:", error);
            alert("An error occurred while creating the film.");
        }

    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Film</h1>
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title:</label>
                <input type="text" id="title" className="border border-gray-300 p-2 w-full rounded-md" />
            </div>
            <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description:</label>
                <textarea id="description" className="border border-gray-300 p-2 w-full rounded-md"></textarea>
            </div>  
            <div className="mb-4">
                <label htmlFor="release_year" className="block text-gray-700 font-medium mb-2">Release Year:</label>
                <input type="number" id="release_year" className="border border-gray-300 p-2 w-full rounded-md" />
            </div>
            <div className="mb-4">
                <label htmlFor="poster" className="block text-gray-700 font-medium mb-2">Poster URL:</label>
                <input type="text" id="poster" className="border border-gray-300 p-2 w-full rounded-md" />
            </div>
            <div className="mb-4">
                <label htmlFor="video" className="block text-gray-700 font-medium mb-2">Video URL:</label>
                <input type="text" id="video" className="border border-gray-300 p-2 w-full rounded-md" />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">Create Film</button>    
        </form>
    )
}

export default CreateFilm;