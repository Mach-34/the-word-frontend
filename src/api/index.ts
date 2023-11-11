
const { REACT_APP_API_URL } = process.env;

export type ShoutWhisperPayload = {
    round: number;
    secret: string;
    username: string;
}

export const checkForSession = async () => {
    const res = await fetch(`${REACT_APP_API_URL}/auth/restore-session`, { credentials: 'include' })
    return await res.json();
}

export const getWords = async () => {
    const res = await fetch(`${REACT_APP_API_URL}/rounds`);
    if (res.ok) {
        return await res.json();
    } else {
        return 'Error'
    }
}

export const login = async (pcd: string) => {
    const res = await fetch(`${REACT_APP_API_URL}/auth/login`, {
        body: pcd,
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        credentials: 'include'
    });
    return await res.json();
}

export const logout = async () => {
    const res = await fetch(`${REACT_APP_API_URL}/auth/logout`, { method: 'POST', credentials: 'include' })
    if (!res.ok) {
        throw Error('Could not log out')
    }
}

export const shout = async (payload: ShoutWhisperPayload) => {
    const res = await fetch(`${REACT_APP_API_URL}/shout`, {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        credentials: 'include'
    });
    if (!res.ok) {
        throw Error("Shout failed")
    }
}

export const whisper = async (payload: ShoutWhisperPayload) => {
    const res = await fetch(`${REACT_APP_API_URL}/whisper`, {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        credentials: 'include'
    });
    if (!res.ok) {
        throw Error("Whisper failed")
    }
}