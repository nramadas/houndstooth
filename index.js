import React from 'react';

/**
 * A simple data bus.
 */
const makeBus = function (initial) {
    const channels = {};
    let nextAvailableId = 0;
    let state = initial;
    return {
        peek: () => state,
        set: (s) => {
            state = s;
            for (const id in channels) {
                channels[id](state);
            }
        },
        listen: (listener) => {
            const id = nextAvailableId++;
            channels[id] = listener;
            return () => {
                delete channels[id];
            };
        },
    };
};

class ThemeProvider extends React.Component {
    constructor(props) {
        super(props);
        this.bus = makeBus(props.theme);
    }
    getChildContext() {
        return {
            houndstooth: this.bus,
        };
    }
    componentWillMount() {
        if (this.context.houndstooth) {
            this.bus.set(this.props.theme);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.context.houndstooth) {
            this.bus.set(nextProps.theme);
        }
    }
    render() {
        return this.props.children
            ? React.Children.only(this.props.children)
            : null;
    }
}

export { ThemeProvider };
