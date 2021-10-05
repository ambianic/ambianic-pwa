import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

describe('Home Page', () => {
  let wrapper
  const localVue = createLocalVue()

  localVue.use(VueRouter)
  const router = new VueRouter()

  Vue.use(Vuetify)

  let options
  const vuetify = new Vuetify()

  beforeEach(() => {
    options = {
      localVue,
      vuetify,
      router
    }
  })

  afterEach(() => {
    wrapper.destroy()
    jest.clearAllMocks()
  })

  test('Shows home screen title', async () => {
    wrapper = await mount(Home, options)
    await wrapper.vm.$nextTick()
    console.debug({ wrapper })
    const headline = wrapper.findComponent({ ref: 'headline-title' })
    expect(headline.exists()).toBeTrue()
    expect(headline.isVisible()).toBeTrue()
    expect(headline.text()).toContain('Welcome to Ambianic.ai')
  })

  test('Shows Begin Setup button for new users', async () => {
    wrapper = await mount(Home, options)
    await wrapper.vm.$nextTick()
    console.debug({ wrapper })
    const btnSetup = wrapper.findComponent({ ref: 'btn-setup' })
    expect(btnSetup.exists()).toBeTrue()
    expect(btnSetup.isVisible()).toBeTrue()
    expect(btnSetup.text()).toContain('Begin Setup')
  })

  test('Shows Timeline button for returning users', async () => {
    wrapper = await mount(Home, {
      ...options,
      data () {
        return {
          hasSetupSystem: true
        }
      }
    })
    await wrapper.vm.$nextTick()
    console.debug({ wrapper })
    const btnTimeline = wrapper.findComponent({ ref: 'btn-timeline' })
    expect(btnTimeline.exists()).toBeTrue()
    expect(btnTimeline.isVisible()).toBeTrue()
    expect(btnTimeline.text()).toContain('View Timeline')
    const btnSetup = wrapper.findComponent({ ref: 'btn-setup' })
    expect(btnSetup.exists()).toBeFalse()
  })

  test('Shows Timeline button for returning users - localstorage logic test', async () => {
    // mock localStorage access
    // ref: https://github.com/facebook/jest/issues/6858#issuecomment-413677180
    const getItem = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'hasCompletedOnboarding') {
        return true
      }
    })
    wrapper = await mount(Home, options)
    await wrapper.vm.$nextTick()
    expect(getItem).toHaveBeenCalledWith('hasCompletedOnboarding')
    expect(getItem).toHaveBeenCalledWith(expect.stringContaining('remotePeerId'))
    const btnTimeline = wrapper.findComponent({ ref: 'btn-timeline' })
    expect(btnTimeline.exists()).toBeTrue()
    expect(btnTimeline.isVisible()).toBeTrue()
    expect(btnTimeline.text()).toContain('View Timeline')
    const btnSetup = wrapper.findComponent({ ref: 'btn-setup' })
    expect(btnSetup.exists()).toBeFalse()
  })
})
