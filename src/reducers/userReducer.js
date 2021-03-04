const initialState = {
    user: null,
};

export default function userReducer(state = initialState, action) {
    //This reducer will update the user value to the action.payload value for the updated user. 
    switch(action.type) {
        case 'user/updateUser': //user/updateUser will be the action.type to trigger an update to the user.
            return {
                ...state,
                user: action.payload, //Updated user.
            };
        default:
            return state; //Simply return the state if the payload is off. This will default to null
    }
}