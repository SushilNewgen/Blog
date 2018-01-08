import AssetRedeem from './AssetRedeem';

export const AssetRedeemReducer = (state = {
    address:'',
    assets:[],
    data: null,
    error: null,
    message: ''
}, action) => {
    switch (action.type) {
        case "ISSUE_ASSET_SUCCESS":
            state = {
                ...state,
                data: action.payload,
                error: null,
                message: 'successful in Fetching from ISSUE_ASSET API'
            }
            //IssueAsset.createDialog(state.data);
            break;
        case "ISSUE_ASSET_FAILURE":
            state = {
                ...state,
                data: null,
                error: action.payload,
                message: 'Failed in Fetching from ISSUE_ASSET API'
            }
            //IssueAsset.createDialog(state.data);
            break;
        case "ADDRESS_SUCCESS":
            state = {
                ...state,
                address:action.payload,
                error: null,
                message: 'successful in Fetching from getADDRESS API'
            }
            break;
        case "ADDRESS_FAILURE":
            state = {
                ...state,
                address:null,                
                error: action.payload,
                message: 'Failed in Fetching from getADDRESS API'
            }
            break;
        case "ASSETS_SUCCESS":
            state = {
                ...state,
                assets:action.payload,
                error: null,
                message: 'successful in Fetching from getADDRESS API'
            }
            break;
        case "ASSETS_FAILURE":
            state = {
                ...state,                
                error: action.payload,
                message: 'Failed in Fetching from getADDRESS API'
            }
            break;
        default:
            return state;
    }
    return state;
}