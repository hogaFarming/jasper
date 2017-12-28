<template>
  <div id="app">
    <div class="scroll-mask" style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index:10000;">
      <div v-show="!loading" class="play-btn" @touchstart="onTouchPlay" @touchend="onTouchPause"></div>
      <div v-show="!loading" class="audio-control" :class="{'audio-on': isAudioPlaying}" @touchstart="toggleAudio"></div>
    </div>
    <div class="app-loading" v-show="loading">
      <div class="app-loading-bg"></div>
      <div class="progress">
        <div class="progress__jasper" :style="{left: progress * 6.306666666666667 + 'rem'}"></div>
        <div class="progress__inner" :style="{width: progress * 6.306666666666667 + 'rem'}"></div>
      </div>
    </div>
    <div class="app-bg" :class="{'user-touched': reqAnimation !== undefined}" :style="bgStyle" v-show="!loading">
      <img src="./assets/img/app-bg.jpg" alt="">
      <x-sprit
        v-for="(sprit, index) in sprits"
        :id="'sprit-' + sprit.id"
        :key="sprit.id"
        :w="sprit.w"
        :h="sprit.h"
        :x="sprit.x"
        :y="sprit.y"
        :src="sprit.asset"
        :pstyle="sprit.pstyle"
        @click.native="onSpritDown(sprit, $event)"
        @load="onSpritLoaded(sprit)"
        :subscribe="sprit.sub"
        :event="sprit.event"
        :class="sprit.cls"
        :animate-style="sprit.animateStyle"
        :style="sprit === activeSprit ? {outline: '1px solid blue'} : {}"
        ref="sprits"
      ></x-sprit>
    </div>
    <!-- <div v-if="progress >= 1"> -->
      <audio style="display:none; height: 0" id="bg-music" ref="audio" autoplay="autoplay" preload="auto" src="/static/assets/babaqunaer.mp3" loop="loop"></audio>
    <!-- </div> -->
  </div>
</template>
<script>
import Sprit from './components/sprit'
import ScrollReveal from 'ScrollReveal'
import sprits from './sprits'
import spritsConf from './sprits-conf'
import './main.css'
import axios from 'axios'

const getConf = (id) => {
  return spritsConf[id]
}

const sr = window.sr = ScrollReveal({ reset: true, duration: 1000, viewOffset: { bottom: 35 } })

// 音乐播放
function autoPlayMusic () {
  // 自动播放音乐效果，解决浏览器或者APP自动播放问题
  function musicInBrowserHandler () {
    musicPlay(true)
    document.body.removeEventListener('touchstart', musicInBrowserHandler)
  }
  document.body.addEventListener('touchstart', musicInBrowserHandler)

  // 自动播放音乐效果，解决微信自动播放问题
  function musicInWeixinHandler () {
    musicPlay(true)
    document.addEventListener('WeixinJSBridgeReady', function () {
      musicPlay(true)
    }, false)
    document.removeEventListener('DOMContentLoaded', musicInWeixinHandler)
  }
  document.addEventListener('DOMContentLoaded', musicInWeixinHandler)
}
function musicPlay (isPlay) {
  var media = document.querySelector('#bg-music')
  if (isPlay && media.paused) {
    media.play()
  }
  if (!isPlay && !media.paused) {
    media.pause()
  }
}
autoPlayMusic()

let lastTime = 0

const apiUrl = '//120.79.21.200:85/'
let api_token = ''
let wxSignData = null

export default {
  data () {
    return {
      dev: true,
      reqAnimation: undefined,
      appPlaying: false,
      isAudioPlaying: false,
      keyCode: null,
      activeSprit: null,
      sprits: sprits,
      count: sprits.length,
      current: 0,
      stops: ['18.133333333333333', '37.013333333333335', '53.22666666666667', '70.37333333333333', '84.96', '95.33333333333333', '111.81333333333333', '129.54666666666665']
    }
  },
  computed: {
    bgStyle () {
      return {
        width: '10rem',
        height: '129.54666666666665rem',
        transition: 'all 1s cubic-bezier(0.6, 0.2, 0.1, 1)'
      }
    },
    progress () {
      const result = (sprits.length - this.count) / sprits.length
      return result
    },
    loading () {
      return this.progress < 1
    }
  },
  watch: {
    progress (newVal, oldVal) {
      if (newVal > oldVal && newVal >= 1) {
        this.init()
      }
    }
  },
  mounted () {
    this.$refs.audio.addEventListener('playing', () => {
      this.isAudioPlaying = true
    })
    this.$refs.audio.addEventListener('pause', () => {
      this.isAudioPlaying = false
    })
    const mask = document.body.querySelector('.scroll-mask')
    mask.addEventListener('touchmove', event => {
      event.preventDefault()
    })
    mask.addEventListener('click', event => {
      event.preventDefault()
    })
    window.scrollTo(0, 0)
    document.addEventListener('touchstart', function (e) {
      e.preventDefault()
    }, false)
  },
  methods: {
    init () {
      this.initSprits()
      this.dev && this.initDevControl()
      this.initWxShare()
    },
    initSprits () {
      sprits.forEach((item, index) => {
        const el = this.$refs.sprits[index].$el
        const conf = getConf(item.id)
        if (!conf) return
        if (conf.static) return
        let options = {}
        let oldFn
        if (conf.sr) {
          options = { ...options, ...conf.sr }
          oldFn = conf.sr.afterReveal
        }
        if (conf.revealed) {
          options.afterReveal = (domElem) => {
            domElem.classList.add(conf.revealed)
            oldFn && oldFn(domElem)
          }
        }
        // if (conf.html) {
        //   options.afterReveal = (domElem) => {
        //     const div = document.createElement('div')
        //     div.innerHTML = conf.html
        //     domElem.appendChild(div)
        //   }
        // }
        if (conf.event) {
          options.afterReveal = (domElem) => {
            window.eventBus.dispatch(conf.event, 'reveal')
            oldFn && oldFn(domElem)
          }
          options.beforeReset = (domElem) => {
            window.eventBus.dispatch(conf.event, 'reset')
          }
        }
        sr.reveal(el, options)
      })
    },
    initDevControl () {
      document.onmouseup = () => { this.activeSprit = null }
      document.onkeydown = event => {
        this.keyCode = event.keyCode
      }
      document.onkeyup = event => {
        this.keyCode = null
      }
      setInterval(() => {
        if (this.keyCode && this.activeSprit) {
          const diff = 0.05
          switch (this.keyCode) {
            case 87: // up
              this.activeSprit.y -= diff
              break
            case 68: // right
              this.activeSprit.x += diff
              break
            case 65: // left
              this.activeSprit.x -= diff
              break
            case 83: // down
              this.activeSprit.y += diff
              break
            default:
              return
          }
          this.sprits = [...this.sprits]
        }
      }, 150)
    },
    initWxShare () {
      axios(apiUrl + '/api/init').then(res => {
        return api_token = res.data.token
      }).then(token => axios({
        url: apiUrl + '/api/share_sign',
        method: 'post',
        data: {
          url: location.href
        },
        headers: {
          Authorization: token,
          'X-ISAPI': 1
        }
      })).then(res => {
        wxSignData = res.data.data
        const options = {
          debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: wxSignData.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
          timestamp: wxSignData.timestamp, // 必填，生成签名的时间戳
          nonceStr: wxSignData.nonceStr, // 必填，生成签名的随机串
          signature: wxSignData.signature,// 必填，签名，见附录1
          jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone'
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        }
        console.log('wx.config, ', options)
        wx.config(options);
      })
      wx.error(err => {
        console.error(err)
      })
      wx.ready(() => {
        // “分享到朋友圈”
        wx.onMenuShareTimeline({
          title: '123', // 分享标题
          link: '123', // 分享链接，该链接域名必须与当前企业的可信域名一致
          imgUrl: '123', // 分享图标
          success: function () {
              // 用户确认分享后执行的回调函数
          },
          cancel: function () {
              // 用户取消分享后执行的回调函数
          }
        });
        // “分享给朋友”
        wx.onMenuShareAppMessage({
          title: '123', // 分享标题
          desc: 'desc', // 分享描述
          link: 'http:' + apiUrl + '/sdf', // 分享链接，该链接域名必须与当前企业的可信域名一致
          imgUrl: '', // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
              // 用户确认分享后执行的回调函数
          },
          cancel: function () {
              // 用户取消分享后执行的回调函数
          }
        });
        // “分享到QQ”
        wx.onMenuShareQQ({
          title: '', // 分享标题
          desc: '', // 分享描述
          link: '', // 分享链接
          imgUrl: '', // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        });
        // “分享到腾讯微博”
        wx.onMenuShareWeibo({
          title: '', // 分享标题
          desc: '', // 分享描述
          link: '', // 分享链接
          imgUrl: '', // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
              // 用户取消分享后执行的回调函数
          }
        });
        // “分享到QQ空间”
        wx.onMenuShareQZone({
          title: '', // 分享标题
          desc: '', // 分享描述
          link: '', // 分享链接
          imgUrl: '', // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
              // 用户取消分享后执行的回调函数
          }
        });
      })
    },
    onTouchPlay () {
      this.appPlaying = true
      lastTime = new Date().getTime()
      this.reqAnimation = requestAnimationFrame(this.play)
    },
    onTouchPause () {
      this.appPlaying = false
      this.reqAnimation = null
      cancelAnimationFrame(this.reqAnimation)
    },
    play () {
      const scrollY = window.scrollY
      const currTime = new Date().getTime()
      const diff = currTime - lastTime
      const speed = 50
      const delta = 2.8 || Math.round(diff / 1000 * speed < 1 ? 1 : (diff / 1000 * speed))
      // console.log('delta: ' + delta)
      window.scrollTo(0, scrollY + delta)
      // debugger
      if (this.appPlaying) {
        lastTime = currTime
        this.reqAnimation = requestAnimationFrame(this.play)
      }
    },
    onSpritDown (sprit, event) {
      // console.log(sprit)
      this.dev && (this.activeSprit = sprit)
    },
    onSpritLoaded () {
      this.count -= 1
    },
    toggleAudio () {
      if (this.isAudioPlaying) {
        this.$refs.audio.pause()
      } else {
        this.$refs.audio.play()
      }
    }
  },
  components: {
    xSprit: Sprit
  }
}
</script>

<style>
.app-bg {
  position: absolute;
  overflow: hidden;
}
.app-bg > img {
  display: block;
  width: 100%;
}
.progress {
  position: absolute;
  top: 6.706666666666667rem;
  left: 50%;
  transform: translateX(-50%);
  width: 6.626666666666667rem;
  height: 0.5066666666666667rem;
  background: url('./assets/img/progress.png') center / cover no-repeat;
}
.progress__jasper {
  position: absolute;
  bottom: 50%;
  left: 0.16rem;
  width: 1.8rem;
  height: 3.013333333333333rem;
  transform: translate(-50%,-0.25rem);
  background: url('./assets/img/loading-jasper.gif') center / cover no-repeat;
}
.progress__inner {
  position: absolute;
  top: 50%;
  left: 0.16rem;
  transform: translateY(-50%);
  height: 0.18666666666666668rem;
  background: url('./assets/img/progress-inner.png') repeat-x;
}
.audio-control {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 0.85rem;
  height: 0.85rem;
  background: url('./assets/img/audio-off.png') center / cover no-repeat;
}
.audio-control.audio-on {
  background: url('./assets/img/audio-on.png') center / cover no-repeat;
}
.play-btn {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 1.9066666666666667rem;
  height: 2.493333333333333rem;
  transform: translateX(-50%);
  background: url('./assets/img/btn.png') center / cover no-repeat;
}
#sprit-3 {
  opacity: 0;
  transition: all 1s cubic-bezier(0.6, 0.2, 0.1, 1);
}
.user-touched #sprit-3 {
  opacity: 1;
}
#sprit-201 {
  opacity: 0;
  transition: all 1s cubic-bezier(0.6, 0.2, 0.1, 1) 0.4s;
}
.user-touched #sprit-201 {
  opacity: 1;
}
.app-loading {
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.app-loading-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 10rem;
  height: 100%;
  background: url('./assets/img/app-bg-loading.jpg') top center / 100% auto no-repeat;
}
</style>

