export const later = (delay: number) => {
  let timer = 0
  let reject: (() => void) | null = null
  const promise = new Promise((resolve, _reject) => {
    reject = _reject
    timer = setTimeout(resolve, delay)
  })
  return {
    get promise() {
      return promise
    },
    cancel() {
      if (timer) {
        clearTimeout(timer)
        timer = 0
        reject?.()
        reject = null
      }
    },
  }
}
