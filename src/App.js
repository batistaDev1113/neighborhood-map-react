import React, {Component} from 'react';
import './App.css';
import locations from './locations/locations.json';
import MapDisplay from './components/Maps';
import ListDrawer from './components/MapsList';

class App extends Component {
  state = {
    lat: 28.385978,
    lon: -81.543831,
    zoom: 12,
    all: locations,
    filtered: null,
    open: false
  }

  styles = {
    menuButton: {
      marginLeft: 10,
      marginRight: 20,
      position: "absolute",
      left: 10,
      top: 20,
      width: "50px",
      background: "white",
      padding: 10
    },
    hide: {
      display: 'none'
    },
    header: {
      marginTop: "0px"
    }
  };

  componentDidMount = () => {
    this.setState({
      ...this.state,
      filtered: this.filterLocations(this.state.all, "")
    });
  }

  toggleList = () => {
    this.setState({
      open: !this.state.open
    });
  }

  updateQuery = (input) => {
    this.setState({
      ...this.state,
      selectedIndex: null,
      filtered: this.filterLocations(this.state.all, input)
    });
  }

  filterLocations = (locations, inputSearch) => {
    // Filter locations to match input
    return locations.filter(location => location.name.toLowerCase().includes(inputSearch.toLowerCase()));
  }

  clickListItem = (index) => {
    // Set the state to reflect the selected location 
    this.setState({ selectedIndex: index, open: !this.state.open })
  }

  render = () => {
    return (
      <div className="App">
        <div>
          <button onClick={this.toggleList} style={this.styles.menuButton}>
            <i className="fa fa-bars"></i>
          </button>
          <h1>Walt Disney World Resorts - Orlando, FL</h1>
        </div>
        <MapDisplay
          lat={this.state.lat}
          lon={this.state.lon}
          zoom={this.state.zoom}
          locations={this.state.filtered}
          selectedIndex={this.state.selectedIndex}
          clickListItem={this.clickListItem}/>
        <ListDrawer
          locations={this.state.filtered}
          open={this.state.open}
          toggleDrawer={this.toggleList}
          filterLocations={this.updateQuery}
          clickListItem={this.clickListItem}/>
      </div>
    );
  }
}

export default App;