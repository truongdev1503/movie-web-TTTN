import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFilmById } from "../../../Utils/api.admin.util";
import { getComments, sendComment, sendReply, getRating, sendRating, likeFilm, watchFilm, dislikeFilm, likeComment, dislikeComment } from "../../../Utils/api.user.util";

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
    const [replyOpen, setReplyOpen] = useState({});
    const [replyName, setReplyName] = useState({});
    const [replyContent, setReplyContent] = useState({});
    const [replySubmittingIds, setReplySubmittingIds] = useState(new Set());
    const [ratings, setRatings] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [ratingLoading, setRatingLoading] = useState(false);
    const [ratingError, setRatingError] = useState("");
    const [selectedRating, setSelectedRating] = useState(0);
    const [ratingSubmitting, setRatingSubmitting] = useState(false);
    const [liking, setLiking] = useState(false);
    const [disliking, setDisliking] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [countingView, setCountingView] = useState(false);
    const [hasCountedView, setHasCountedView] = useState(false);

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

    const toggleReply = (commentId) => {
        setReplyOpen((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    const handleSubmitReply = async (commentId) => {
        const name = (replyName[commentId] || "").trim();
        const content = (replyContent[commentId] || "").trim();
        if (!name || !content) return;
        if (replySubmittingIds.has(commentId)) return;
        setReplySubmittingIds((prev) => new Set(prev).add(commentId));
        try {
            const created = await sendReply(id, commentId, name, content);
            setComments((prev) => {
                // Nếu có replies lồng trong item cha, cập nhật trực tiếp; nếu không, thêm vào danh sách phẳng
                const hasNested = prev.some((c) => Array.isArray(c?.replies));
                if (hasNested) {
                    return prev.map((c) => c.id === commentId
                        ? { ...c, replies: [...(c.replies || []), created] }
                        : c
                    );
                }
                return [...prev, created];
            });
            setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
            setReplyName((prev) => ({ ...prev, [commentId]: "" }));
            setReplyOpen((prev) => ({ ...prev, [commentId]: false }));
        } catch (e) {
        } finally {
            setReplySubmittingIds((prev) => {
                const next = new Set(prev);
                next.delete(commentId);
                return next;
            });
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
                            <div className="flex items-center gap-3 mb-4">
                                <button
                                    type="button"
                                    disabled={liking}
                                    onClick={async () => {
                                        if (liking) return;
                                        setLiking(true);
                                        try {
                                            const res = await likeFilm(id);
                                            const nextLikes = typeof res?.likes === 'number' ? res.likes : ((Number(film?.likes) || 0) + 1);
                                            setFilm((prev) => prev ? { ...prev, likes: nextLikes } : prev);
                                        } catch (e) {
                                        } finally {
                                            setLiking(false);
                                        }
                                    }}
                                    className="bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-lg"
                                >
                                    {liking ? "Đang thích..." : "Thích"}
                                </button>
                                <span className="text-gray-300">{typeof film?.likes === 'number' ? film.likes : 0} lượt thích</span>

                                <button
                                    type="button"
                                    disabled={disliking}
                                    onClick={async () => {
                                        if (disliking) return;
                                        setDisliking(true);
                                        try {
                                            const res = await dislikeFilm(id);
                                            const nextDislikes = typeof res?.dislikes === 'number' ? res.dislikes : ((Number(film?.dislikes) || 0) + 1);
                                            setFilm((prev) => prev ? { ...prev, dislikes: nextDislikes } : prev);
                                        } catch (e) {
                                        } finally {
                                            setDisliking(false);
                                        }
                                    }}
                                    className="bg-zinc-700 hover:bg-zinc-800 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-lg"
                                >
                                    {disliking ? "Đang dislike..." : "Dislike"}
                                </button>
                                <span className="text-gray-300">{typeof film?.dislikes === 'number' ? film.dislikes : 0} không thích</span>
                            </div>
                            <video
                                controls
                                onTimeUpdate={async (e) => {
                                    if (hasCountedView || countingView) return;
                                    const v = e.currentTarget;
                                    const duration = Number(v.duration) || 0;
                                    const current = Number(v.currentTime) || 0;
                                    const reachedPercent = duration > 0 && current / duration >= 0.5; // đã xem >= 50%
                                    if (reachedPercent) {
                                        setCountingView(true);
                                        try {
                                            const res = await watchFilm(id);
                                            if (res?.video_url) setVideoUrl(res.video_url);
                                            setFilm((prev) => prev ? { ...prev, views: (Number(prev.views) || 0) + 1 } : prev);
                                            setHasCountedView(true);
                                        } catch (e) {
                                        } finally {
                                            setCountingView(false);
                                        }
                                    }
                                }}
                                onEnded={async () => {
                                    if (hasCountedView || countingView) return;
                                    setCountingView(true);
                                    try {
                                        const res = await watchFilm(id);
                                        if (res?.video_url) setVideoUrl(res.video_url);
                                        setFilm((prev) => prev ? { ...prev, views: (Number(prev.views) || 0) + 1 } : prev);
                                        setHasCountedView(true);
                                    } catch (e) {
                                    } finally {
                                        setCountingView(false);
                                    }
                                }}
                                className="w-full rounded-xl mb-8 shadow-lg bg-black"
                            >
                                <source src={videoUrl || film.video_url} />
                                Your browser does not support the video tag.
                            </video>
                            <div className="flex items-center mb-6">
                                <span className="bg-red-700 text-white font-semibold px-4 py-2 rounded-full mr-4">
                                    {film.release_year}
                                </span>
                                <span className="text-gray-400 text-base">Năm phát hành</span>
                                <span className="ml-4 text-gray-300">👁 {typeof film?.views === 'number' ? film.views : 0} lượt xem</span>
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
                                    comments
                                        .filter((c) => !c?.parent)
                                        .map((cmt, idx) => {
                                            const replies = Array.isArray(cmt?.replies) ? cmt.replies : comments.filter((r) => r?.parent === cmt?.id);
                                            const open = !!replyOpen[cmt?.id];
                                            const submitting = replySubmittingIds.has(cmt?.id);
                                            return (
                                                <li key={cmt?.id ?? idx} className="bg-zinc-900 p-4 rounded-xl">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-semibold">{cmt?.name ?? "Người dùng"}</span>
                                                        {cmt?.created_at && (
                                                            <span className="text-gray-400 text-xs">{formatCommentTime(cmt.created_at)}</span>
                                                        )}
                                                    </div>
                                                    <div className="text-gray-300">{cmt?.content}</div>
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={async () => {
                                                                try {
                                                                    const res = await likeComment(cmt?.id);
                                                                    const nextLikes = typeof res?.likes === 'number' ? res.likes : ((Number(cmt?.likes) || 0) + 1);
                                                                    setComments((prev) => prev.map((x) => x.id === cmt?.id ? { ...x, likes: nextLikes } : x));
                                                                } catch (e) {}
                                                            }}
                                                            className="text-sm text-white bg-blue-700 hover:bg-blue-800 px-2 py-1 rounded"
                                                        >
                                                            👍 {typeof cmt?.likes === 'number' ? cmt.likes : 0}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={async () => {
                                                                try {
                                                                    const res = await dislikeComment(cmt?.id);
                                                                    const nextDislikes = typeof res?.dislikes === 'number' ? res.dislikes : ((Number(cmt?.dislikes) || 0) + 1);
                                                                    setComments((prev) => prev.map((x) => x.id === cmt?.id ? { ...x, dislikes: nextDislikes } : x));
                                                                } catch (e) {}
                                                            }}
                                                            className="text-sm text-white bg-zinc-700 hover:bg-zinc-800 px-2 py-1 rounded"
                                                        >
                                                            👎 {typeof cmt?.dislikes === 'number' ? cmt.dislikes : 0}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleReply(cmt?.id)}
                                                            className="text-sm text-red-500 hover:underline"
                                                        >
                                                            {open ? "Hủy" : "Trả lời"}
                                                        </button>
                                                    </div>
                                                    <div className="mt-2">
                                                        
                                                    </div>
                                                    {open && (
                                                        <div className="mt-3 space-y-2">
                                                            <input
                                                                type="text"
                                                                value={replyName[cmt?.id] || ""}
                                                                onChange={(e) => setReplyName((prev) => ({ ...prev, [cmt?.id]: e.target.value }))}
                                                                placeholder="Tên của bạn"
                                                                className="w-full rounded-lg bg-zinc-800 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-red-700"
                                                            />
                                                            <textarea
                                                                value={replyContent[cmt?.id] || ""}
                                                                onChange={(e) => setReplyContent((prev) => ({ ...prev, [cmt?.id]: e.target.value }))}
                                                                placeholder="Viết phản hồi..."
                                                                className="w-full min-h-[60px] rounded-lg bg-zinc-800 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-red-700"
                                                            />
                                                            <div>
                                                                <button
                                                                    type="button"
                                                                    disabled={submitting}
                                                                    onClick={() => handleSubmitReply(cmt?.id)}
                                                                    className="bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-lg"
                                                                >
                                                                    {submitting ? "Đang gửi..." : "Gửi trả lời"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {replies?.length ? (
                                                        <ul className="mt-3 pl-4 border-l border-zinc-700 space-y-3">
                                                            {replies.map((rep, i) => (
                                                                <li key={rep?.id ?? i} className="bg-zinc-800 p-3 rounded-lg">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-white font-semibold">{rep?.name ?? "Người dùng"}</span>
                                                                        {rep?.created_at && (
                                                                            <span className="text-gray-400 text-xs">{formatCommentTime(rep.created_at)}</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-gray-300">{rep?.content}</div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : null}
                                                </li>
                                            );
                                        })
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