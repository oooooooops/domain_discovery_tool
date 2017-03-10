import React, { Component } from 'react';
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

import Checkbox from 'material-ui/Checkbox';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { Row, Col} from 'react-bootstrap';
//import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import FlatButton from 'material-ui/FlatButton';
import Forward from 'material-ui/svg-icons/content/forward';
import AddBox from 'material-ui/svg-icons/content/add-box';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import {fullWhite} from 'material-ui/styles/colors';
import $ from 'jquery';

import AppBar from 'material-ui/AppBar';
import logoNYU from '../images/nyu_logo_purple.png';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

const styles = {
  listDomains:{
    borderStyle: 'solid',
    borderColor: '#C09ED7',
    background: 'white',
    borderRadius: '0px 0px 0px 0px',
    borderWidth: '0px 0px 1px 0px',
  },
};


class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      domains: undefined,
      openCreateDomain: false,
      openDeleteDomain: false,
      newNameDomain:"",
      delDomains: {}
    };
  }

  getAvailableDomains(){
    $.post(
      '/getAvailableDomains',
      {"type": "init"},
      function(domains) {
        this.setState({domains: domains['crawlers']});
      }.bind(this)
    );
  }
  componentWillMount() {
    //Get domains.
    this.getAvailableDomains();
  }

  handleOpenCreateDomain = () => {
    this.setState({openCreateDomain: true});
  };

  handleCloseCreateDomain = () => {
    this.setState({openCreateDomain: false});
  };

  handleOpenDeleteDomain = () => {
    this.setState({openDeleteDomain: true});
  };

  handleCloseDeleteDomain = () => {
    this.setState({openDeleteDomain: false});
  };

  //Handling changes into TextField newNameDomain (updating TextField).
  handleTextChangeNewNameDomain(e){
    this.setState({ "newNameDomain": e.target.value});
  }

  //Create a new domain
  createNewDomain(){
    //createNewDomain
    var nameDomain= this.state.newNameDomain;
    $.post(
      '/addCrawler',
      {'index_name': nameDomain},
      function(domains) {
        this.setState({openCreateDomain: false});
        this.getAvailableDomains();
        this.forceUpdate();
      }.bind(this)
    );
  };

  //Delete selected domains
  deleteDomains(){
    var delDomains= this.state.delDomains;
    $.post(
      '/delCrawler',
      {'domains': JSON.stringify(delDomains)},
      function(domains) {
        this.setState({openDeleteDomain: false, delDomains: {}});
        this.getAvailableDomains();
        this.forceUpdate();
      }.bind(this)
    );
  };

  // Get all the domains selected for deletion
  addDelDomains(id,name){
      this.state.delDomains[id] = name
  }

  render(){

    const actionsCreateDomain = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleCloseCreateDomain}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.createNewDomain.bind(this)}
      />,
    ];

    const actionsDeleteDomain = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleCloseDeleteDomain}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.deleteDomains.bind(this)}
      />,
    ];

    if(this.state.domains!==undefined){
      var mydata = this.state.domains;
      return (
        <div>
          <AppBar showMenuIconButton={true}
            style={{background: "#50137A"}}
            title={  <span style={{color: 'white'}}> Domain Discovery Tool </span>}
            //iconElementLeft={<IconButton><NavigationClose /></IconButton>}
            iconElementLeft={<img src={logoNYU}  height='45' width='40' />}
            //onLeftIconButtonTouchTap={this.removeRecord.bind(this)}
          >
          </AppBar>
          <div className="jumbotron col-sm-12 text-center">
            <div style={{ marginLeft:'25%'}}>
              <Row>
                <Col xs={6} md={6} style={styles.listDomains}>
                  <List>
                    <Subheader style={{color:'black'}}><h2>Domains</h2></Subheader>
                    {Object.keys(mydata).map((k, index)=>{
                      return <Link to={{ pathname: `/domain/{mydata[k].index}`, query: { nameDomain: mydata[k].name, idDomain: mydata[k].id} }}  text={"Machine Learning"}>
                      <ListItem key={index} style={{textAlign: 'left'}}
                      primaryText={mydata[k].name}
                      rightIcon={<Forward />} />
                      </Link>
                    })}
                  </List>
                </Col>
                <Col xs={3} md={3}>
                  <Link to='/'>
                    <FlatButton style={{margin:'70px 10px 10px 10px'}}
                    backgroundColor="#26C6DA"
                    hoverColor="#80DEEA"
                    onTouchTap={this.handleOpenCreateDomain.bind(this)}
                    icon={<AddBox color={fullWhite} />}
                    />
                    <FlatButton style={{margin:'70px 10px 10px 10px'}}
                    backgroundColor="#26C6DA"
                    hoverColor="#80DEEA"
	            onTouchTap={this.handleOpenDeleteDomain.bind(this)}
                    icon={<DeleteForever color={fullWhite} />}
                    />
                  </Link>
                  <Dialog
                     title="Adding a domain"
                     actions={actionsCreateDomain}
                     modal={false}
                     open={this.state.openCreateDomain}
                     onRequestClose={this.handleCloseCreateDomain.bind(this)}
                   >
                     <TextField style={{width:'268px', fontSize: 12, borderColor: 'gray', borderWidth: 1, background:"white", borderRadius:"1px"}}
                       value={this.state.newNameDomain}
                       onChange={this.handleTextChangeNewNameDomain.bind(this)}
                       hintText="Write the name domain."
                       hintStyle={{ marginLeft:10}}
                       inputStyle={{marginBottom:10, marginLeft:10, paddingRight:20}}
                     />
                   </Dialog>

                   <Dialog
                      title="Deleting a domain"
                      actions={actionsDeleteDomain}
                      modal={false}
                      open={this.state.openDeleteDomain}
                      onRequestClose={this.handleCloseDeleteDomain.bind(this)}
                   >
	           <div style={styles.block}>
	              {Object.keys(mydata).map((k, index)=>{
		      return <Checkbox
			   label={mydata[k].name}
			   value={mydata[k].id}
			   style={styles.checkbox}
		           onClick={this.addDelDomains.bind(this,mydata[k].id,mydata[k].index)}
			   />
		       })}
	            </div>
                    </Dialog>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      );
    }
    return(
      <div></div>
    );
  }
}

export default Home;
