import React, { Component, Fragment } from 'react';
import axios from "axios";
const config = require('../config.json');

export default class SelectedArrivals extends Component {

  state = {
    
      "StationName": "", 
      "id": "",
      newTrainId: "",
    
        arrivals: []
  }

 

  changeHandleDeleteArrival = (event) => {
    event.preventDefault();
    this.setState({id: event.target.value});
    const code =  event.target.options.selectedIndex;
    console.log(code)
    let crs =JSON.stringify(this.state.arrivals[code].Train_id);
   let cleanCrs = crs.replace(/"/g,'');
   let cleanerCrs = cleanCrs.replace(/\\/g,'');
    console.log(cleanerCrs)
    this.setState({newTrainId: cleanerCrs})
  }

  submitHandleDeleteArrival = (event) => {
    event.preventDefault();
    // add call to AWS API Gateway delete Stations endpoint here
   console.log("deleting arrival " + this.state.id)
   this.deleteArrival();
   this.fetchSelectedArrivals();
  }





  
  deleteArrival(){
    const axios = require('axios');
    let data = {Train_id: this.state.newTrainId};
    
    let config = {
      method: 'delete',
      url: 'https://vb08tuunv5.execute-api.eu-west-2.amazonaws.com/post2/arrivals/{Train-id}\n',
      headers: { 
        'X-Amz-Content-Sha256': 'beaead3198f7da1e70d03ab969765e0821b24fc913697e929e726aeaebf0eba3', 
        'X-Amz-Date': '20200729T135805Z', 
        'Authorization': 'AWS4-HMAC-SHA256 Credential=AKIA4QSRPFJEVPISHRZC/20200729/eu-west-2/execute-api/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=35c9d2c91201e12e37fffa01f4f3d6d89a5fcfcd9bcade6d707dc0a4be320b4f', 
        'Content-Type': 'text/plain'
      },
      data : data
    };
    
    axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
    
this.fetchSelectedArrivals();

    
  }    



  fetchSelectedArrivals = async () => {
    // add call to AWS API Gateway to fetch Stations here
    // then set them in state
    try {
      await axios.get(`${config.api.invokeUrl}/arrivals`)
      .then((response) => 
      this.setState({arrivals : response.data.Items}));
      
      console.log(this.state.arrivals);
    
     


    } catch (err) {
      console.log(`An error has occurred: ${err}`);
    }
  }

  
    
    
     
  

  onAddStationNameChange = event => this.setState({ newArrival: { ...this.state.newArrival, "StationName": event.target.value } });
  onAddStationsIdChange = event => this.setState({ newArrival: { ...this.state.newArrival, "id": event.target.value } });

  componentDidMount = async () =>{
  this.fetchSelectedArrivals();
}




  render() {
    return (
      <Fragment>
        <h1>Arrivals Currently Saved </h1>
        {this.state.arrivals.map(arrival => (
         <li key={arrival.train_id}>
         Expected time: {arrival.Expected_Arrival_Time}   From: {arrival.Starting_From}
         </li>))}<br/>
        <h2>You will be notified of an arrival 10 mins before its due.</h2>

        <form  onSubmit={this.submitHandleDeleteArrival}  onChange={this.changeHandleDeleteArrival}>
        <label>Select the arrival to delete: <br/>
        <select>  value={this.state.arrivals.map(station => (  
        <option  key={station.Starting_From} id={station.Train_id} >{station.Starting_From}         </option>
       
      )) }</select>  
      </label> 
      <input 
        type='submit' value='Delete arrival'

      />
      
      </form>


      </Fragment>
  )
      }
    }