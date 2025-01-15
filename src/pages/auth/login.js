import { useState } from 'react';

export default function Login() {
  const [login, setLogin] = useState('');  // This will hold email, username, or phone number
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });

    if (response.ok) {
      const { accessToken, refreshToken } = await response.json();

      // Store tokens
      document.cookie = `token=${accessToken}; path=/;`;
      localStorage.setItem('refreshToken', refreshToken);

      // Decode accessToken to determine role
      const decoded = JSON.parse(atob(accessToken.split('.')[1]));

      // Redirect based on role
      if (decoded.role === 'CUSTOMER') window.location.href = '/';
      else if (decoded.role === 'SERVICE_PROVIDER') window.location.href = '/';
    } else {
      alert('Login failed');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Email, Username, or Phone Number"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
