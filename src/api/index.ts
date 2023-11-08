
const { REACT_APP_API_URL } = process.env;

export type ShoutWhisperPayload = {
    round: number;
    secret: string;
    username: string;
}

// export const createGame = async () => {
//     const res = await fetch(`${REACT_APP_API}/create`, { method: 'POST' });
//     const data = await res.json();
// }

export const getWords = async () => {
    const res = await fetch(`${REACT_APP_API_URL}/rounds`);
    if (res.ok) {
        return await res.json();
    } else {
        return 'Error'
    }
}

export const shout = async (payload: ShoutWhisperPayload) => {
    const res = await fetch(`${REACT_APP_API_URL}/shout`, {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        }
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
        }
    });
    if (!res.ok) {
        throw Error("Whisper failed")
    }
}