import { Groth16Proof } from "snarkjs";

const { REACT_APP_API_URL } = process.env;

export type ActionPayload = {
    proof?: Groth16Proof,
    round: number;
    secret?: string;
    username: string;
}

export const checkForSession = async () => {
    const res = await fetch(`${REACT_APP_API_URL}/auth/restore-session`, { credentials: 'include' })
    return await res.json();
}

export const getWords = async () => {
    const res = await fetch(`${REACT_APP_API_URL}/rounds`, { credentials: 'include' });
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

export const shout = async (payload: ActionPayload) => {
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

export const whisper = async (payload: ActionPayload) => {
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

export const verify = async (payload: ActionPayload) => {
    const res = await fetch(`${REACT_APP_API_URL}/verify`, {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        credentials: 'include'
    });
    if (!res.ok) {
        const text = await res.text();
        if (text.includes('not active')) {
            return { msg: 'Not active' }
        } else {
            throw Error("Verification failed")
        }
    }
    return await res.json()
}