export enum Action {
    Reissue = 'reissue',
    Shout = 'shout',
    Whisper = 'whisper',
}

export type SelectedWord = {
    action: Action;
    round: number;
};

export type VerifyModalPayload = {
    round: number;
    shouted?: boolean;
    username: string;
    verified?: boolean;
    verifying: boolean;
}

export type UserSession = {
    email: string;
    semaphoreId: string;
    username?: string;
}

export type Word = {
    active: boolean;
    hint: string;
    prize: number;
    round: number;
    shouter: string | undefined;
    userInteractions: {
        shouted: boolean;
        whispered: boolean;
    };
    whisperers: Array<string>;
}