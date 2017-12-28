function addStyle (elem, styleObj) {
  Object.keys(styleObj).forEach(key => {
    elem.style[key] = styleObj[key]
  })
}

class Story {
  init (elem, total) {
    this.container = elem
    this.total = total
    this.initContainer()
    this.scroller = this.initScroller()
    this.sections = this.initSections(elem.querySelectorAll('.story-section'))
    this.current = 0
    this.bindEvents()
  }
  initContainer () {
    addStyle(this.container, {
      position: 'relative',
      height: window.innerHeight + 'px',
      width: '100%'
    })
  }
  initScroller () {
    const elem = this.container.querySelector('.story-scroller')
    addStyle(elem, {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: this.total + 'rem'
    })
  }
  initSections (sectionsEl) {
    return sectionsEl.map(el => {
      const len = el.dataset.len
      addStyle(el, {
        position: 'relative',
        height: len + 'rem'
      })
      return {
        el: el,
        len: len
      }
    })
  }
  bindEvents () {
    this.container
  }
}
