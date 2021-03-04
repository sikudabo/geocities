const initialState = {
    theme: 'light',
};

export default function themeReducer(state = initialState, action) {
    //This reducer will alternate between light and dark themes in MUI based on the payload value 
    switch(action.type) {
        case 'theme/dark':
            return {
                ...state,
                theme: 'dark', //Change the theme to a value if the action type is theme/dark.
            }
        case 'theme/light':
            return {
                ...state,
                theme: 'light', //Change the theme to light if the action is theme/light
            }
        default:
            return state;
    }
}