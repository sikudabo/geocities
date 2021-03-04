const initialState = {
    posts: [],
};

export default function visitorPostsReducer(state = initialState, action) {
    switch(action.type) {
        case 'visitorPosts/updatePosts':
            return {
                ...state,
                posts: action.payload,
            };

        default:
            return state;
    }
}