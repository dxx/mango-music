import { createStore, applyMiddleware } from "redux"
import reducer from "./reducers"
import storageMiddleware from "./storageMiddleware"

// 创建store
const store = createStore(
  reducer,
  applyMiddleware(storageMiddleware)  // 使用中间件
);
export default store
