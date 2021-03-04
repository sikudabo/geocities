const initialState = {
    primary: 'rgb(0, 20, 60)',
};

export default function userThemeReducer(state = initialState, action) {
    switch(action.type) {
        case 'ThemeChange':
            return {
                ...state,
                primary: action.payload,
            };
        default:
            return state;
    }
}