import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFilmsByGenre, getGenres } from "../../../Utils/api.admin.util";
import { likeFilm, dislikeFilm } from "../../../Utils/api.user.util";

const GenreBrowse = () => {
  const { genreId } = useParams();
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 18;
  const [likingIds, setLikingIds] = useState(new Set());
  const [dislikingIds, setDislikingIds] = useState(new Set());

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
        const list = Array.isArray(data) ? data : [];
        const sorted = [...list].sort((a, b) => (Number(a?.id) || 0) - (Number(b?.id) || 0));
        setFilms(sorted);
        setCurrentPage(1);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [genreId]);
  const handleLike = async (e, id) => {
    e.stopPropagation();
    if (likingIds.has(id)) return;
    const next = new Set(likingIds);
    next.add(id);
    setLikingIds(next);
    try {
      const res = await likeFilm(id);
      setFilms((prev) => prev.map((f) => {
        if (f.id !== id) return f;
        const serverLikes = typeof res?.likes === 'number' ? res.likes : null;
        const currentLikes = typeof f.likes === 'number' ? f.likes : 0;
        return { ...f, likes: serverLikes ?? (currentLikes + 1) };
      }));
    } catch (err) {
    } finally {
      setLikingIds((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    }
  }

  const handleDislike = async (e, id) => {
    e.stopPropagation();
    if (dislikingIds.has(id)) return;
    const next = new Set(dislikingIds);
    next.add(id);
    setDislikingIds(next);
    try {
      const res = await dislikeFilm(id);
      setFilms((prev) => prev.map((f) => {
        if (f.id !== id) return f;
        const serverDislikes = typeof res?.dislikes === 'number' ? res.dislikes : null;
        const currentDislikes = typeof f.dislikes === 'number' ? f.dislikes : 0;
        return { ...f, dislikes: serverDislikes ?? (currentDislikes + 1) };
      }));
    } catch (err) {
    } finally {
      setDislikingIds((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    }
  }

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
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4">
              {films.slice((currentPage-1)*pageSize, (currentPage-1)*pageSize + pageSize).map((film) => (
                <div
                  key={film.id}
                  className="group rounded-md overflow-hidden bg-neutral-900 cursor-pointer hover:shadow-lg transition"
                  onClick={() => navigate(`/film/${film.id}`)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={film?.poster_url ? film.poster_url : "https://img.lovepik.com/photo/50084/7826.jpg_wh860.jpg"}
                      alt={film.title}
                      className="w-full aspect-[2/3] object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-black/60 text-white">
                      <span>👁</span>
                      <span>{typeof film.views === 'number' ? film.views : 0}</span>
                    </div>
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                      <button
                        aria-label="Dislike film"
                        onClick={(e) => handleDislike(e, film.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${dislikingIds.has(film.id) ? 'opacity-70' : ''} bg-black/60 hover:bg-black/80 text-white`}
                      >
                        <span>👎</span>
                        <span>{typeof film.dislikes === 'number' ? film.dislikes : 0}</span>
                      </button>
                      <button
                        aria-label="Like film"
                        onClick={(e) => handleLike(e, film.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${likingIds.has(film.id) ? 'opacity-70' : ''} bg-black/60 hover:bg-black/80 text-white`}
                      >
                        <span className="text-red-500">❤</span>
                        <span>{typeof film.likes === 'number' ? film.likes : 0}</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-semibold text-white truncate">{film.title}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-400">{film.release_year}</p>
                      <div className="flex gap-1 overflow-hidden">
                        {(film?.genres || []).slice(0, 1).map((g) => (
                          <span key={g.id} className="px-1.5 py-0.5 text-[10px] rounded bg-red-700 text-white whitespace-nowrap">{g.name}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mt-2 mb-6 select-none">
              <button
                className="px-3 py-1.5 rounded border border-neutral-700 text-sm hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                onClick={() => setCurrentPage((p)=> Math.max(1, p-1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {Array.from({length: Math.ceil(films.length / pageSize) || 1}, (_,i)=> i+1).map((p)=> (
                <button
                  key={p}
                  className={`px-3 py-1.5 rounded text-sm border ${p === currentPage ? 'bg-red-600 border-red-600 text-white' : 'border-neutral-700 hover:bg-neutral-800'} text-white`}
                  onClick={() => { setCurrentPage(p); window.scrollTo({top:0, behavior:'smooth'}); }}
                >
                  {p}
                </button>
              ))}
              <button
                className="px-3 py-1.5 rounded border border-neutral-700 text-sm hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                onClick={() => setCurrentPage((p)=> Math.min(Math.ceil(films.length / pageSize) || 1, p+1))}
                disabled={currentPage === (Math.ceil(films.length / pageSize) || 1)}
              >
                Next
              </button>
            </div>
          </>
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


