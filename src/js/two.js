

function Threeprop(props) {
    return <p>This was passed: {props.name}</p>;
}

const element = (
    <div>
        <h4>THREE</h4>
        <Threeprop name="Vince" />
    </div>
    );
ReactDOM.render(
    element,
    document.getElementById("three")
)





/* FOUR */
function Fourapp() {
    return (
        <div>
            <h4>FOUR</h4>
            <Threeprop name="Just trying" />
            <Threeprop name="To Do A" />
            <Threeprop name="Loop" />
        </div>
    )
}


ReactDOM.render(
    <Fourapp />,
    document.getElementById('four')
  );








  /* five */
  function Clock(props) {
    return (
      <div>
        <h4>FIVE</h4>
        <h3>It is <span className="dynamic">{props.date.toLocaleTimeString()}.</span></h3>
      </div>
    );
  }
  
  function tick() {
    ReactDOM.render(
      <Clock date={new Date()} />,
      document.getElementById('five')
    );
  }
  
  tick();
  setInterval(tick, 1000);




  class Betterclock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render() {
      return (
        <div>
            <h4>SIX</h4>
            <h3>It is <span className="dynamic">{this.state.date.toLocaleTimeString()}.</span></h3>
        </div>
      );
    }
  }


ReactDOM.render(
    <Betterclock />,
    document.getElementById('six')
);

