import { useState } from "react";

export default function Login() {
  const [login, setLogin] = useState(""); // Holds email, username, or phone
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });

    if (response.ok) {
      const { accessToken, refreshToken } = await response.json();

      document.cookie = `token=${accessToken}; path=/;`;
      localStorage.setItem("refreshToken", refreshToken);

      const decoded = JSON.parse(atob(accessToken.split(".")[1]));
      if (decoded.role === "CUSTOMER") window.location.href = "/";
      else if (decoded.role === "SERVICE_PROVIDER") window.location.href = "/";
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl transition-all dark:bg-gray-900 dark:text-white">
        <h1 className="mb-6 text-center text-3xl font-bold tracking-wide text-gray-800 dark:text-white">
          Welcome Back
        </h1>
        <p className="mb-6 text-center text-gray-500 dark:text-gray-400">
          Sign in to continue
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Email, Username, or Phone"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 shadow-sm transition-all focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-gray-600"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 shadow-sm transition-all focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-gray-600"
          />

          <button
            onClick={handleLogin}
            className="w-full rounded-lg bg-gray-800 px-5 py-3 text-white transition-all hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Sign In
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <a href="#" className="text-gray-800 hover:underline dark:text-gray-300">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
