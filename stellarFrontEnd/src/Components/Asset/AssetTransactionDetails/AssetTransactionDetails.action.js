import BackendServices from '../../../Services/BackendServices';

const GET_TRANSACTION_SUCCESS = 'GET_TRANSACTION_SUCCESS';
const GET_TRANSACTION_FAILURE = 'GET_TRANSACTION_FAILURE';


export const assetTransactionDetails = function(){
    return (dispatch) => {
        BackendServices.assetTransactionDetails().then((res)=>{
            dispatch({
                type:GET_TRANSACTION_SUCCESS,
                payload:res.message
            })
        },(error)=>{
            dispatch({
                type:GET_TRANSACTION_FAILURE,
                payload:error.error
            })
        })
    }
}