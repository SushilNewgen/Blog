import {API_URL} from '../constants';
import $ from 'jquery'



class BackendServices{

    // CreateAsset(address,assetCode,amount){
    //     return  $.ajax({            
    //         //contentType: 'application/x-www-form-urlencoded',                           
    //         data: {
    //             address,
    //             assetCode,
    //             amount
    //         },
    //         dataType: 'json',
    //         processData: true,
    //         type: 'POST',
    //         url: API_URL+'createAsset'
    //     });
    // }
    IssueAsset(address,assetCode,assetLimit){
        return  $.ajax({            
            //contentType: 'application/x-www-form-urlencoded',                           
            data: {
                address,
                assetCode,                
                assetLimit
            },
            dataType: 'json',
            processData: true,
            type: 'POST',
            url: API_URL+'/v1/stellar/changeTrust'
        });
    }
    getAddress(){
        return  $.ajax({            
            contentType: 'application/x-www-form-urlencoded', 
            crossDomain: true,                                                                   
            processData: true,
            type: 'GET',
            url: API_URL+'/v1/bridge/getAddress'
        });
    }
    getAssets(){
        return  $.ajax({            
            contentType: 'application/x-www-form-urlencoded', 
            crossDomain: true,                                                                               
            type: 'GET',
            url: API_URL+'/v1/bridge/getAssets'
        });
    }

    AssetRedeem(address,assetCode,memo,amount,receiverAddress){
        return  $.ajax({            
            //contentType: 'application/x-www-form-urlencoded',                           
            data: {
                address,
                assetCode,
                memo,
                amount,
                receiverAddress
            },
            dataType: 'json',
            processData: true,
            type: 'POST',
            url: API_URL+'/v1/bridge/payment'
        });
    }

    assetTransactionDetails(){
        return  $.ajax({        
            contentType: 'application/x-www-form-urlencoded',     
            dataType: 'json',
            processData: true,
            type: 'GET',
            url: API_URL+'/v1/federation/getTransaction'
        });
    }

}

export default new BackendServices();