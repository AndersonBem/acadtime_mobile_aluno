const API_BASE_URL = 'https://acad-time.onrender.com'

let accessToken = null;

export function setAccessToken(token) {
    accessToken = token;
}

export function getAccessToken(){
    return accessToken;
}

export async function apiRequest(path, options = {}) {
    const isFormData = options.body instanceof FormData;

    const headers = {
        Accept: "application/json",
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        throw data || { detail: 'Erro na requisição.'};
    }

    return data
}
