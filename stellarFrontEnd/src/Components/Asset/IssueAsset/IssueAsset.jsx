import React, { Component } from 'react';
import { Col, FormControl, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Simplert from 'react-simplert';
import BackendServices from '../../../Services/BackendServices';

import { issueAsset,getAddress,getAssets } from './IssueAsset.action';
import '../../App/App.css';

class IssueAsset extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assetCode: 'BTC',
            assetLimit: '',
            amount: '',            
            result: {},
            address:'',
            assets:[],
            showAlert: false,
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
        }, function () {
            this.props.history.push('/issueAsset');
        });
    }

    onSubmit(e) {
        e.preventDefault();
        console.log(this.state);
        var that = this;
        BackendServices.IssueAsset(this.state.address,this.state.assetCode,this.state.assetLimit).then((res)=>{
            console.log(res);
                that.creatAlert("success", " Asset has been successfully issued to your address. ");
            },(error)=>{
                that.creatAlert("error", " Asset code doesn't exist.");
                });

        //this.props.issueAsset(this.state.address,this.state.assetCode,this.state.assetLimit);        



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
        this.props.getAddress()
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
            assets:nextProps.object.IssueAsset.assets,
            address: nextProps.object.IssueAsset.address,
        })       
    }

    reset(){
        this.setState({                
                assetLimit:''
            })
        
    }

    render() {
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
                    Issue Asset
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
                            type="text"
                            disabled
                            placeholder="Asset Code"
                            name="assetCode"
                            value={this.state.assetCode||''}
                            onChange={this.onChange.bind(this)} />
                    </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalLimit">
                    <Col smOffset={2} componentClass={ControlLabel} sm={2}>
                        Asset Limit
                    </Col>
                    <Col sm={4}>
                        <FormControl
                            type="number"
                            placeholder="Asset Limit"
                            name="assetLimit"
                            value={this.state.assetLimit||''}
                            onChange={this.onChange.bind(this)} />
                    </Col>
                </FormGroup>               
                <FormGroup>
                    <Col smOffset={4} sm={1}>
                        <Button type="submit" className="btn btn-primary">
                            Issue Asset
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
export default connect(mapStateToProps, {getAddress, issueAsset})(IssueAsset);
