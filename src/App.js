import React, {Component} from 'react';
import ReactDOM from 'react-dom';


const withPortal = (domElement, time = null, ...rest) => {
    return (WrapperComponent) =>
        class PortalHOC extends Component {
            portal = document.getElementById(domElement);
            el = document.createElement('div')

            componentDidMount() {
                this.portal.appendChild(this.el)
                if (time) {
                    setTimeout(
                        () => this.portal.removeChild(this.el)
                        , time)
                }
            }

            componentWillUnmount() {
                this.portal.removeChild(this.el)
            }

            render() {
                return (
                    ReactDOM.createPortal(<WrapperComponent {...this.props}{...rest} />, this.el)
                )
            }
        }
}

const Portal = ({children}) => <>{children}</>
const MyPortal = withPortal('portal',3000)(Portal);

class App extends Component {
    state = {
        value: '',
        alertsList: [],
    }
    Ref = React.createRef();

    onChangeHandler = ({target: {value}}) => {
        this.setState({value});
    }

    onClickHandler = () => {
        const {value, alertsList} = this.state;
        this.setState({
            alertsList: [...alertsList, value],
            value: '',
        }, () => this.Ref.current.focus())


    }

    componentDidMount() {
        this.Ref.current.focus();
    }

    render() {
        const {value, alertsList} = this.state;
        return (
            <div className={`App`}>
                <input
                    ref={this.Ref}
                    type="text"
                    value={value}
                    onChange={this.onChangeHandler}
                />
                <button
                    type={`button`}
                    disabled={!value}
                    onClick={this.onClickHandler}
                >Add alert
                </button>
                {
                    alertsList && alertsList.map((e, i) => (
                        <MyPortal key={e + i}>
                            {e}
                        </MyPortal>
                    ))
                }

            </div>
        );
    }
}

App.propTypes = {};

export default App;
