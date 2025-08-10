import { Link } from "react-router-dom";
import { login } from "../../../Utils/api.admin.util";
import { setCookie } from "../../../Utils/cookie.util";

const Login = ()=>{

    const handleSubmit = (event) => {
        event.preventDefault(); 
        const username = event.target.username.value;
        const password = event.target.password.value;

        const CallLogin = async()=>{
           try {
             const data = await login(username, password);
                if (data && data.access && data.refresh) {
                    localStorage.setItem("token", data.access);
                    setCookie("refresh", data.refresh, 7);
                    window.location.href = "/admin/film";
                } else {
                    alert("Login failed. Please check your credentials.");
                }
           } catch (error) {
               console.error("Login error:", error);
           }
        }
        CallLogin();
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900">
            <div className="bg-black shadow-xl rounded-lg p-8 w-full max-w-md border border-red-900">
                <h1 className="text-2xl font-bold mb-6 text-center text-red-500 tracking-wide">Admin Login</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-gray-400 font-medium mb-2">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            className="w-full px-4 py-2 bg-gray-900 border border-red-700 rounded focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-100 placeholder-gray-500"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-400 font-medium mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className="w-full px-4 py-2 bg-gray-900 border border-red-700 rounded focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-100 placeholder-gray-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-black via-red-900 to-red-700 text-white py-2 rounded hover:from-red-900 hover:to-black transition duration-200 font-semibold shadow-lg"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}
export default Login;