import React from "react"
import {CSSTransition} from "react-transition-group"
import {skin, setSkinStyle} from "../../util/skin"

import "./skin.styl"

class Skin extends React.Component {
	constructor(props) {
		super(props);
		this.skins = [
          {key: "mangoYellow", name: "芒果黄", color: "#FFD700"},
          {key: "coolBlack", name: "炫酷黑", color: "#212121"},
          {key: "kuGouBlue", name: "酷狗蓝", color: "#2CA2F9"},
          {key: "netBaseRed", name: "网易红", color: "#D43C33"},
          {key: "qqGreen", name: "QQ绿", color: "#31C27C"}
        ]
	}
	setCurrentSkin = (key) => {
		// 设置皮肤
        setSkinStyle(skin[key]);
        this.props.setSkin(key);
        // 关闭当前页面
        this.props.close();
	}
	render() {
		return (
			<CSSTransition in={this.props.show} timeout={300} classNames="pop"
				onEnter={() => {
					this.refs.skin.style.display = "block";
				}}
				onExited={() => {
					this.refs.skin.style.display = "none";
				}}>
				<div className="music-skin" ref="skin">
			    	<div className="header">
			        	皮肤中心
			        	<span className="cancel" onClick={() => {this.props.close();}}>取消</span>
			      	</div>
			      	<div className="skin-title">推荐皮肤</div>
			      	<div className="skin-container">
			      		{
			      			this.skins.map(skin => (
			      				<div className="skin-wrapper" onClick={() => {this.setCurrentSkin(skin.key);}} key={skin.key}>
					          		<div className="skin-color" style={{backgroundColor: skin.color, boxShadow: `0 0 3px ${skin.color}`}}>
						            	<i className="icon-right" style={{display: skin.key === this.props.currentSkin ? "" : "none"}}></i>
						          	</div>
					          		<div>{skin.name}</div>
					          	</div>
			      			))
			      		}
			      </div>
			    </div>
		    </CSSTransition>
		);
	}
}

export default Skin