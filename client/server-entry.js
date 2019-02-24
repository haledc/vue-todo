/**
 * 服务端渲染入口
 */
import createApp from './create-app'

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()

    if (context.user) {
      store.state.user = context.user
    }

    // 设置服务端路由
    router.push(context.url)

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject(new Error('no component matched'))
      }

      Promise.all(
        matchedComponents.map(component => {
          if (component.asyncData) {
            return component.asyncData({
              route: router.currentRoute,
              router,
              store
            })
          }
        })
      ).then(() => {
        // console.log(store.state)
        // 把vue实例的meta方法赋值给服务端的context
        context.meta = app.$meta()
        context.state = store.state
        context.router = router
        resolve(app)
      })
    })
  })
}
