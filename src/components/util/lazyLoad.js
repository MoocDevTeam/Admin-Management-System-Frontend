import { lazy } from "react"

function lazyLoad(componentPath) {
  return lazy(() => import(`${componentPath}`))
}

export default lazyLoad
