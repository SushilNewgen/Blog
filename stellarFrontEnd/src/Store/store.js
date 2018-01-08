import {createStore,applyMiddleware,combineReducers} from 'redux';
import {AssetCreationReducer} from '../Components/Asset/AssetCreation/AssetCreation.reducer'
import {IssueAssetReducer} from '../Components/Asset/IssueAsset/IssueAsset.reducer'
import {AssetTransactionDetailsReducer} from '../Components/Asset/AssetTransactionDetails/AssetTransactionDetails.reducer'
import {AssetRedeemReducer} from '../Components/Asset/AssetRedeem/AssetRedeem.reducer'
import thunk from 'redux-thunk';

export default createStore(combineReducers({
    AssetCreation: AssetCreationReducer,
    IssueAsset: IssueAssetReducer,
    AssetTransactionDetail: AssetTransactionDetailsReducer,
    AssetRedeem:AssetRedeemReducer
}),
    {},
    applyMiddleware(thunk));