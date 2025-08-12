import { useEffect, useState } from "react";
import { getFilms } from "../../../Utils/api.admin.util";
import { Navigate, useNavigate } from "react-router-dom";

const FilmUser = () => {
  let [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchFilms = async () => {
      const films = await getFilms();
      setFilms(films);
      setLoading(false);
    }
    fetchFilms();
  }, []);
  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center text-red-600">Film List</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-semibold text-gray-500">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {films.map(film => (
            <div
              key={film.id}
              className="bg-black rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
              onClick={() => navigate(`/film/${film.id}`)}
            >
              <img
                src={film?.poster_url ? film.poster_url : "https://img.lovepik.com/photo/50084/7826.jpg_wh860.jpg"}
                alt={film.title}
                className="w-full h-56 object-cover transition-transform duration-300 ease-in-out hover:scale-110"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-xl font-bold mb-2 text-white line-clamp-1">{film.title}</h2>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(film?.genres || []).map((g) => (
                    <span key={g.id} className="px-2 py-0.5 text-xs rounded-full bg-red-700 text-white">{g.name}</span>
                  ))}
                </div>
                <p className="text-white mb-2 flex-1 line-clamp-3">{film.description}</p>
                <p className="text-sm text-red-500">Release Date: {film.release_year}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

}

export default FilmUser;