import user, { init as init1 } from './reducers/user';
import userSaga                from './sagas/user';

const initialState = {
    ...init1,
};

export default function reducer (state = initialState, action = {}) {
    let intermediateState = user(state, action);
        // intermediateState = anotherReducer(intermediateState, action);

    return intermediateState;
}

export const sagas = [userSaga()];
// export * from './actionTypes';
