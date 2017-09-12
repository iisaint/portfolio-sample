import React, { Component } from 'react'
import getWeb3 from '../utils/getWeb3'
import 'bulma/css/bulma.css';

class UserInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            web3: undefined,
            portfolio: null,
            portfolioInstance: undefined,
            account: '',
            sls: 0,
            slt: 0,
            mounted: false
        }
    }

    componentWillMount() {
        getWeb3.then(results => {
            this.setState({
                web3: results.web3,
                portfolio: results.contract,
                account: results.account,
                portfolioInstance: results.instance
            })
        }).catch(() => {
            console.log('Error finding web3.')
        })

        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
        this.setState({
            mounted: false
        });
    }

    componentDidMount() {
        this.startPolling();
        this.setState({
            mounted: true
        });
    }

    startPolling() {
        let self = this;
        setTimeout(function () {
            if (!self.state.mounted) {
                return;
            }
            self.poll();
            self._timer = setInterval(self.poll.bind(self), 15000);
        }, 1000);
    }

    poll() {
        if (this.state.web3 !== undefined && this.state.portfolioInstance !== undefined) {
            this.state.web3.eth.getAccounts((error, accounts) => {
                this.setState({
                    account: accounts[0]
                });

                this.state.portfolioInstance.totalBalanceOfSLS.call(accounts[0]).then((result) => {
                    this.setState({
                        sls: (this.state.web3.toDecimal(result)) / (10 ** 8)
                    });

                    return this.state.portfolioInstance.totalBalanceOfSLT.call(accounts[0]);
                }).then((result) => {
                    this.setState({
                        slt: (this.state.web3.toDecimal(result)) / (10 ** 8)
                    });

                    // 持有組合的 Portfolio2之SLS
                    return this.state.portfolioInstance.balanceOfSLS.call('Portfolio2', accounts[0]);
                }).then((result) => {
                    console.log('Portfolio2 SLS ', (this.state.web3.toDecimal(result)) / (10 ** 8));

                    // 持有組合的 Portfolio2之SLS
                    return this.state.portfolioInstance.balanceOfSLT.call('Portfolio2', accounts[0]);
                }).then((result) => {
                    console.log('Portfolio2 SLT ', (this.state.web3.toDecimal(result)) / (10 ** 8));

                    // 最新組合資訊的 Portfolio2之SLS剩餘數量
                    return this.state.portfolioInstance.getRemainSLSAmount.call('Portfolio2');
                }).then((result) => {
                    console.log('remaining amount of Portfolio2', (this.state.web3.toDecimal(result)) / (10 ** 8));
                })
            })
        }
    }

    render() {
        return ( 
            <section className="hero is-info" name="info">
                <a name="info" />
                <div className="hero-body">
                <div className="container has-text-centered">
                <h1 className="title" > Your Infomation </h1>
                <h2>Account: {this.state.account}</h2>
                <h2>You have: {this.state.sls} SLS in total.</h2>
                <h2>You have: {this.state.slt} SLT in total.</h2>
                </div> 
                </div> 
            </section>
        );
    }
}

export default UserInfo