const eventBus = {
  handlers: {},
  subscribe (event, handler) {
    let _handlers = this.handlers[event]
    if (!_handlers) {
      _handlers = this.handlers[event] = []
    }
    _handlers.push(handler)
  },
  dispatch (event, msg) {
    const _handlers = this.handlers[event] || []
    _handlers.forEach(fn => {
      fn(msg)
    })
  }
}
export default eventBus
