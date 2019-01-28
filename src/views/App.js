import React from "react"
import { BrowserRouter as Router, Switch, Redirect, NavLink } from "react-router-dom"
import { renderRoutes } from "react-router-config"

import router from "../router"
import MusicPlayer from "./play/MusicPlayer"
import MusicMenu from "./setting/Menu"

import logo from "../assets/imgs/logo.png"
import "../assets/stylus/reset.styl"
import "../assets/stylus/font.styl"
import style from "./app.styl?module"

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuShow: false
    };
  }
  render() {
    return (
      <Router>
        <div className={`${style.app} skin-app`}>
          <header className={`${style.appHeader} skin-app-header`}>
            <i className={`icon-et-more ${style.appMore}`} onClick={() => { this.setState({ menuShow: true }); }}></i>
            <img src={logo} className={style.appLogo} alt="logo" />
            <h1 className={style.appTitle}>Mango Music</h1>
          </header>
          <div className={`${style.musicTab} skin-music-tab`}>
            <div className={style.tabItem}>
              <NavLink to="/recommend" className="nav-link">
                <span>推荐</span>
              </NavLink>
            </div>
            <div className={style.tabItem}>
              <NavLink to="/ranking" className="nav-link">
                <span>排行榜</span>
              </NavLink>
            </div>
            <div className={style.tabItem}>
              <NavLink to="/singer" className="nav-link">
                <span>歌手</span>
              </NavLink>
            </div>
            <div className={style.tabItem}>
              <NavLink to="/search" className="nav-link">
                <span>搜索</span>
              </NavLink>
            </div>
          </div>
          <div className={style.musicView}>
            {/*
              Switch组件用来选择最近的一个路由，否则没有指定path的路由也会显示
              Redirect重定向到列表页
            */}
            <Switch>
              <Redirect from="/" to="/recommend" exact />
              {/* 渲染 Route */}
              { renderRoutes(router) }
            </Switch>
          </div>
          <MusicPlayer />
          <MusicMenu show={this.state.menuShow}
            closeMenu={() => { this.setState({ menuShow: false }); }} />
        </div>
      </Router>
    );
  }
}

export default App
