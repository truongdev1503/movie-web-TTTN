import { useRef } from "react";
import { Navigate, Outlet, useNavigate, useSearchParams } from "react-router-dom";

const DefaultUserLayout = () => {
    const inputRef = useRef();
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();
    const handleClick = (e) => {
        e.preventDefault();
        const key = inputRef.current.inputSearch.value
        navigate(`/search?key=${key}`)
    }
    return (
        <>
            <header className="bg-gradient-to-r from-black via-gray-900 to-red-900 text-white shadow-lg py-4 px-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <a href="/" className="text-3xl font-extrabold tracking-wide hover:text-red-500 transition-colors duration-200">
                        <span className="text-red-600">Movi</span>
                        <span className="text-gray-300">eWeb</span>
                        <span className="text-red-600">TD</span>
                    </a>
                </div>
                <div className="flex-1 flex justify-center">
                    <form
                        ref={inputRef}
                        onSubmit={handleClick}
                        className="flex items-center bg-black/70 rounded-full shadow-inner px-4 py-2 gap-2 w-full max-w-md"
                    >
                        <input
                            name="inputSearch"
                            placeholder="Tìm phim, diễn viên, thể loại..."
                            type="text"
                            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none px-2"
                            defaultValue={params.get("key")}
                        />
                        <button
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1 rounded-full transition-colors duration-200 shadow"
                            type="submit"
                        >
                            Tìm kiếm
                        </button>
                    </form>
                </div>
                <nav className="flex items-center gap-6">
                    <a
                        href="/"
                        className="relative font-bold text-lg px-5 py-2 rounded-full bg-gradient-to-r from-red-700 via-black to-gray-900 shadow-md hover:scale-105 hover:bg-gradient-to-r hover:from-red-800 hover:to-black transition-all duration-200 border border-red-600"
                    >
                        <span className="text-white drop-shadow-lg tracking-wide">Trang chủ</span>
                        <span className="absolute left-2 top-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    </a>
                    {/* Thêm các link khác nếu cần */}
                </nav>
            </header>
            <main className="bg-gradient-to-b from-black via-gray-900 to-red-900 min-h-screen pt-6">
                <Outlet />
            </main>
        </>
    );
}

export default DefaultUserLayout;