import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  
  const [identifier, setIdentifier] = useState('email'); // To toggle between email and phone

  const handleSignUp = async () => {
    const userData = {
      email,
      phoneNumber,
      password,
      name,
      role,
      
    };

    // Only send either email or phoneNumber based on the identifier
    if (identifier === 'phone') {
      delete userData.email; // Remove email if using phone number
    } else {
      delete userData.phoneNumber; // Remove phone number if using email
    }

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (response.ok) {
      alert('User created successfully');
      router.push('/auth/login'); // Redirect to login after successful sign up
    } else {
      alert(data.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-teal-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h1 className="text-3xl font-semibold text-center text-gray-800">Sign Up</h1>

        <div className="space-y-4">
          {/* Toggle between Email and Phone */}
          <div className="flex items-center space-x-4 mb-4">
            <button
              className={`py-2 px-4 rounded-lg ${identifier === 'email' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setIdentifier('email')}
            >
              Email
            </button>
            <button
              className={`py-2 px-4 rounded-lg ${identifier === 'phone' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setIdentifier('phone')}
            >
              Phone Number
            </button>
          </div>

          {/* Conditionally render based on selected identifier */}
          {identifier === 'email' ? (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
            />
          ) : (
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
          />

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="SERVICE_PROVIDER">Service Provider</option>
          </select>


        </div>

        <button
          onClick={handleSignUp}
          className="w-full py-3 rounded-lg bg-teal-600 text-white text-lg font-semibold hover:bg-teal-700 focus:outline-none transition-all duration-300"
        >
          Sign Up
        </button>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/auth/login" className="text-teal-600 font-medium hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
