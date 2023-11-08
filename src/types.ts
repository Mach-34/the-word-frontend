export type SelectedWord = {
    action: 'shout' | 'whisper';
    round: number;
};

export type Word = {
    active: boolean;
    hint: string;
    prize: number;
    round: number;
    shouter: string | undefined;
    whisperers: Array<string>;
}