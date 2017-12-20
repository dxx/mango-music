import React from "react"
import {getCarousel, getNewAlbum} from "@/api/recommend"
import {CODE_SUCCESS} from "@/api/config"
import "./recommend.styl"


class Recommend extends React.Component {
    componentDidMount() {
        //如果当前路由没有被激活隐藏加载组件
        if (!this.props.match.isExact) {
            this.setState({loading: false});
        }
        getCarousel().then((res) => {
            console.log("获取轮播：");
            if (res) {
                console.log(res);
                if (res.code === CODE_SUCCESS) {
                    /*this.setState({
                        sliderList: res.data.slider
                    }, () => {
                        if(!this.sliderSwiper) {
                            //初始化轮播图
                            this.sliderSwiper = new Swiper(".slider-container", {
                                loop: true,
                                autoplay: 3000,
                                pagination: '.swiper-pagination'
                            });
                        }
                    });*/
                }
            }
        });

        getNewAlbum().then((res) => {
            console.log("获取最新专辑：");
            if (res) {
                console.log(res);
                if (res.code === CODE_SUCCESS) {
                    //根据发布时间降序排列
                    /*let albumList = res.albumlib.data.list;
                    albumList.sort((a, b) => {
                        return new Date(b.public_time).getTime() - new Date(a.public_time).getTime();
                    });
                    this.setState({
                        loading: false,
                        newAlbums: albumList
                    }, () => {
                        //刷新scroll
                        this.setState({refreshScroll:true});
                    });*/
                }
            }
        });

    }
    render() {
        return (
            <div className="music-recommend">
                Recommend
            </div>
        );
    }
}

export default Recommend