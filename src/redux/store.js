import { createStore, applyMiddleware } from "redux"
import logger from "redux-logger"
import reducer from "./reducers"
import storageMiddleware from "./storageMiddleware"

let useMiddleware = applyMiddleware(storageMiddleware)  // 使用中间件

if (process.env.NODE_ENV === "development") {
  // 开发环境使用redux-logger
  useMiddleware = applyMiddleware(storageMiddleware, logger);
}

// 创建store
const store = createStore(
  reducer,
  useMiddleware
);
export default store
