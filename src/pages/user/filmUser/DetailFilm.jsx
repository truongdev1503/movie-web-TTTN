import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFilmById } from "../../../Utils/api.admin.util";
import { getComments, sendComment, getRating, sendRating } from "../../../Utils/api.user.util";

const DetailFilm = ()=>{
    const {id} = useParams();
    console.log("Film ID:", id);

    const [film, setFilm] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentsError, setCommentsError] = useState("");
    const [commenterName, setCommenterName] = useState("");
    const [commentContent, setCommentContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ratings, setRatings] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [ratingLoading, setRatingLoading] = useState(false);
    const [ratingError, setRatingError] = useState("");
    const [selectedRating, setSelectedRating] = useState(0);
    const [ratingSubmitting, setRatingSubmitting] = useState(false);

    const formatCommentTime = (isoString) => {
        if (!isoString) return "";
        try {
            const date = new Date(isoString);
            return date.toLocaleString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "";
        }
    };

    useEffect(() => {
        const fetchFilm = async () => {
            const data = await getFilmById(id);
            setFilm(data);
        };
        fetchFilm();
    }, [id]);

    useEffect(() => {
        const fetchCommentsForFilm = async () => {
            setCommentsLoading(true);
            setCommentsError("");
            try {
                const data = await getComments(id);
                setComments(Array.isArray(data) ? data : []);
            } catch (error) {
                setCommentsError("Không tải được bình luận.");
            } finally {
                setCommentsLoading(false);
            }
        };
        if (id) fetchCommentsForFilm();
    }, [id]);

    useEffect(() => {
        const fetchRatingsForFilm = async () => {
            setRatingLoading(true);
            setRatingError("");
            try {
                const data = await getRating(id);
                const list = Array.isArray(data) ? data : [];
                setRatings(list);
                if (list.length) {
                    const sum = list.reduce((acc, item) => acc + (Number(item?.score) || 0), 0);
                    setAvgRating(sum / list.length);
                } else {
                    setAvgRating(0);
                }
            } catch (error) {
                setRatingError("Không tải được đánh giá.");
            } finally {
                setRatingLoading(false);
            }
        };
        if (id) fetchRatingsForFilm();
    }, [id]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!commenterName.trim() || !commentContent.trim()) return;
        setIsSubmitting(true);
        try {
            const created = await sendComment(id, commenterName.trim(), commentContent.trim());
            setComments((prev) => [...prev, created]);
            setCommentContent("");
        } catch (error) {
            // Keep UX minimal; do not disrupt other logic
        } finally {
            setIsSubmitting(false);
        }
    };

    console.log("Film data:", film);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-full max-w-6xl bg-black rounded-2xl shadow-2xl overflow-hidden">
                {film ? (
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 flex-shrink-0 p-8 flex flex-col items-center justify-center bg-black">
                            <img
                                src={film.poster_url}
                                alt={film.title}
                                className="w-56 h-80 object-cover rounded-xl shadow-lg"
                            />
                        </div>
                        <div className="md:w-2/3 p-10 flex flex-col justify-between">
                            <h2 className="text-4xl font-extrabold text-white mb-6 pb-2">{film.title}</h2>
                            <video controls className="w-full rounded-xl mb-8 shadow-lg bg-black">
                                <source src={film.video_url} />
                                Your browser does not support the video tag.
                            </video>
                            <div className="flex items-center mb-6">
                                <span className="bg-red-700 text-white font-semibold px-4 py-2 rounded-full mr-4">
                                    {film.release_year}
                                </span>
                                <span className="text-gray-400 text-base">Năm phát hành</span>
                            </div>
                            <p className="text-gray-300 text-lg leading-relaxed mb-8">{film.description}</p>

                            {/* Đánh giá */}
                            <div className="mt-2 mb-8">
                                <h3 className="text-2xl font-bold text-white mb-3">Đánh giá</h3>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex">
                                        {[1,2,3,4,5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                aria-label={`Đánh giá ${star} sao`}
                                                onClick={() => setSelectedRating(star)}
                                                className="mx-0.5 text-2xl"
                                            >
                                                <span className={star <= selectedRating ? "text-yellow-400" : "text-gray-500"}>★</span>
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        disabled={!selectedRating || ratingSubmitting}
                                        onClick={async () => {
                                            if (!selectedRating) return;
                                            setRatingSubmitting(true);
                                            try {
                                                const created = await sendRating(id, selectedRating);
                                                setRatings((prev) => {
                                                    const updated = [...prev, created];
                                                    const sum = updated.reduce((acc, item) => acc + (Number(item?.score) || 0), 0);
                                                    setAvgRating(updated.length ? sum / updated.length : 0);
                                                    return updated;
                                                });
                                            } catch (e) {
                                            } finally {
                                                setRatingSubmitting(false);
                                            }
                                        }}
                                        className="bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-lg"
                                    >
                                        {ratingSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                                    </button>
                                </div>
                                {ratingLoading ? (
                                    <div className="text-gray-400">Đang tải đánh giá...</div>
                                ) : ratingError ? (
                                    <div className="text-red-500">{ratingError}</div>
                                ) : (
                                    <div className="text-gray-300">
                                        Trung bình: <span className="text-white font-semibold">{avgRating ? avgRating.toFixed(1) : 0}</span>/5 ({ratings?.length || 0} lượt)
                                    </div>
                                )}
                            </div>

                            {/* Bình luận */}
                            <div className="mt-4">
                                <h3 className="text-2xl font-bold text-white mb-4">Bình luận</h3>

                                {/* Form gửi bình luận */}
                                <form onSubmit={handleSubmitComment} className="mb-6 bg-zinc-900 p-4 rounded-xl">
                                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                                        <input
                                            type="text"
                                            placeholder="Tên của bạn"
                                            value={commenterName}
                                            onChange={(e) => setCommenterName(e.target.value)}
                                            className="flex-1 rounded-lg bg-zinc-800 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-red-700"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <textarea
                                            placeholder="Viết bình luận..."
                                            value={commentContent}
                                            onChange={(e) => setCommentContent(e.target.value)}
                                            className="w-full min-h-[80px] rounded-lg bg-zinc-800 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-red-700"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-lg"
                                    >
                                        {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
                                    </button>
                                </form>

                                {/* Danh sách bình luận */}
                                {commentsLoading ? (
                                    <div className="text-gray-400">Đang tải bình luận...</div>
                                ) : commentsError ? (
                                    <div className="text-red-500">{commentsError}</div>
                                ) : (
                                    <ul className="space-y-4">
                                        {comments?.length ? (
                                            comments.map((cmt, idx) => (
                                                <li key={cmt?.id ?? idx} className="bg-zinc-900 p-4 rounded-xl">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-semibold">{cmt?.name ?? "Người dùng"}</span>
                                                        {cmt?.created_at && (
                                                            <span className="text-gray-400 text-xs">{formatCommentTime(cmt.created_at)}</span>
                                                        )}
                                                    </div>
                                                    <div className="text-gray-300">{cmt?.content}</div>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-gray-400">Chưa có bình luận nào.</li>
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-96">
                        <span className="text-red-700 text-2xl animate-pulse">Đang tải phim...</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetailFilm;