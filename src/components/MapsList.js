import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';

class MapsList extends Component {
    state = {
        open: false,
        input: ""
    }

    styles = {
        list: {
            width: "350px",
            height: "auto",
            padding: "0px 15px 0px",
            backgroundColor: "#bdc3c7"
        },
        noListStyle: {
            listStyleType: "none",
            padding: 0
        },
        fullList: {
            width: 'auto',
            height: "auto"
        },
        listItem: {
            marginBottom: "15px",
            border: "2px solid #141e30",
            color: "#fff",
            padding: "10px"
        },
        listLink: {
            background: "transparent",
            border: "none",
            color: "black",
            fontSize: "1rem"
        },
        filterEntry: {
            border: "1px solid gray",
            boxShadow: "4px 4px 2px black",
            padding: "10px",
            margin: "30px 0px 10px",
            width: "325px",
            fontSize: "1.2rem"
        }
    };

    updateSearch = (newInput) => {
        this.setState({ input: newInput });
        this.props.filterLocations(newInput);
    }

    render = () => {
        return (
            <div>
                <Drawer open={this.props.open} onClose={this.props.toggleDrawer}>
                    <div style={this.styles.list}>
                        <input
                            style={this.styles.filterEntry}
                            type="text"
                            placeholder="Enter location desired"
                            name="filter"
                            onChange={e => this
                                .updateSearch(e.target.value)}
                            value={this.state.query} />
                        <ul style={this.styles.noListStyle}>
                            {this.props.locations && this
                                .props
                                .locations
                                .map((location, index) => {
                                    return (
                                        <li style={this.styles.listItem} key={index}>
                                            <button style={this.styles.listLink} key={index} onClick={e => this.props.clickListItem(index)}>{location.name}</button>
                                        </li>
                                    )
                                })}
                        </ul>
                    </div>
                </Drawer>
            </div>
        )
    }
}

export default MapsList;