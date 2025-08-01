import { Outlet } from "react-router-dom";

const DefaultUserLayout = () => {
    return (
        <>
            <header className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white shadow-lg py-4 px-8 flex items-center justify-between">
                <div className="text-2xl font-bold tracking-wide">
                    <a href="/">MovieWeb</a>
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