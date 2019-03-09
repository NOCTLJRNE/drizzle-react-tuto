import React from 'react';

class SetString extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.input = React.createRef(); // create ref for uncontrolled component
	}
	state = { stackId: null };
	handleKeyDown = (e) => {
		// if the enter key is pressed, set the value with the string
		if (e.keyCode === 13) {
			this.setValue(e.target.value);
		}
	};
	handleSubmit(event) {
		event.preventDefault();
		this.setValue(this.input.current.value);
	}
	setValue = (value) => {
		const { drizzle, drizzleState } = this.props;
		const contract = drizzle.contracts.MyStringStore;

		// let drizzle know we want to call the `set` method with `value`
		const stackId = contract.methods['set'].cacheSend(value, {
			from: drizzleState.accounts[0]
		});

		// save the `stackId` for later reference
		this.setState({ stackId });
	};

	getTxStatus = () => {
		// get the transaction states from the drizzle state
		const { transactions, transactionStack } = this.props.drizzleState;

		// get the transaction hash using our saved `stackId`
		const txHash = transactionStack[this.state.stackId];

		// if transaction hash does not exist, don't display anything
		if (!txHash) return null;

		// otherwise, return the transaction status
		return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;
	};

	render() {
		return (
			<div>
				<input type="text" onKeyDown={this.handleKeyDown} />
				<div>{this.getTxStatus()}</div>
				<form onSubmit={this.handleSubmit}>
					<label>
						Enter Your String
						<input defaultValue="Type something here (-:" type="text" ref={this.input} />
					</label>
					<input type="submit" value="Submit" />
				</form>
			</div>
		);
	}
}

export default SetString;
