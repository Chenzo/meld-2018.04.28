


console.log("This is react right here:");

function callThis() {
	return "This is called from a function";
}

const myElem = (
	<div className="whyClassname">
		<h4>ONE</h4>
		<p>Hello world</p>
		<p>{callThis()}</p>
		<p>Start Time <span className="dynamic">{new Date().toLocaleTimeString()}</span></p>
	</div>
);

class Greeting extends React.Component {
	render() {
			return myElem;
	}
}
ReactDOM.render(
	<Greeting />,
	document.getElementById('root')
);




/* TWO */

function doRender() {
	const myElem = (
		<div>
		<h4>TWO</h4>
		<p>Current Time <span className="dynamic">{new Date().toLocaleTimeString()}</span></p>
		</div>
	);
	ReactDOM.render(
		myElem,
		document.getElementById('two')
	);
}
doRender();
setInterval(doRender, 1000);