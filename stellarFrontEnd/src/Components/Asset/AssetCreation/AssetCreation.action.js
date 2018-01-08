import BackendServices from '../../../Services/BackendServices';


const CREATE_ASSET_SUCCESS = 'CREATE_ASSET_SUCCESS';
const CREATE_ASSET_FAILURE = 'CREATE_ASSET_FAILURE';
const ADDRESS_SUCCESS = 'ADDRESS_SUCCESS';
const ADDRESS_FAILURE = 'ADDRESS_FAILURE';
const ASSETS_SUCCESS = 'ASSETS_SUCCESS';
const ASSETS_FAILURE = 'ASSETS_FAILURE';



export const createAsset = function(address,assetCode,amount){
    return (dispatch) => {
        BackendServices.CreateAsset(address,assetCode,amount).then((res)=>{
            dispatch({
                type:CREATE_ASSET_SUCCESS,
                payload:res.result
            })
        },(error)=>{
            dispatch({
                type:CREATE_ASSET_FAILURE,
                payload:error
            })
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


