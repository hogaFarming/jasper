<template>
  <div class="sprit" :style="spritStyle">
    <img ref="img" :src="imgSrc" alt="" style="width: 100%;height: 100%;display: block;" @load="onImageLoaded">
  </div>
</template>
<script>
export default {
  props: ['w', 'h', 'x', 'y', 'src', 'pstyle', 'subscribe', 'animateStyle', 'event'],
  data () {
    return {
      visible: this.subscribe ? false : true
    }
  },
  computed: {
    spritStyle () {
      let style = {
        width: this.w + 'rem',
        height: this.h + 'rem',
        top: this.y + 'rem',
        left: this.x + 'rem',
        ...(this.pstyle || {})
        // backgroundImage: this.src === '1.png' ? `url(${img1png})` : `url(/static/img/${this.src})`,
        // backgroundSize: 'cover'
      }
      if (this.subscribe) {
        if (this.visible) {
          style = {
            ...style,
            ...this.animateStyle,
            visiblity: 'visible'
          }
        } else {
          style = {
            ...style,
            visiblity: 'hidden'
          }
        }
      }
      return style
    },
    imgSrc () {
      return `/static/img/${this.src}`
    }
  },
  watch: {
    visible (newVal, oldVal) {
      if (newVal && this.event) {
        setTimeout(() => {
          window.eventBus.dispatch(this.event, 'reveal')
        }, this.event === 'chat2-3' ? 2000 : this.event === 'chat2-2' ? 2500 : 3000)
      } else if (!newVal && oldVal && this.event) {
        window.eventBus.dispatch(this.event, 'reset')
      }
    }
  },
  mounted () {
    if (this.subscribe) {
      window.eventBus.subscribe(this.subscribe, (msg) => {
        if (msg === 'reveal') {
          this.visible = true
        } else {
          this.visible = false
        }
      })
    }
  },
  methods: {
    onImageLoaded () {
      this.$emit('load')
    }
  }
}
</script>
<style>
.sprit {
  position: absolute;
  z-index: 10;
}
</style>
