const initialState = {
    posts: [],
}

export default function userPostsReducer(state = initialState, action) {
    switch(action.type) {
        case 'userPosts/updatePosts':
            return {
                ...state,
                posts: action.payload,
            };
        default:
            return state;
    }
}