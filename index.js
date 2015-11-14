(function () {
  'use strict';

  var React;
  var ReactDOM;
  if (typeof require !== 'undefined') {
    React = require('react');
    ReactDOM = require('react-dom');
  } else if (typeof window !== 'undefined') {
    React = window.React;
    ReactDOM = window.ReactDOM;
  }

  var BASE_STYLE = {
    bottom: 0,
    left: 0,
    position: 'fixed',
    right: 0,
    top: 0
  };

  var STYLE_BY_SIDE = {
    bottom: {top: null},
    left: {right: null},
    right: {left: null},
    top: {bottom: null}
  };

  var CLOSED_STYLE_BY_SIDE = {
    bottom: {transform: 'translateY(100%)'},
    left: {transform: 'translateX(-100%)'},
    right: {transform: 'translateX(100%)'},
    top: {transform: 'translateY(-100%)'}
  };

  function Pullout () {
    React.Component.apply(this, arguments);
    this.container = null;
    this.state = {
      gotFocus: false
    };
  }

  Pullout.prototype = Object.assign(Object.create(React.Component.prototype), {
    renderExternal: function () {
      var closedStyle;
      if (!this.props.open && !this.state.gotFocus) {
        closedStyle = CLOSED_STYLE_BY_SIDE[this.props.side];
      }

      var pullout = React.createElement('div', {
        className: 'pullout-content',
        style: Object.assign({}, BASE_STYLE, STYLE_BY_SIDE[this.props.side], closedStyle)
      }, this.props.children);

      if (this.container === null) {
        this.container = document.createElement('div');
        this.container.classList.add('pullout-container');
        document.body.appendChild(this.container);
      }

      ReactDOM.render(pullout, this.container);
    },

    unmountExternal: function () {
      ReactDOM.unmountComponentAtNode(this.container);
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    },

    componentDidMount: function () {
      this.renderExternal();
    },

    componentWillUnmount: function () {
      this.unmountExternal();
    },

    componentWillReceiveProps: function (nextProps) {
      if (nextProps.open !== this.props.open) {
        this.setState({
          gotFocus: false
        });
      }
    },

    render: function () {
      return React.createElement('noscript', {
        className: 'pullout-anchor'
      });
    },

    componentDidUpdate: function () {
      this.renderExternal();
    }
  });

  Pullout.defaultProps = {
    side: 'left',
    open: false
  };

  if (typeof module !== 'undefined') {
    module.exports = Pullout;
  } else if (typeof window !== 'undefined') {
    window.ReactPullout = Pullout;
  }
}());
