import React from "react"
import { CSSTransition } from "react-transition-group"
import Skin from "../../containers/Skin"

import style from "./menu.styl?module"

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.bottomRef = React.createRef();

    this.state = {
      skinShow: false
    };
  }
  showSetting = (status) => {
    this.close();
    // menu关闭后打开设置
    setTimeout(() => {
      this.setState({
        skinShow: status
      });
    }, 300);
  }
  close = () => {
    this.props.closeMenu();
  }
  render() {
    return (
      <div>
        <CSSTransition in={this.props.show} timeout={300} classNames="fade"
          onEnter={() => {
            this.bottomRef.current.style.display = "block";
          }}
          onExited={() => {
            this.bottomRef.current.style.display = "none";
          }}>
          <div className={style.bottomContainer} onClick={this.close} ref={this.bottomRef}>
            <div className={style.bottomWrapper}>
              <div onClick={() => { this.showSetting(true); }}>
                皮肤中心
			        </div>
              <div className={style.itemClose} onClick={this.close}>
                关闭
			        </div>
            </div>
          </div>
        </CSSTransition>
        <Skin show={this.state.skinShow} close={() => { this.showSetting(false); }} />
      </div>
    );
  }
}

export default Menu
