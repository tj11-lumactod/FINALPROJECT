import React, { Component } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import httpClient from 'axios'
import {
    Button,ButtonGroup,
    Form,FormGroup,ControlLabel,
    FormControl,HelpBlock,
    Checkbox,Radio,Grid,Row,Col,
    Table,Modal
} from 'react-bootstrap';


class App extends Component {
    constructor(){
        super()
    }

    state = {
        name: "",
        death: "",
        movies: [],   
        gender: "",
	    suggestion:"",
        records:[],
        show: false,
        selectedName: "",     
	    selectedDeath: "",         
        selectedMovies: [],
        selectedGender: "",
        selectedsuggestion: "",
        selectedId: ""
    };

    componentDidMount(){

        this.refreshData();
    }

     refreshData=()=>{

         httpClient.get('http://localhost:3004/surveys')
             .then((response)=> {
                 var data =response.data;
                 this.setState({
                     records:data
                 })

             }).catch((error)=> {

             });

     };

    onChange = (fieldName)=> {
        return (event)=> {

            console.log(event.target.value);
            var state = this.state;
            state[fieldName] = event.target.value;
            this.setState(state);
        }
    };

    modalonChange = (fieldName)=> {
        return (event)=> {

            console.log(event.target.value);
            var state = this.state;
            state[fieldName] = event.target.value;
            this.setState(state);
        }
    };

    checkboxChange = (fieldName)=> {
        return (event)=> {
            var targetArray = this.state[fieldName];
            if (targetArray.indexOf(event.target.value) >= 0)
                targetArray.splice(
                    targetArray.indexOf(event.target.value),
                    1
                );
            else
                targetArray.push(event.target.value);

            var state = this.state;
            state[fieldName] = targetArray;
            this.setState(state);
        }
    };

    modalcheckboxChange = (fieldName)=> {
        return (event)=> {
            var targetArray = this.state[fieldName];
            if (targetArray.indexOf(event.target.value) >= 0)
                targetArray.splice(
                    targetArray.indexOf(event.target.value),
                    1
                );
            else
                targetArray.push(event.target.value);

            var state = this.state.selectedMovies;
            state[fieldName] = targetArray;
            this.setState(state.selectedMovies);
        }
    };


    saveSurvey = ()=> {

       
        var data = {name: this.state.name,
                    death: this.state.death,
                    gender: this.state.gender,
                    suggestion:this.state.suggestion,
                    movies: this.state.movies};
         console.log(data);
         delete data.records;

        httpClient.post('http://localhost:3004/surveys',
         data)
            .then((response)=> {
                this.refreshData();
            }).catch((error)=> {

            });

    };

    deleteItem = (id)=>{

        return ()=>{

            httpClient.delete('http://localhost:3004/surveys/'+ id )
                .then((response)=> {
                    console.log('delete');
                    this.refreshData();
                }).catch((error)=> {

                });

        };
    };
    
    editItem = (id) =>{
        return ()=> {
            
            httpClient.get('http://localhost:3004/surveys/'+id)
                .then((response)=> {
                    console.log('edit');
                    var data = response.data
                    console.log(response.data);
                    this.setState({
                        name: data.name,
                        death: data.death
                    })
                }).catch((error)=>{
                    
                });
        };
    };

    openModal = (id)=>{

            return ()=>{
                this.setState({
                    show: true
                })

                 httpClient.get('http://localhost:3004/surveys/'+id)
                .then((response)=> {
                    var data = response.data
                    this.setState({
                        selectedName: data.name,
                        selectedDeath: data.death,
                        selectedMovies: data.movies,
                        selectedGender: data.gender,
			selectedsuggestion: data.suggestion,
                        selectedId: data.id
                    })
                    console.log(this.state.selectedData.name);
                }).catch((error)=>{
                    
                });

            };
        };

    

    saveEdit = (id) =>{


        return () => {
            console.log(data);
            var data = {name: this.state.selectedName,
                        death: this.state.selectedDeath,
                        gender: this.state.selectedGender,
			            suggestion: this.state.selectedsuggestion,
                        movies: this.state.selectedMovies};
            delete data.records;

            httpClient.patch('http://localhost:3004/surveys/'+id,
            data)
                .then((response)=> {
                    this.refreshData();
                }).catch((error)=> {

                });

            this.setState({
                show: false,
                selectedDeath: "" ,
                selectedGender: "" ,
                selectedMovies: [] ,
		        selectedsuggestion: "",
                selectedName: ""
            });
        }
    };


    render() {

        var rows  = this.state.records.map((item,i)=>{






            return (
                <tr key={i}>
                     <td><Button  bsStyle="warning" onClick={this.deleteItem(item.id)}>Delete</Button></td>
                     <td><Button  bsStyle="warning" onClick={this.openModal(item.id)}>Edit</Button></td>
                     <td>{item.id}</td>
                     <td>{item.name}</td>
                     <td>{item.death}</td>
                     <td>{
                         item.movies.map((movie, mi)=> {
                             return <div key={mi}>
                                   <span className="label label-info">{movie}</span>
                                 </div>
                         })

                      }
                     </td>
                     <td>{item.gender}</td>
		     <td className="textfieldarea">{item.suggestion}</td>
                </tr>
            );
        });
        
        let close = () => this.setState({ show: false })



        return (
            <div className="container">
                <h1> {this.state.suway} </h1>
                <div className="page-header">
                 <center><h2>CUSTOMER CARE AREA</h2> </center>
                </div>
                <div className="jumbotron">
                    <Grid>
                        <Row>
                            <Col md={4}>
                                <Form>
                                    <FormGroup>
                                        <ControlLabel>Customer Name:</ControlLabel>
                                        <FormControl
                                            type="text"
                                            placeholder="Name of Customer"
                                            value={this.state.name}
                                            onChange={this.onChange('name')}
                                            />
                                        <HelpBlock>Use to find Customer name</HelpBlock>
                                    </FormGroup>


                                    {}
                                    <FormGroup>
                                        <ControlLabel>Type of Customer</ControlLabel>
                                        <FormControl componentClass="select"
                                                     placeholder="Type here..."
                                                     value={this.state.type}
                                                     onChange={this.onChange('type')}
                                            >
                                            <option value="student">Student</option>
                                            <option value="senior">Senior Citizen</option>
                                            <option value="regular">Regular</option>
                                        </FormControl>
                                        <HelpBlock>Uses to identify customer type</HelpBlock>
                                    </FormGroup>



                                     {}
                                    <FormGroup>
                                        <ControlLabel>Type of Needs</ControlLabel>
                                        <Checkbox value="SchoolSupplies"
                                                  checked={this.state.movies.indexOf('SchoolSupplies')>=0 ? true:false}
                                                  onChange={this.checkboxChange('movies')}>
                                          School Supplies
                                        </Checkbox>
                                        <Checkbox value="Groceries"
                                                  checked={this.state.movies.indexOf('Groceries')>=0 ? true:false}
                                                  onChange={this.checkboxChange('movies')}>
                                         Groceries
                                        </Checkbox>
                                        <Checkbox value="Others"
                                                  checked={this.state.movies.indexOf('Others')>=0 ? true:false}
                                                  onChange={this.checkboxChange('movies')}>
                                          Others
                                        </Checkbox>
                                    </FormGroup>
                                     {}
                                    <FormGroup>
                                        <ControlLabel>Gender </ControlLabel>
                                        <Radio name="gender" value="male"
                                               onChange={this.onChange('gender')}>Male</Radio>
                                        <Radio name="gender" value="female"
                                               onChange={this.onChange('gender')}>Female</Radio>
                                    </FormGroup>




{}


                                    <FormGroup>
                                        <ControlLabel>Customer Comment:</ControlLabel>
                                        <textarea
                                            type="textarea"
                                            placeholder="Tell us what you think..."
                                            value={this.state.suggestion}
                                            onChange={this.onChange('suggestion')}
                                            cols = "55"
                                            rows = "5"
                                            />
                                    </FormGroup>



{}








                                    <ButtonGroup>







                                        <Button bsStyle="primary" onClick={this.saveSurvey}>Save Info</Button>

                                    </ButtonGroup>
                                </Form>
                            </Col>
<div className="tj"></div>
{}

{}
{}
      <Col md={2}>
        
       <FormGroup></FormGroup>
       
      
      </Col>



                            <Col md={5}>
                            












                                <Table condensed striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th>Delete</th>
                                        <th>Edit</th>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Customer type</th>
                                        <th>Type of Needs</th>
                                        <th>Gender</th>
					 <th>Comment</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {rows}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Grid>

                </div>


                 <div className="modal-container" style={{height: 200}}>
                    <Modal
                    show={this.state.show}
                    onHide={close}
                    container={this}
                    aria-labelledby="contained-modal-title"
                    >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title"><div className="note"></div></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form>
                                                
                                                <FormGroup>
                                                    <ControlLabel>Customer name:</ControlLabel>
                                                    <FormControl
                                                        type="text"
                                                        placeholder="name of customer..."
                                                        value={this.state.selectedName}
                                                        onChange={this.modalonChange('selectedName')}
                                                        />
                                                    <HelpBlock>Use to find customer name</HelpBlock>
                                                </FormGroup>



                                                <FormGroup>
                                                    <ControlLabel>Type of customer</ControlLabel>
                                                    <FormControl componentClass="select"
                                                                placeholder="Type here..."
                                                                value={this.state.type}
                                                                onChange={this.modalonChange('type')}
                                                        >
                                                        <option value="student">Student</option>
                                                        <option value="senior">Senior Citizen</option>
                                                        <option value="regulart">Regular</option>
                                                    </FormControl>
                                                    <HelpBlock>Uses to identify customer type</HelpBlock>
                                                </FormGroup>




                                                <FormGroup>
                                                    <ControlLabel>Type of needs</ControlLabel>
                                                    <Checkbox value="School supplies"
                                                            checked={this.state.selectedMovies.indexOf('School supplies')>=0 ? true:false}
                                                            onChange={this.modalcheckboxChange('selectedMovies')}>
                                                       School supplies
                                                    </Checkbox>
                                                    <Checkbox value="Groceries"
                                                            checked={this.state.selectedMovies.indexOf('Groceries')>=0 ? true:false}
                                                            onChange={this.modalcheckboxChange('selectedMovies')}>
                                                    Groceries
                                                    </Checkbox>
                                                    <Checkbox value="Others"
                                                            checked={this.state.selectedMovies.indexOf('Others')>=0 ? true:false}
                                                            onChange={this.modalcheckboxChange('selectedMovies')}>
                                                     Others
                                                    </Checkbox>
                                                </FormGroup>
                                               
						
						 <FormGroup>
                                                    <ControlLabel>Gender </ControlLabel>
                                                    <Radio name="selectedGender" value="male" checked={this.state.selectedGender == "male" ? true : false}
                                                        onChange={this.modalonChange('selectedGender')}>Male</Radio>
                                                    <Radio name="selectedGender" value="female" checked={this.state.selectedGender == "female" ? true : false}
                                                        onChange={this.modalonChange('selectedGender')}>Female</Radio>
                                                </FormGroup>
                                               
					 


					<FormGroup>
                    
                                        <ControlLabel>Customer comment:</ControlLabel>
                                        <textarea
                                            type="textarea"
                                            placeholder="Tell us what you think..."
                                            value={this.state.selectedsuggestion}
                                            onChange={this.onChange('selectedsuggestion')}
                                            cols = "55"
                                            rows = "5"
                                            />
                                    	</FormGroup>

	




						 <ButtonGroup>

                                                    <Button bsStyle="primary" onClick={this.saveEdit(this.state.selectedId)}>Save Info</Button>

                                                </ButtonGroup>
                                            </Form>
                            </Modal.Body>
                        </Modal>
                        </div>
            </div>
        );
    }
}

export default App;