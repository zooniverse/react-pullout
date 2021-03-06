(function () {
  'use strict';

  var isCommonJS = typeof require !== 'undefined' && typeof module !== 'undefined';
  var isBrowser = typeof window !== 'undefined';

  var React;
  var ReactDOM;
  if (isCommonJS) {
    React = require('react');
    ReactDOM = require('react-dom');
  } else if (isBrowser) {
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

  // Make old Safari happy.
  Object.keys(CLOSED_STYLE_BY_SIDE).forEach(function(side) {
    CLOSED_STYLE_BY_SIDE[side]['WebkitTransform'] = CLOSED_STYLE_BY_SIDE[side].transform;
  });

  function Pullout () {
    React.Component.apply(this, arguments);
    this.container = null;
  }

  Pullout.prototype = Object.assign(Object.create(React.Component.prototype), {
    renderExternal: function () {
      var closedStyle;
      if (!this.props.open) {
        closedStyle = CLOSED_STYLE_BY_SIDE[this.props.side];
      }

      var pullout = React.createElement('div', {
        className: ['pullout-content', this.props.className].filter(Boolean).join(' '),
        style: Object.assign({}, BASE_STYLE, STYLE_BY_SIDE[this.props.side], closedStyle, this.props.style)
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

    render: function () {
      return React.createElement('noscript', {
        className: ['pullout-anchor', this.props.className].filter(Boolean).join(' ')
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

  if (isCommonJS) {
    module.exports = Pullout;
  } else if (isBrowser) {
    window.ReactPullout = Pullout;
  }
}());
