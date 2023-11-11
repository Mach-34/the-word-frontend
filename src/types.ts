export type SelectedWord = {
    action: 'shout' | 'whisper';
    round: number;
};

export type UserSession = {
    email: string;
    semaphoreId: string;
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