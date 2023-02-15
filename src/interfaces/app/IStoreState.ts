import {LoadingState} from "../../enums/LoadingState";

interface IStoreState<T> {
    data: T | null;
    error: string | null;
    loading: LoadingState;
}

function createInitialState<T>(): IStoreState<T> {
    return {
        data: null,
        error: null,
        loading: LoadingState.Idle,
    };
}

export type { IStoreState };
export { createInitialState };