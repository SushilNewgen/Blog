import React, { Component } from 'react';
import { Col, FormControl, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import { createAsset,getAddress,getAssets } from './AssetCreation.action';
import '../../App/App.css';

class AssetCreation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assetCode: '',
            amount: '',            
            result: {},
            address:'',
            assets:[]
        }
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }



    onSubmit(e) {
        e.preventDefault();
        console.log(this.state);
        this.props.createAsset(this.state.address,this.state.assetCode,this.state.amount);        
    }

    
    componentWillMount() {        
        this.props.getAddress()
    }

    getAssets(){
        this.props.getAssets();
    }
    

    componentWillReceiveProps(nextProps) {       
        this.setState({
            assets:nextProps.object.AssetCreation.assets,
            address: nextProps.object.AssetCreation.address,
        })

        console.log('nextProps : ', nextProps);
    }

    render() {
        return (
            <Form className="custom-form" horizontal onSubmit={this.onSubmit.bind(this)}>
                <h1>
                    Create Asset
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
                            placeholder="Asset Code"
                            name="assetCode"
                            onChange={this.onChange.bind(this)} />
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
                            onChange={this.onChange.bind(this)} />
                    </Col>
                </FormGroup>                
                <FormGroup>
                    <Col smOffset={4} sm={1}>
                        <Button type="submit" className="btn btn-primary">
                            Create Asset
                        </Button>                        
                    </Col>
                    <Col sm={1}>
                        <Button type="button" onClick={this.getAssets.bind(this)}>
                            Get Assets
                        </Button>                 
                    </Col>                    
                </FormGroup>
                <FormGroup>
                    <Col sm={1}>
                       
                    </Col>
                </FormGroup>
                <table>
                {this.state.assets.map(res=>{
                    return(<tr key={res.assetCode}>
                        <td>{res.address}||</td>                        
                        <td>{res.assetCode}||</td>
                        <td>{res.amount}</td>
                    </tr>)
                })}
                    
                </table>                
            </Form>            
        );
    }
}

function mapStateToProps(state) {
    return {
        object: state
    }

}


// export default AssetCreation;
export default connect(mapStateToProps, { createAsset,getAddress,getAssets })(AssetCreation);
