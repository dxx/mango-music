import {connect} from "react-redux"
import {setSkin} from "../redux/actions"
import Skin from "../components/setting/Skin"

const mapStateToProps = (state) => ({
	currentSkin: state.skin
});

const mapDispatchToProps = (dispatch) => ({
	setSkin: (skin) => {
		dispatch(setSkin(skin));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Skin)