import React from 'react';
import { Observable, Subject, Subscription } from 'rxjs';
interface Props {
    source: (str: string) => Promise<string[]>;
}
interface State {
    inputValue: string;
    isLoading: boolean;
    searchResults: string[];
    warningShow: boolean;
}
export declare class AutoComplete extends React.Component<Props, State> {
    payload$: Subject<string>;
    subscription: Subscription;
    constructor(props: Props, state: State);
    setSearchStr: (str: string) => void;
    setLoading: (isLoading: boolean) => void;
    toggleWarning: (isShown?: boolean) => void;
    searchQuery: (str: string) => Observable<string[]>;
    setSearchResults: (options: string[]) => void;
    getAutoSearch: () => Observable<string[]>;
    handleInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    render(): JSX.Element;
}
export {};
