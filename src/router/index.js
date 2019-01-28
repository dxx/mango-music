import React, { lazy, Suspense } from "react"

/// React 16.6 or higher
// 使用Suspense做Code-Splitting
const withSuspense = (Component) => {
  return (props) => (
    <Suspense fallback={null}>
      <Component {...props} />
    </Suspense>
  );
}

const Recomment = withSuspense(lazy(() => import("../views/recommend/Recommend")));
const Rankings = withSuspense(lazy(() => import("../views/ranking/Ranking")));
const SingerList = withSuspense(lazy(() => import("../views/singer/SingerList")));
const Search = withSuspense(lazy(() => import("../containers/Search")));

const Album = withSuspense(lazy(() => import("../containers/Album")));
const Ranking = withSuspense(lazy(() => import("../containers/Ranking")));
const Singer = withSuspense(lazy(() => import("../containers/Singer")));

const router = [
  {
    path: "/recommend",
    component: Recomment,
    routes: [
      {
        path: "/recommend/:id",
        component: Album
      }
    ]
  },
  {
    path: "/ranking",
    component: Rankings,
    routes: [
      {
        path: "/ranking/:id",
        component: Ranking
      }
    ]
  },
  {
    path: "/singer",
    component: SingerList,
    routes: [
      {
        path: "/singer/:id",
        component: Singer
      }
    ]
  },
  {
    path: "/search",
    component: Search,
    routes: [
      {
        path: "/search/album/:id",
        component: Album
      },
      {
        path: "/search/singer/:id",
        component: Singer
      }
    ]
  },
  {
    component: () => (
      <div style={{marginTop: 100, textAlign: "center"}}>
        请求的页面不存在
      </div>
    )
  }
];

export default router
