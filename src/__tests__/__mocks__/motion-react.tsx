/**
 * Mock for motion/react in tests.
 * Renders plain HTML elements with all props forwarded (stripping motion-specific ones).
 * This lets jsdom render Motion components without WAAPI support.
 */
import React, { forwardRef, type ReactNode } from 'react'

const MOTION_PROPS = new Set([
  'initial', 'animate', 'exit', 'transition', 'variants',
  'whileHover', 'whileTap', 'whileFocus', 'whileDrag', 'whileInView',
  'viewport', 'layout', 'layoutId', 'onAnimationStart', 'onAnimationComplete',
  'onUpdate', 'dragConstraints', 'dragElastic', 'drag',
  'onDragEnd', 'onDragStart', 'dragSnapToOrigin',
])

function stripMotionProps(props: Record<string, unknown>) {
  const clean: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    if (!MOTION_PROPS.has(key)) {
      clean[key] = value
    }
  }
  return clean
}

function createMotionComponent(tag: string) {
  return forwardRef(function MotionComponent(
    { children, ...props }: { children?: ReactNode; [key: string]: unknown },
    ref: React.Ref<HTMLElement>,
  ) {
    const clean = stripMotionProps(props)
    return React.createElement(tag, { ...clean, ref }, children)
  })
}

export const motion = new Proxy(
  {} as Record<string, ReturnType<typeof createMotionComponent>>,
  {
    get(target, prop: string) {
      if (!target[prop]) {
        target[prop] = createMotionComponent(prop)
      }
      return target[prop]
    },
  },
)

/** AnimatePresence: just render children */
export function AnimatePresence({ children }: { children?: ReactNode }) {
  return <>{children}</>
}

/** useInView: configurable — returns true by default (matches IO mock behavior) */
let _inViewDefault = true
export function __setInViewDefault(val: boolean) {
  _inViewDefault = val
}
export function useInView() {
  return _inViewDefault
}

/** useAnimation: no-op controls */
export function useAnimation() {
  return { start: () => Promise.resolve(), stop: () => {}, set: () => {} }
}

/** useMotionValue stub */
export function useMotionValue(initial: number) {
  return { get: () => initial, set: () => {}, on: () => () => {} }
}

/** useTransform stub */
export function useTransform(_value: unknown, _input: number[], output: number[]) {
  return { get: () => output[0], set: () => {}, on: () => () => {} }
}

/** useSpring stub */
export function useSpring(value: unknown) {
  return value
}

/** stagger helper */
export function stagger(delay: number) {
  return delay
}
