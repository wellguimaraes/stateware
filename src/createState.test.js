import { expect } from 'chai'
import createState from '../src/createState'
import { spy } from 'sinon'

describe('createState', () => {

  it('should compute getters only when required fields change', () => {
    const deltaSpy = spy()
    const echoSpy = spy()

    const first = createState(
      {
        name: 'first',
        alpha: 1,
        bravo: 2,
        charlie: 3,
        delta({ alpha, bravo }) {
          deltaSpy()
          return alpha + bravo
        },

        echo({ delta, charlie }) {
          echoSpy()
          return delta + charlie
        }
      }
    )

    const second = first.copy({ alpha: 5, name: 'second' })
    const third = second.copy({ charlie: 5, name: 'third' })

    expect(first.delta).equals(3)
    expect(first.echo).equals(6)
    expect(second.echo).equals(10)
    expect(third.echo).equals(12)
    expect(deltaSpy.callCount).equals(2)
    expect(echoSpy.callCount).equals(3)
  })

  it('should create state with shape values and getters', () => {
    const shape = {
      alpha: 1,
      bravo: 2,
      charlie: 3,

      echo() {
        return this.delta + this.charlie
      },

      delta() {
        return this.alpha + this.bravo
      }
    }

    const state = createState(shape)

    expect(state.alpha).to.equal(shape.alpha)
    expect(state.bravo).to.equal(shape.bravo)
    expect(state.charlie).to.equal(shape.charlie)
    expect(state.delta).to.equal(shape.alpha + shape.bravo)
    expect(state.echo).to.equal(shape.alpha + shape.bravo + shape.charlie)
  })

  it('should copy state and change values partially', () => {

    const firstState = createState({
      alpha: 1,
      bravo: 2,

      charlie() {
        return this.alpha + this.bravo
      }
    })
    const secondState = firstState.copy({ alpha: 2 })

    expect(firstState.alpha).to.equal(1)
    expect(firstState.bravo).to.equal(2)
    expect(firstState.charlie).to.equal(3)
    expect(secondState.alpha).to.equal(2)
    expect(secondState.bravo).to.equal(2)
    expect(secondState.charlie).to.equal(4)
  })

  it('should recalculate getter after dependency change', () => {
    let bravoCalls = 0

    const shape = {
      alpha: 1,
      bravo() {
        bravoCalls++
        return this.alpha
      }
    }

    const firstState = createState(shape)

    expect(firstState.bravo).to.equal(1)
    expect(bravoCalls).to.equal(1)

    const secondState = firstState.copy({ alpha: 2 })

    expect(secondState.bravo).to.equal(2)
    expect(secondState.bravo).to.equal(2)
    expect(bravoCalls).to.equal(2)
  })

  it('should not recalculate getter if dependency did not change', () => {
    let charlieCalls = 0

    const shape = {
      alpha: 1,
      bravo: 2,
      charlie({ alpha }) {
        charlieCalls++
        return alpha
      }
    }

    const firstState = createState(shape)
    const secondState = firstState.copy({ bravo: 5 })
    const thirdState = secondState.copy({ bravo: 6, alpha: 1 })

    expect(firstState.charlie).to.equal(shape.alpha)
    expect(secondState.charlie).to.equal(shape.alpha)
    expect(thirdState.charlie).to.equal(shape.alpha)
    expect(charlieCalls).to.equal(1)
  })

  it('should cache getter call after recalculation', () => {
    let bravoCalls = 0

    const shape = {
      alpha: 1,
      bravo() {
        bravoCalls++
        return this.alpha
      }
    }

    const firstState = createState(shape)

    expect(firstState.bravo).to.equal(shape.alpha)
    expect(firstState.bravo).to.equal(shape.alpha)
    expect(bravoCalls).to.equal(1)

    const secondState = firstState.copy({ alpha: 2 })

    expect(secondState.bravo).to.equal(2)
    expect(secondState.bravo).to.equal(2)
    expect(bravoCalls).to.equal(2)
  })
})