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
            <header className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white shadow-lg py-4 px-8 flex items-center justify-between">
                <div className="text-2xl font-bold tracking-wide">
                    <a href="/">MovieWeb</a>
                </div>
                <div className="Search-movie">
                    <form ref={inputRef} onSubmit={handleClick}>
                        <input name="inputSearch" placeholder="Nhập nội dung tìm kiếm" Search type="text" className="bg-white text-black" value={params.get("key")} />
                        <button>Search</button>
                    </form>
                </div>
                <nav className="space-x-6">
                    <a href="/" className="hover:text-yellow-400 transition">Home</a>
                </nav>

            </header>
            <Outlet />
        </>
    );
}

export default DefaultUserLayout;