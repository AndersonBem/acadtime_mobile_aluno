import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'acadtime_access_token';
const USER_KEY = 'acadtime_user';

export async function saveSession({ access, usuario }) {
    await SecureStore.setItemAsync(TOKEN_KEY, access);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(usuario));
}

export async function getSavedToken() {
    return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function getSavedUser() {
    const user = await SecureStore.getItemAsync(USER_KEY);
    return user ? JSON.parse(user) : null;
}

export async function clearSession() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
}