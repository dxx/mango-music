import React from "react"
import style from "./header.styl?module"

class MusicHeader extends React.Component {
  handleClick() {
    window.history.back();
  }
  render() {
    return (
      <div className={style.musicHeader}>
        <span className={style.headerBack} onClick={this.handleClick}>
          <i className="icon-back"></i>
        </span>
        <div className={style.headerTitle}>
          {this.props.title}
        </div>
      </div>
    );
  }
}

export default MusicHeader
