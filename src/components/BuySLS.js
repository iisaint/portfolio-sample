import React, { Component } from 'react';
import getWeb3 from '../utils/getWeb3';
import 'bulma/css/bulma.css';

const SLS_RATE = 1000;

class BuySLS extends Component {
    constructor(props) {
        super(props)
        this.state = {
            web3: null,
            portfolio: null,
            portfolioInstance: null,
            help: '',
            msg: ''
        }
    }

    componentWillMount() {
        getWeb3.then(results => {
            this.setState({
                web3: results.web3,
                portfolio: results.contract,
                portfolioInstance: results.instance
            })
        }).catch(() => {
          console.log('Error finding web3.')
        });
    }

    onFormSumit(e) {
        e.preventDefault();
        let inputs = this.refs.inputs.value;
        this.setState({msg: ''});

        this.state.web3.eth.getAccounts((error, accounts) => {
            let params = inputs.split(/[, ]+/);
            
            // 計算需要多少ether
            let pay_ether = parseInt(params[1], 10) / SLS_RATE;
            // 計算買多少SLS （需加上8個0)
            let sls_amount = parseInt(params[1], 10) * ( 10 ** 8);
            // 送出交易
            this.state.portfolioInstance.buySLS(params[0], sls_amount, {from: accounts[0], value: this.state.web3.toWei(pay_ether, 'ether')}).then((result) => {
                console.log(result);
                this.setState({msg: result.tx});
            }).catch((error) => {
                this.setState({msg: 'Something wrong...'});
            })
        });
    }

    render() {
        return (
            <section className="hero is-light" >
                <a name="try" />
                <div className="hero-body">
                <div className="container has-text-centered">
                <h1 className="title" > Buy SLS </h1>
                <form onSubmit={this.onFormSumit.bind(this)}>

                    <div className="field is-horizontal">
                    <div className="field-label is-normal">
                        <label className="label">Try it</label>
                    </div>
                    <div className="field-body">
                        <div className="field">
                        <p className="control is-expanded has-icons-left has-icons-right">
                            <input className="input" type="text" placeholder="ex: Portfolio1, 10" ref="inputs"/>
                        </p>
                        </div>
                        <div className="field">
                        <div className="control">
                            <button className="button is-primary">
                            Send
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                    <p className="help">{this.state.help}</p>
                </form>
                <h2 className="subtitle"><a target="_blank" href={'https://kovan.etherscan.io/tx/' + this.state.msg}>{this.state.msg}</a></h2>
                </div> 
                </div> 
            </section>
        );
    }
}

export default BuySLS