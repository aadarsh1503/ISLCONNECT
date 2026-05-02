const BASE_URL = 'http://localhost:3000';

export const login = async (email, password) => {
    const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data;
};
