import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFilmsByGenre, getGenres } from "../../../Utils/api.admin.util";

const GenreBrowse = () => {
  const { genreId } = useParams();
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitial = async () => {
      const list = await getGenres();
      setGenres(Array.isArray(list) ? list : []);
    };
    loadInitial();
  }, []);

  useEffect(() => {
    const loadMovies = async () => {
      if (!genreId) {
        setFilms([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getFilmsByGenre(genreId);
        setFilms(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [genreId]);

  const activeGenre = useMemo(
    () => genres.find((g) => String(g.id) === String(genreId)),
    [genres, genreId]
  );

  return (
    <div className="min-h-screen">
      <div className="flex flex-wrap gap-2 p-4">
        {genres.map((g) => (
          <button
            key={g.id}
            className={`px-3 py-1 rounded-full border text-sm transition ${
              String(g.id) === String(genreId)
                ? "bg-red-700 border-red-700 text-white"
                : "bg-black border-red-700 text-red-400 hover:bg-red-800 hover:text-white"
            }`}
            onClick={() => navigate(`/genres/${g.id}`)}
          >
            {g.name}
          </button>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-center text-white mt-2 mb-4">
        {activeGenre ? `Phim thuộc: ${activeGenre.name}` : "Danh mục thể loại"}
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <span className="text-red-700 text-lg animate-pulse">Đang tải...</span>
        </div>
      ) : activeGenre ? (
        films.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {films.map((film) => (
              <div
                key={film.id}
                className="bg-black rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
                onClick={() => navigate(`/film/${film.id}`)}
              >
                <img
                  src={film?.poster_url ? film.poster_url : "https://img.lovepik.com/photo/50084/7826.jpg_wh860.jpg"}
                  alt={film.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-1">{film.title}</h3>
                  <p className="text-gray-300 text-sm line-clamp-3 flex-1">{film.description}</p>
                  <span className="text-xs text-red-400 mt-2">Năm: {film.release_year}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-48">
            <span className="text-gray-400">Không có phim cho thể loại này.</span>
          </div>
        )
      ) : (
        <div className="text-center text-gray-300 p-6">Hãy chọn một thể loại để xem phim.</div>
      )}
    </div>
  );
};

export default GenreBrowse;


