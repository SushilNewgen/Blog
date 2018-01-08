import BackendServices from '../../../Services/BackendServices';


const ISSUE_ASSET_SUCCESS = 'ISSUE_ASSET_SUCCESS';
const ISSUE_ASSET_FAILURE = 'ISSUE_ASSET_FAILURE';
const ADDRESS_SUCCESS = 'ADDRESS_SUCCESS';
const ADDRESS_FAILURE = 'ADDRESS_FAILURE';
const ASSETS_SUCCESS = 'ASSETS_SUCCESS';
const ASSETS_FAILURE = 'ASSETS_FAILURE';



export const assetRedeem = function(address,assetCode,memo,amount,receiverAddress){
    return (dispatch) => {
        BackendServices.AssetRedeem(address,assetCode,memo,amount,receiverAddress).then((res)=>{
            dispatch({
                type:ISSUE_ASSET_SUCCESS,
                payload:res.status
            });
        },(error)=>{
            dispatch({
                type:ISSUE_ASSET_FAILURE,
                payload:error
            });
        })
    }
}

export const getAddress = function(){
    return (dispatch) => {
        BackendServices.getAddress().then((res)=>{
            dispatch({
                type:ADDRESS_SUCCESS,
                payload:res.result.address
            })
        },(error)=>{
            dispatch({
                type:ADDRESS_FAILURE,
                payload:error
            })
        })
    }
}
export const getAssets = function(){
    return (dispatch) => {
        BackendServices.getAssets().then((res)=>{
            dispatch({
                type:ASSETS_SUCCESS,
                payload:res.result
            })
        },(error)=>{
            dispatch({
                type:ASSETS_FAILURE,
                payload:error
            })
        })
    }
}


