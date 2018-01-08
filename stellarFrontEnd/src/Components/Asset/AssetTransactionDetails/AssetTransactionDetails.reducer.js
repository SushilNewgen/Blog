export const AssetTransactionDetailsReducer = (state = {
    // address:'',
    // assets:[],
    data: null,
    error: null,
    message: ''
}, action) => {
    switch (action.type) {
        case "GET_TRANSACTION_SUCCESS":
            state = {
                ...state,
                data: action.payload,
                error: null,
                message: 'successful in Fetching TRANSACTION Details'
            }
            //IssueAsset.createDialog(state.data);
            break;
        case "GET_TRANSACTION_FAILURE":
            state = {
                ...state,
                data: null,
                error: action.payload,
                message: 'Failed in Fetching TRANSACTION Details'
            }
            //IssueAsset.createDialog(state.data);
            break;        
        default:
            return state;
    }
    return state;
}