import React from "react"
import { renderRoutes } from "react-router-config"
import LazyLoad, { forceCheck } from "react-lazyload";
import Scroll from "../../components/scroll/Scroll"
import Loading from "../../components/loading/Loading"
import { getRankingList } from "../../api/ranking"
import { CODE_SUCCESS } from "../../api/config"
import * as RankingModel from "../../models/ranking"

import style from "./ranking.styl?module"

class Ranking extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      rankingList: [],
      refreshScroll: false
    };
  }
  componentDidMount() {
    getRankingList().then((res) => {
      // console.log("获取排行榜：");
      if (res) {
        // console.log(res);
        if (res.code === CODE_SUCCESS) {
          let topList = [];
          res.data.topList.forEach(item => {
            if (/MV/i.test(item.topTitle)) {
              return;
            }
            topList.push(RankingModel.createRankingByList(item));
          });
          this.setState({
            loading: false,
            rankingList: topList
          }, () => {
            // 刷新scroll
            this.setState({ refreshScroll: true });
          });
        }
      }
    });
  }
  toDetail(url) {
    return () => {
      this.props.history.push({
        pathname: url
      });
    }
  }
  render() {
    let { match, route } = this.props;
    return (
      <div className="music-ranking">
        <Scroll refresh={this.state.refreshScroll}
          onScroll={() => { forceCheck(); }}>
          <div className={style.rankingList}>
            {
              this.state.rankingList.map(ranking => {
                return (
                  <div className={`${style.rankingWrapper} skin-ranking-wrapper`} key={ranking.id}
                    onClick={this.toDetail(`${match.url + '/' + ranking.id}`)}>
                    <div className={style.left}>
                      <LazyLoad height={100}>
                        <img src={ranking.img} alt={ranking.title} />
                      </LazyLoad>
                    </div>
                    <div className={style.right}>
                      <h1 className="ranking-title">
                        {ranking.title}
                      </h1>
                      {
                        ranking.songs.map((song, index) => {
                          return (
                            <div className={style.topSong} key={index}>
                              <span className={style.index}>{index + 1}</span>
                              <span>{song.name}</span>
                              &nbsp;-&nbsp;
														<span className="singer">{song.singer}</span>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                );
              })
            }
          </div>
        </Scroll>
        <Loading title="正在加载..." show={this.state.loading} />
        { renderRoutes(route.routes) }
      </div>
    );
  }
}

export default Ranking
