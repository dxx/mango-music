import React from "react"
import { getTransitionEndName } from "@/util/event"

import "./musicalnote.styl"

/**
 * 使用PureComponent，不需要触发生组件update，以免ref回调函数多次调用
 */
class MusicalNote extends React.PureComponent {
  constructor(props) {
    super(props);

    this.musicIcos = [];
  }
  componentDidMount() {
    this.initMusicIco();
  }
  /**
   * 初始化音符图标
   */
  initMusicIco() {
    this.musicIcos.forEach((item) => {
      // 初始化状态
      item.run = false;
      let transitionEndName = getTransitionEndName(item);
      item.addEventListener(transitionEndName, function () {
        this.style.display = "none";
        this.style["webkitTransform"] = "translate3d(0, 0, 0)";
        this.style["transform"] = "translate3d(0, 0, 0)";
        this.run = false;

        let icon = this.querySelector("div");
        icon.style["webkitTransform"] = "translate3d(0, 0, 0)";
        icon.style["transform"] = "translate3d(0, 0, 0)";
      }, false);
    });
  }
  /**
   * 开始音符下落动画
   */
  startAnimation({ x, y }) {
    if (this.musicIcos.length > 0) {
      for (let i = 0; i < this.musicIcos.length; i++) {
        let item = this.musicIcos[i];
        // 选择一个未在动画中的元素开始动画
        if (item.run === false) {
          item.style.left = x + "px";
          item.style.top = y + "px";
          item.style.display = "inline-block";
          setTimeout(() => {
            item.run = true;
            item.style["webkitTransform"] = "translate3d(0, 1000px, 0)";
            item.style["transform"] = "translate3d(0, 1000px, 0)";

            let icon = item.querySelector("div");
            icon.style["webkitTransform"] = "translate3d(-30px, 0, 0)";
            icon.style["transform"] = "translate3d(-30px, 0, 0)";
          }, 10);
          break;
        }
      }
    }
  }
  render() {
    return (
      <div>
        {
          [1, 2, 3].map((item) => (
            <div className="music-ico" 
              ref={ (el) => { this.musicIcos.push(el); } }
              key={item}>
              <div className="icon-fe-music"></div>
            </div>
          ))
        }
      </div>
    );
  }
}

export default MusicalNote
