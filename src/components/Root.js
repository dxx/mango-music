import React from "react"
import {Provider} from "react-redux"
import store from "../redux/store"
import App from "./App"
import '../assets/stylus/reset.styl'

class Root extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<App store={store}/>
			</Provider>
		);
	}
}

export default Root