const initialState = {
    mode: 'light',
}

export default function userModeReducer(state = initialState, action) {
    switch(action.type) {
        case 'ModeChange':
            return {
                ...state,
                mode: action.payload,
            };
        default:
            return state;
    }
}