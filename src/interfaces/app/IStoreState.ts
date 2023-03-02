import type {LoadingState} from "../../enums/LoadingState";

interface IStoreState<T> {
    data: T | null;
    error: string | null;
    loading: LoadingState;
    dateLoaded: Date | null
}

export type { IStoreState };