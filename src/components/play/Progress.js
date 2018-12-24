import React from "react"
import PropTypes from "prop-types"

import "./progress.styl"

class Progress extends React.Component {
  componentDidUpdate() {
    // 组件更新后重新获取进度条总宽度
    if (!this.progressBarWidth) {
      this.progressBarWidth = this.progressBarDOM.offsetWidth;
    }
  }
  componentDidMount() {
    let progressBarDOM = this.progressBarDOM;
    let progressDOM = this.progressDOM;
    let progressBtnDOM = this.progressBtnDOM;
    this.progressBarWidth = progressBarDOM.offsetWidth;


    let { disableButton, disableDrag, onDragStart, onDrag, onDragEnd } = this.props;
    if (disableButton !== true && disableDrag !== true) {
      // 触摸开始位置
      let downX = 0;
      // 按钮left值
      let buttonLeft = 0;

      progressBtnDOM.addEventListener("touchstart", (e) => {
        let touch = e.touches[0];
        downX = touch.clientX;
        buttonLeft = parseInt(touch.target.style.left, 10);

        if (onDragStart) {
          onDragStart();
        }
      });
      progressBtnDOM.addEventListener("touchmove", (e) => {
        e.preventDefault();

        let touch = e.touches[0];
        let diffX = touch.clientX - downX;

        let btnLeft = buttonLeft + diffX;
        if (btnLeft > progressBarDOM.offsetWidth) {
          btnLeft = progressBarDOM.offsetWidth;
        } else if (btnLeft < 0) {
          btnLeft = 0;
        }
        // 设置按钮left值
        touch.target.style.left = btnLeft + "px";
        // 设置进度width值
        progressDOM.style.width = btnLeft / this.progressBarWidth * 100 + "%";

        if (onDrag) {
          onDrag(btnLeft / this.progressBarWidth);
        }
      });
      progressBtnDOM.addEventListener("touchend", (e) => {
        if (onDragEnd) {
          onDragEnd();
        }
      });
    }
  }
  handleClick = (e) => {
    const { disableClick, onClick } = this.props;
    if (disableClick !== true) {
      let left = this.progressBarDOM.getBoundingClientRect().left;
      let clickedLeft = e.clientX - left;
      let progress = clickedLeft / this.progressBarWidth;
      this.progressDOM.style.width = `${progress * 100}%`;
      this.progressBtnDOM.style.left = `${clickedLeft}px`;
      if (onClick) {
        onClick(progress);
      }
    }
  }
  render() {
    // 进度值：范围 0-1
    let { progress, disableButton } = this.props;
    if (!progress) progress = 0;

    // 按钮left值
    let progressButtonOffsetLeft = 0;
    if (this.progressBarWidth) {
      progressButtonOffsetLeft = progress * this.progressBarWidth;
    }

    return (
      <div className="progress-bar" ref={(el) => { this.progressBarDOM = el; }} onClick={ this.handleClick }>
        <div className="progress-load"></div>
        <div className="progress" style={{ width: `${progress * 100}%` }} ref={(el) => { this.progressDOM = el; }}></div>
        {
          disableButton === true ? "" :
            <div className="progress-button" style={{ left: progressButtonOffsetLeft }} ref={(el) => { this.progressBtnDOM = el; }}></div>
        }
      </div>
    );
  }
}

Progress.propTypes = {
  // 进度
  progress: PropTypes.number.isRequired,
  // 是否禁用点击
  disableClick: PropTypes.bool,
  // 是否禁用按钮
  disableButton: PropTypes.bool,
  // 是否禁用拖拽
  disableDrag: PropTypes.bool,
  onClick: PropTypes.func,
  onDragStart: PropTypes.func,
  onDrag: PropTypes.func,
  onDragEnd: PropTypes.func
};

export default Progress
