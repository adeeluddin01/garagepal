export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    // Extract the access token from cookies
    const accessToken = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
  
    // Make the API call with the access token
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(accessToken,response.status,localStorage.getItem('refreshToken'))

    // If access token has expired, attempt to refresh it
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken'); // Retrieve refresh token from localStorage
      console.log(refreshToken,"401 REfresh from  fetchwithauth")
      // Call the refresh token endpoint
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
  
      if (refreshResponse.ok) {
        // Retrieve the new tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          await refreshResponse.json();
  
        // Update tokens
        document.cookie = `token=${newAccessToken}; path=/;`; // Update access token in cookies
        // localStorage.setItem('refreshToken', newRefreshToken); // Update refresh token in localStorage
        console.log({
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        },"from retry orignal req")
        // Retry the original request with the new access token
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
      } else {
        // If refreshing the token fails, redirect the user to the login page
        console.error('Session expired. Redirecting to login.');
        // window.location.href = '/login';
        return;
      }
    }
  
  // Return the response JSON
  let responseBody = await response.json();
  return { status: response.status, body: responseBody }; // Return both status and body

  };
  