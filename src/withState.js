import React, { Component } from 'react';

function getDisplayName(wrappedComponent) {
  const wrapperName = wrappedComponent.displayName || wrappedComponent.name || 'Component';
  return `withState(${wrapperName})`;
}

export default function(initialState) {
  return (WrappedComponent) => {
    const componentWithState = (class extends Component {
      constructor(props) {
        super(props);

        this.state = { currentState: initialState };
        this.updateState = this.updateState.bind(this);
      }

      updateState(stateChanges) {
        this.setState({ currentState: this.state.currentState.copy(stateChanges) });
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            state={this.state.currentState}
            setState={this.updateState}
          />
        )
      }
    });

    componentWithState.displayName = getDisplayName(WrappedComponent);

    return componentWithState;
  }
}