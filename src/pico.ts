import { h, Component } from "preact"

type createComponent = typeof h

interface Styles {
  [key: string]: any
}

type StyleProps = (props: any) => Styles

type Rule = string
type cssFunction = (styles: Styles | StyleProps) => string
// type styledComponent

////////

let _id = 0
let sheet = document.head.appendChild(document.createElement("style"))
  .sheet as CSSStyleSheet
let cache: { [key: string]: Rule } = {}

function hyphenate(str: string) {
  return str.replace(/[A-Z]/g, "-$&").toLowerCase()
}

function wrap(stringToWrap: string, wrapper: string) {
  return wrapper + "{" + stringToWrap + "}"
}

export function css(styles: Styles | StyleProps): string {
  const rules = parse(styles)
  const key = rules.join("")
  return cache[key] || (cache[key] = createStyle(rules, "."))
}

function parse(obj: Styles, isInsideObj = true): string[] {
  let arr: string[] = []
  for (let prop in obj) {
    let value = obj[prop]
    prop = hyphenate(prop)

    if (value.sub) value = [value]
    if (value.forEach) {
      // an array
      value.forEach((v: string) => (arr[0] += prop + ":" + v + ";"))
    } else {
      // an object
      prop = prop.replace(/&/g, "")
      arr.push(wrap(parse(value, 1 && !/^@/.test(prop)).join(""), prop))
    }
  }
  if (!isInsideObj) arr[0] = wrap(arr[0], "")
  return arr
}

function createStyle(rules: string[], prefix: string) {
  var id: string = "p" + _id++
  var name: string = prefix + id
  rules.forEach(function(rule) {
    if (/^@/.test(rule)) {
      // COULDDO factor out regex
      var start = rule.indexOf("{") + 1
      rule = rule.slice(0, start) + name + rule.slice(start)
    } else {
      rule = name + rule
    }
    sheet.insertRule(rule, sheet.cssRules.length)
  })
  return id
}

// function style(element: string | Component) {
//   return function(decls: Styles) {
//     return function(attributes: any, children: any) {
//       attributes = attributes || {}
//       children = attributes.children || children
//       var nodeDecls = typeof decls == "function" ? decls(attributes) : decls
//       attributes.class = [css(nodeDecls), attributes.class]
//         .filter(Boolean)
//         .join(" ")
//       return h(element, attributes, children)
//     }
//   }
// }

// export function keyframes(obj) {
//   var rule = wrap(parse(obj, 1).join(""), "")
//   return createStyle([rule], "@keyframes ")
// }
