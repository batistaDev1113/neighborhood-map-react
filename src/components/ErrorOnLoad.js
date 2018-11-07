import React, {Component} from 'react';

class ErrorOnLoad extends Component {
    state = {
        show: false,
        timeout: null
    }

    componentDidMount = () => {
        let timeout = window.setTimeout(this.showMessage, 1000);
        this.setState({timeout});
    }

    componentWillUnmount = () => {
        window.clearTimeout(this.state.timeout);
    }

    showMessage = () => {
        this.setState({show: true});
    }

    render = () => {
        return (
           <div>
                {this.state.show
                    ? (
                        <div>
                            <h1>Unfortunately we encountered an error when loading the map</h1>
                            <p>Try again later</p>
                        </div>
                    )
                    : (<div><h1>Loading....</h1></div>)
            } </div>
        )
    }
}
export default ErrorOnLoad;