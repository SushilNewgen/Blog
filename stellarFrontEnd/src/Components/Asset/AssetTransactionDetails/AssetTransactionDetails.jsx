import React, { Component } from 'react';
import { Col, Form, FormGroup, ControlLabel, Button,Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import Simplert from 'react-simplert';

import { assetTransactionDetails } from './AssetTransactionDetails.action';
import '../../App/App.css';


class AssetTransactionDetails extends Component {

	constructor(props){
		super(props);
		this.state={
			data:[]
		}
	}

    componentWillReceiveProps(nextProps) {
       
    	this.setState({
    		data:nextProps.object.transactions
    		})
        //console.log(nextProps.object);
    }

    componentWillMount(){
    	this.props.assetTransactionDetails();
    }


	render() {	
		let rows = this.state.data.map(person => {
      		return <Row data={person} />
    	})
		return (			
			<Form >
			<br/><br/><br/><br/><br/><br/>
		<Table responsive>        	
        <thead>
          <tr>
            <th>Payment Id</th>            
            <th>Asset Code</th>
            <th>Memo</th>
            <th>Amount</th>
            <th>Payment Time</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>		
			</Form>			
			)
	}
}

const Row = (props) => {
  return (
    <tr>      
      <td>{props.data.payment_id}</td>
      <td>{props.data.asset_code}</td>
      <td>{props.data.memo}</td>
      <td>{props.data.amount}</td>
      <td>{props.data.payment_time}</td>      
    </tr>
  );
}

function mapStateToProps(state) {
    return {
        object: state.AssetTransactionDetail.data
    }

}

export default connect(mapStateToProps, {assetTransactionDetails})(AssetTransactionDetails);

