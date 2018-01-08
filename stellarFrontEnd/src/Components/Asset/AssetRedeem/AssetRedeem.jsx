import React, { Component } from 'react';
import { Col,Table, OverlayTrigger,Tooltip ,FormControl, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Simplert from 'react-simplert';
import BackendServices from '../../../Services/BackendServices';

import { assetRedeem,getAddress,getAssets } from './AssetRedeem.action';
import '../../App/App.css';


class AssetRedeem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assetCode: 'BTC',
            memo: '',
            receiverAddress:'',
            amount: '',            
            result: {
                payment:{
                    hash:'',
                    ledger:'',
                    result_xdr:''
                }
                },
            address:'',
            assets:[],
            showAlert: false

        }
        //IssueAsset.createDialog = IssueAsset.createDialog.bind(this);
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    closeSimplert() {
        this.setState({
            showAlert: false
        });
    }

    onSubmit(e) {
        e.preventDefault();
        var that = this;
        console.log(this.state);
        //this.props.assetRedeem(this.state.address,this.state.assetCode,this.state.memo,this.state.amount,this.state.receiverAddress);
        BackendServices.AssetRedeem(this.state.address,this.state.assetCode,this.state.memo,this.state.amount,this.state.receiverAddress).then((res)=>{
            console.log(res);
            this.setState({
                    result:res.message
                })
            that.creatAlert("success", " Asset has been successfully redeemed");    
        },(error)=>{
            that.creatAlert("error", " Asset has been failed to redeemed");    
            })
    }

    static createDialog(data) {
        var that = this;
        if(data) {
            that.creatAlert("success", " Asset has been successfully issued to your address. ");      
        } else {
            that.creatAlert("failure", " Asset code doesn't exist. ");
        }
    }
    
    componentWillMount() {        
        this.props.getAddress();
        this.props.getAssets();
    }

    creatAlert(alertType, alertTitle) {
        this.setState({
            showAlert: true,
            alertType,
            alertTitle
        })
    }
    

    componentWillReceiveProps(nextProps) {
       
        this.setState({
            assets:nextProps.object.AssetRedeem.assets,
            address: nextProps.object.IssueAsset.address,
        })

        console.log('nextProps : ', nextProps);
    }
    reset(){

        this.setState({            
            amount:'',
            memo:''
            })
    }

    render() {
        const tooltip = (
            <Tooltip id="tooltip">
                <strong>Hash :</strong>     {this.state.result.payment.hash}
                <strong>Ledger</strong>     {this.state.result.payment.ledger}
                <strong>Result_xdr:</strong>{this.state.result.payment.result_xdr}
            </Tooltip>
        );
        return (           
            
                <div className="custom-spacing">
                <Simplert
                        showSimplert={this.state.showAlert}
                        type={this.state.alertType}
                        title={this.state.alertTitle}
                        disableOverlayClick={true}
                        onClose={this.closeSimplert.bind(this)}
                        onConfirm={this.resend}
                />
                <Form className="custom-form" horizontal onSubmit={this.onSubmit.bind(this)}>
                    <h1>
                        Redeem Asset
                    </h1>
                    <FormGroup controlId="formHorizontalPassword">
                        <Col smOffset={2} componentClass={ControlLabel} sm={2}>
                            Address
                        </Col>
                        <Col sm={4}>
                            <FormControl
                                type="text"
                                value={this.state.address}
                                disabled
                                />
                        </Col>
                    </FormGroup>                    
            <FormGroup controlId="formHorizontalEmail">
                        <Col smOffset={2} componentClass={ControlLabel} sm={2}>
                            Asset Code
                        </Col>
                        <Col sm={4}>
                            <FormControl
                                disabled
                                type="text"
                                placeholder="Asset Code"
                                name="assetCode"
                                value={this.state.assetCode||''}
                                onChange={this.onChange.bind(this)} />
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="formHorizonexport default connect(mapStateToProps, {getAddress, assetRedeem})(AssetRedeem);
    talEmail">
                        <Col smOffset={2} componentClass={ControlLabel} sm={2}>
                            Memo
                        </Col>
                        <Col sm={4}>
                            <FormControl
                                type="text"
                                placeholder="Memo"
                                name="memo"
                                value={this.state.memo||''}
                                onChange={this.onChange.bind(this)} />
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="formHorizontalPassword">
                        <Col smOffset={2} componentClass={ControlLabel} sm={2}>
                            BTCAddress
                        </Col>
                        <Col sm={4}>
                            <FormControl
                                type="text"
                                placeholder="BTC ADDRESS"
                                name="receiverAddress"
                                onChange={this.onChange.bind(this)}
                                value={this.state.receiverAddress||""}/>
                        </Col>
                    </FormGroup> 
                    <FormGroup controlId="formHorizontalPassword">
                        <Col smOffset={2} componentClass={ControlLabel} sm={2}>
                            Amount
                        </Col>
                        <Col sm={4}>
                            <FormControl
                                type="text"
                                placeholder="Amount"
                                name="amount"
                                value={this.state.amount||''}
                                onChange={this.onChange.bind(this)} />
                        </Col>
                    </FormGroup>                
                    <FormGroup>
                        <Col smOffset={4} sm={1}>
                            <Button type="submit" className="btn btn-primary">
                                Redeem Asset
                            </Button>                        
                        </Col>
                        <Col sm={1}>
                            <Button onClick={this.reset.bind(this)} type="button">
                                Reset
                            </Button>                 
                        </Col>                    
                    </FormGroup>
                    <FormGroup>
                        <Col sm={1}>
                           
                        </Col>
                    </FormGroup>              
                </Form>
                <Table responsive>          
                    <thead>
                      <tr>
                        <th>Address</th>            
                        <th>Amount</th>
                        <th>Asset Code</th>
                        <th>Memo</th>
                        <th>Payment</th>
                        <th>Payment BTC</th>
                        <th>Receiver Address</th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr>      
                            <td>{this.state.result.address}</td>
                            <td>{this.state.result.amount}</td>
                            <td>{this.state.result.assetCode}</td>
                            <td>{this.state.result.memo}</td>
                            <td>
                                <OverlayTrigger placement="right" overlay={tooltip}>
                                    <a href="#">{this.state.result.payment.hash}</a>
                                </OverlayTrigger>
                            </td>
                            <td>
                                <a target="_blank" href={"https://www.blocktrail.com/tBTC/tx/"+this.state.result.paymentBTC}>{this.state.result.paymentBTC}</a>
                            </td>
                            <td>{this.state.result.receiverAddress}</td>      
                        </tr>
                    </tbody>
              </Table>

                </div>  
        );
    }
}

function mapStateToProps(state) {
    return {
        object: state
    }

}


// export default AssetCreation;
export default connect(mapStateToProps, {getAddress, assetRedeem,getAssets})(AssetRedeem);
