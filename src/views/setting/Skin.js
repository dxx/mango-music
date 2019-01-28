import React from "react"
import { CSSTransition } from "react-transition-group"
import { skin, setSkinStyle } from "../../util/skin"

import style from "./skin.styl?module"

class Skin extends React.Component {
  constructor(props) {
    super(props);

    this.skinRef = React.createRef();

    this.skins = [
      { key: "mangoYellow", name: "芒果黄", color: "#FFD700" },
      { key: "coolBlack", name: "炫酷黑", color: "#212121" },
      { key: "kuGouBlue", name: "酷狗蓝", color: "#2CA2F9" },
      { key: "netBaseRed", name: "网易红", color: "#D43C33" },
      { key: "qqGreen", name: "QQ绿", color: "#31C27C" }
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
          this.skinRef.current.style.display = "block";
        }}
        onExited={() => {
          this.skinRef.current.style.display = "none";
        }}>
        <div className={style.musicSkin} ref={this.skinRef}>
          <div className={style.header}>
            皮肤中心
			      <span className={style.cancel} onClick={() => { this.props.close(); }}>取消</span>
          </div>
          <div className={style.skinTitle}>推荐皮肤</div>
          <div className={style.skinContainer}>
            {
              this.skins.map(skin => (
                <div className={style.skinWrapper} onClick={() => { this.setCurrentSkin(skin.key); }} key={skin.key}>
                  <div className={style.skinColor} style={{ backgroundColor: skin.color, boxShadow: `0 0 3px ${skin.color}` }}>
                    <i className="icon-right" style={{ display: skin.key === this.props.currentSkin ? "" : "none" }}></i>
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
