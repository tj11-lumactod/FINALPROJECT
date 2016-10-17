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

                    
                </div>
                <div className="jumbotron">
                    <Grid>
                        <Row>
                            <Col md={5}>
                                <Form>
                                    <FormGroup>
                                        <ControlLabel>Name here ...</ControlLabel>
                                        <FormControl
                                            type="text"
                                            placeholder="Name to Die..."
                                            value={this.state.name}
                                            onChange={this.onChange('name')}
                                            />
                                        <HelpBlock>The human whose name is written in this note shall die </HelpBlock>
                                    </FormGroup>


                                    {/*-------------------------------------------------------------------------*/}
                                    <FormGroup>
                                        <ControlLabel>Cause Of Death</ControlLabel>
                                        <FormControl componentClass="select"
                                                     placeholder="death here..."
                                                     value={this.state.death}
                                                     onChange={this.onChange('death')}
                                            >
                                            <option value="suicide">suicide</option>
                                            <option value="murder">murder</option>
                                            <option value="accident">accident</option>
                                        </FormControl>
                                        <HelpBlock>If the cause of death is written within 40 seconds of writing the person's name it will happen </HelpBlock>
                                    </FormGroup>
                                     {/*-------------------------------------------------------------------------*/}
                                    <FormGroup>
                                        <ControlLabel>suspect</ControlLabel>
                                        <Checkbox value="Family"
                                                  checked={this.state.movies.indexOf('Family')>=0 ? true:false}
                                                  onChange={this.checkboxChange('movies')}>
                                            Family 
                                        </Checkbox>
                                        <Checkbox value="GF/BF"
                                                  checked={this.state.movies.indexOf('GF/BF')>=0 ? true:false}
                                                  onChange={this.checkboxChange('movies')}>
                                            GF/BF
                                        </Checkbox>
                                        <Checkbox value="Friend"
                                                  checked={this.state.movies.indexOf('Friend')>=0 ? true:false}
                                                  onChange={this.checkboxChange('movies')}>
                                            Friend
                                        </Checkbox>
                                    </FormGroup>
                                     {/*-------------------------------------------------------------------------*/}
                                    <FormGroup>
                                        <ControlLabel>Gender </ControlLabel>
                                        <Radio name="gender" value="male"
                                               onChange={this.onChange('gender')}>Male</Radio>
                                        <Radio name="gender" value="female"
                                               onChange={this.onChange('gender')}>Female</Radio>
                                    </FormGroup>











{/*------------------------------------------------------------------------------------------------------------------------------- */}


                                    <FormGroup>
                                        <ControlLabel>Details of the deaths should be written</ControlLabel>
                                        <textarea
                                            type="textarea"
                                            placeholder="Tell us what you think..."
                                            value={this.state.suggestion}
                                            onChange={this.onChange('suggestion')}
                                            cols = "55"
                                            rows = "5"
                                            />
                                    </FormGroup>



{/*------------------------------------------------------------------------------------------------------------------------------- */}








                                    <ButtonGroup>







                                        <Button bsStyle="primary" onClick={this.saveSurvey}>Time to Die</Button>

                                    </ButtonGroup>
                                </Form>
                            </Col>
<div className="lobot"></div>
{/*End of the col */}

{/*start of the col */}
{/*------------------------------------------------------------------------------------------------------------------------------- */}
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
                                        <th>Death type</th>
                                        <th>Suspect</th>
                                        <th>Gender</th>
					<th>Other Information</th>
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
                                                    <ControlLabel>Name please ...</ControlLabel>
                                                    <FormControl
                                                        type="text"
                                                        placeholder="Name to Die..."
                                                        value={this.state.selectedName}
                                                        onChange={this.modalonChange('selectedName')}
                                                        />
                                                    <HelpBlock>The human whose name is written in this note shall die </HelpBlock>
                                                </FormGroup>



                                                <FormGroup>
                                                    <ControlLabel>Cause Of Death</ControlLabel>
                                                    <FormControl componentClass="select"
                                                                placeholder="Death type..."
                                                                value={this.state.selectedDeath}
                                                                onChange={this.modalonChange('selectedDeath')}
                                                        >
                                                        <option value="suicide">suicide</option>
                                                        <option value="murder">murder</option>
                                                        <option value="accident">accident</option>
                                                    </FormControl>
                                                    <HelpBlock>If the cause of death is written within 40 seconds of writing the person's name it will happen</HelpBlock>
                                                </FormGroup>




                                                <FormGroup>
                                                    <ControlLabel>suspect </ControlLabel>
                                                    <Checkbox value="Family "
                                                            checked={this.state.selectedMovies.indexOf('Family ')>=0 ? true:false}
                                                            onChange={this.modalcheckboxChange('selectedMovies')}>
                                                        Family
                                                    </Checkbox>
                                                    <Checkbox value="GF/BF"
                                                            checked={this.state.selectedMovies.indexOf('GF/BF')>=0 ? true:false}
                                                            onChange={this.modalcheckboxChange('selectedMovies')}>
                                                       GF/BF
                                                    </Checkbox>
                                                    <Checkbox value="Friend"
                                                            checked={this.state.selectedMovies.indexOf('Friend')>=0 ? true:false}
                                                            onChange={this.modalcheckboxChange('selectedMovies')}>
                                                        Friend
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
                                        <ControlLabel>Details of the deaths should be written</ControlLabel>
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

                                                    <Button bsStyle="primary" onClick={this.saveEdit(this.state.selectedId)}>Time to Die</Button>

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