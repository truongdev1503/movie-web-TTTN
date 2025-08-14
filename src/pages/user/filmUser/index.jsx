import { useEffect, useMemo, useState } from "react";
import { getFilms } from "../../../Utils/api.admin.util";
import { likeFilm, dislikeFilm } from "../../../Utils/api.user.util";
import { useNavigate } from "react-router-dom";

const FilmUser = () => {
  let [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 18; // số phim mỗi trang
  let navigate = useNavigate();
  const [likingIds, setLikingIds] = useState(new Set());
  const [dislikingIds, setDislikingIds] = useState(new Set());

  useEffect(() => {
    const fetchFilms = async () => {
      const fetched = await getFilms();
      const sorted = Array.isArray(fetched)
        ? [...fetched].sort((a, b) => (Number(a?.id) || 0) - (Number(b?.id) || 0))
        : [];
      setFilms(sorted);
      setCurrentPage(1);
      setLoading(false);
    }
    fetchFilms();
  }, []);

  const totalPages = useMemo(() => {
    return Math.ceil((films?.length || 0) / pageSize) || 1;
  }, [films]);

  const currentFilms = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return films.slice(startIndex, startIndex + pageSize);
  }, [films, currentPage]);

  const pageNumbers = useMemo(() => {
    const maxToShow = 7;
    const total = totalPages;
    if (total <= maxToShow) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages = new Set();
    pages.add(1);
    pages.add(total);
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(total - 1, currentPage + 2);
    for (let i = start; i <= end; i++) pages.add(i);
    return Array.from(pages).sort((a, b) => a - b);
  }, [currentPage, totalPages]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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
      // giữ nguyên nếu lỗi
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
  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center text-red-600">Film List</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-semibold text-gray-500">Loading...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4">
            {currentFilms.map(film => (
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
                  <h2 className="text-sm font-semibold text-white truncate">{film.title}</h2>
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
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {pageNumbers.map((p, idx) => {
              const prev = pageNumbers[idx - 1];
              const showDots = prev && p - prev > 1;
              return (
                <>
                  {showDots && (
                    <span key={`dots-${p}`} className="px-2 text-sm text-neutral-500">…</span>
                  )}
                  <button
                    key={p}
                    className={`px-3 py-1.5 rounded text-sm border ${p === currentPage ? 'bg-red-600 border-red-600 text-white' : 'border-neutral-700 hover:bg-neutral-800'} text-white`}
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </button>
                </>
              );
            })}
            <button
              className="px-3 py-1.5 rounded border border-neutral-700 text-sm hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );

}

export default FilmUser;