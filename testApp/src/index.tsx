import ReactDOM from 'react-dom';
import React from 'react';

import styled, { ThemeProvider, StyleSheet } from '../../';

const styleSheet = new StyleSheet({ server: true });

const Title = styled('div')({
  color: 'white',
});

const Box = styled('div')({
  backgroundColor: 'red',
  width: '100%',
  height: '100px',
}, props => ({
  opacity: props.theme.opacity,
}));

const Box2 = styled(Box)({
  backgroundColor: 'green',
  marginLeft: '5px',
  '& ~ &': {
    marginLeft: '10px',
  },
  marginTop: '5px',
  marginBottom: '5px',
  height: '90px',
  width: 'calc(12.5% - 10px)',
  display: 'inline-block',
  verticalAlign: 'middle',
});

const Box3 = styled(Box2)({
  backgroundColor: 'blue',
});

const ThemeProvider2 = ThemeProvider as any;

class Tester extends React.Component<{}, { opacity: number }> {
  constructor(props) {
    super(props);

    this.state = {
      opacity: 1,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', e => {
      console.log(e);
      if (e.code === 'KeyJ') {
        this.setState(prevState => ({
          opacity: Math.max(0, prevState.opacity - 0.1),
        }));
      }

      if (e.code === 'KeyK') {
        this.setState(prevState => ({
          opacity: Math.max(1, prevState.opacity + 0.1),
        }));
      }
    });
  }

  render() {
    console.log(this.state);
    return (
      <ThemeProvider2
        theme={ { opacity: this.state.opacity } }
        styleSheet={ styleSheet }
      >
        <div>
          { Array
            .from({ length: 100 })
            .map(() => (
              <div>
                <Box>
                  { Array
                    .from({ length: 8 })
                    .map(() => (
                      <Box2>
                          { Array
                            .from({ length: 4 })
                            .map(() => (
                              <Box3/>
                            )) }
                      </Box2>
                    ))}
                </Box>
              </div>
            )) }
        </div>
      </ThemeProvider2>
    );
  }
}

ReactDOM.render(
  <Tester/>,
  document.getElementById('container')
);

console.log(styleSheet.collectStyles());