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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login Page</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200 font-semibold"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}
export default Login;