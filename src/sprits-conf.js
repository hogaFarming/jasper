function toggleCls (elem, cls) {
  if (hasCls(elem, cls)) {
    removeCls(elem, cls)
  } else {
    addCls(elem, cls)
  }
}
function hasCls (elem, cls) {
  return elem.classList.contains(cls)
}
function removeCls (elem, cls) {
  elem.classList.remove(cls)
}
function addCls (elem, cls) {
  elem.classList.add(cls)
}

const presets = {
  gps: {
    sr: { duration: 500, distance: 0, scale: 0 },
    revealed: 'animate-dot'
  },
  guide: {
    sr: { duration: 1000, opacity: 0, viewFactor: 0.35, scale: 1, distance: '0' }
  },
  tips: {
    sr: { duration: 1000, opacity: 0, viewFactor: 0.8, scale: 1, distance: '0' }
  },
  static: { static: true }
}

const animateHelp = (cls) => {
  return domElem => {
    domElem.style.transition = 'none'
    if (domElem.animateIntervalId) return
    domElem.animateIntervalId = setInterval(() => {
      toggleCls(domElem, cls)
    }, 800)
  }
}
const animateHelpUnbind = cls => {
  return domElem => {
    if (domElem.animateIntervalId) {
      clearInterval(domElem.animateIntervalId)
      domElem.animateIntervalId = null
      removeCls(domElem, cls)
    }
  }
}
const headShakeHelp = animateHelp('head-shake-helper')
const headShakeHelpUnbind = animateHelp('head-shake-helper')
const handShakeHelp = animateHelp('hand-shake-helper')
const handShakeHelpUnbind = animateHelp('hand-shake-helper')
const handShakeHelp2 = animateHelp('hand-shake-helper2')
const handShakeHelpUnbind2 = animateHelp('hand-shake-helper2')
// const headShakeHelp = domElem => {
//   domElem.style.transition = 'none'
//   if (domElem.animateIntervalId) return
//   domElem.animateIntervalId = setInterval(() => {
//     toggleCls(domElem, 'head-shake-helper')
//   }, 800)
// }
// const headShakeHelpUnbind = domElem => {
//   if (domElem.animateIntervalId) {
//     clearInterval(domElem.animateIntervalId)
//     domElem.animateIntervalId = null
//     removeCls(domElem, 'head-shake-helper')
//   }
// }

export default {
  1: {
    sr: { scale: 1, distance: 0, opacity: 0 }
  },
  2: {
    sr: { delay: 800, scale: 0.5 }
  },
  // 3: {
  //   sr: { delay: 1500, duration: 1500, scale: 1, opacity: 0, distance: 0 }
  // },
  101: {
    sr: { delay: 1200, origin: 'top' },
    revealed: 'shake-head'
  }, // 标题头像
  102: {
    sr: { delay: 1000, distance: 0 },
    revealed: 'breath'
  }, // 标题文本
  103: {
    sr: { duration: 3000, distance: 0, scale: 0, opacity: 1, reset: false },
    revealed: 'shake-tree'
  },
  105: {
    sr: { duration: 3000, distance: 0, scale: 0, opacity: 1, reset: false },
    revealed: 'shake-tree'
  },
  106: {
    sr: { duration: 3000, distance: 0, scale: 0, opacity: 1, reset: false },
    revealed: 'shake-tree'
  },
  104: {
    sr: { duration: 100, distance: 0, scale: 0, reset: false },
    revealed: 'clound'
  },

  107: {
    sr: { delay: 1000, origin: 'right', distance: '10px' },
    revealed: 'bird'
  },
  // 201: {
  //   sr: { duration: 1000, opacity: 0, viewFactor: 0.5, scale: 1, distance: '0' }
  // },
  601: {
    sr: { opacity: 1, scale: 1, distance: 0, delay: 100 },
    revealed: 'shake-hand'
  },
  4: presets.gps,
  6: presets.head,
  7: {
    sr: { opacity: 1, scale: 1, distance: 0, delay: 100, afterReveal: headShakeHelp, afterReset: headShakeHelpUnbind }
  },
  8: {
    sr: { duration: 1000, opacity: 1, origin: 'right', delay: 1000, viewFactor: 1, scale: 0.01, distance: '1rem' },
    event: 'chat1-1'
  },
  9: { static: true },
  10: presets.tips,
  202: presets.guide,

  12: presets.gps,
  15: {
    sr: {
      duration: 1000,
      opacity: 1,
      origin: 'left',
      delay: 1000,
      viewFactor: 1,
      scale: 0.01,
      distance: '1rem',
      // afterReveal: (domElem) => {
      //   setTimeout(() => {
      //     addCls(domElem, 'fade-out')
      //   }, 1500)
      //   setTimeout(() => {
      //     domElem.style.display = 'none'
      //   }, 3000)
      // }
    },
    event: 'chat2-1'
  },
  1301: {
    sr: { opacity: 1, scale: 1, distance: 0, delay: 100, afterReveal: handShakeHelp, afterReset: handShakeHelpUnbind }
  },
  1302: {
    sr: { opacity: 1, scale: 1, distance: 0, delay: 100, afterReveal: handShakeHelp2, afterReset: handShakeHelpUnbind2 }
  },
  13: {
    sr: { opacity: 1, scale: 1, distance: 0, delay: 100 },
    revealed: 'shake-head'
  },
  14: presets.head,

  17: presets.tips,
  203: presets.guide,
  19: presets.gps,
  20: {
    sr: { opacity: 1, scale: 1, distance: 0, delay: 100 },
    revealed: 'shake-head'
  },
  21: presets.head,
  22: {
    sr: { duration: 1000, opacity: 1, scale: 0.01, distance: '1.5rem', origin: 'right', delay: 1000, viewFactor: 1 },
    event: 'chat3-1'
  },

  204: presets.guide,
  24: presets.tips,
  25: presets.gps,
  27: {
    sr: { opacity: 1, scale: 1, distance: 0, delay: 100 },
    revealed: 'shake-head'
  },
  28: presets.head,
  29: {
    sr: { duration: 1000, opacity: 1, scale: 0.01, distance: '1rem', origin: 'top', delay: 1000, viewFactor: 1 },
    event: 'chat4-1'
  },

  32: {
    sr: { opacity: 1, scale: 1, distance: 0, delay: 100 },
    revealed: 'animate-light'
  },

  205: presets.guide,
  33: {
    sr: { duration: 1000, opacity: 0, viewFactor: 0.15, scale: 1, distance: '0' }
  },
  34: presets.gps,
  3601: {
    sr: { opacity: 1, scale: 1, distance: 0, delay: 100 },
    revealed: 'shake-hand-2'
  },
  36: presets.head,
  37: presets.head,
  38: {
    sr: { duration: 1000, opacity: 1, scale: 0.01, distance: '1rem', origin: 'left', delay: 1000, viewFactor: 1 },
    event: 'chat5-1'
  },
  206: presets.guide,
  40: presets.tips,
  41: presets.gps,
  43: {
    sr: { opacity: 1, scale: 1, distance: 0, delay: 100 },
    revealed: 'shake-head'
  },
  44: presets.head,
  45: {
    sr: { duration: 1000, opacity: 1, scale: 0.01, distance: '1rem', origin: 'left', delay: 1000, viewFactor: 1 },
    event: 'chat6-1'
  },

  // 401: {
  //   sr: { opacity: 1, scale: 1, distance: 0, delay: 0 },
  //   revealed: 'animate-fish'
  // },
  // 402: {
  //   sr: { opacity: 1, scale: 1, distance: 0, delay: 0 },
  //   revealed: 'animate-pao'
  // }
}
