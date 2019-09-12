"use strict";
exports.__esModule = true;
// type styledComponent
////////
var _id = 0;
var sheet = document.head.appendChild(document.createElement("style"))
    .sheet;
var cache = {};
function hyphenate(str) {
    return str.replace(/[A-Z]/g, "-$&").toLowerCase();
}
function wrap(stringToWrap, wrapper) {
    return wrapper + "{" + stringToWrap + "}";
}
function css(styles) {
    var rules = parse(styles);
    var key = rules.join("");
    return cache[key] || (cache[key] = createStyle(rules, "."));
}
exports.css = css;
function parse(obj, isInsideObj) {
    if (isInsideObj === void 0) { isInsideObj = true; }
    var arr = [];
    var _loop_1 = function (prop) {
        var value = obj[prop];
        prop = hyphenate(prop);
        if (value.sub)
            value = [value];
        if (value.forEach) {
            // an array
            value.forEach(function (v) { return (arr[0] += prop + ":" + v + ";"); });
        }
        else {
            // an object
            prop = prop.replace(/&/g, "");
            arr.push(wrap(parse(value, 1 && !/^@/.test(prop)).join(""), prop));
        }
    };
    for (var prop in obj) {
        _loop_1(prop);
    }
    if (!isInsideObj)
        arr[0] = wrap(arr[0], "");
    return arr;
}
function createStyle(rules, prefix) {
    var id = "p" + _id++;
    var name = prefix + id;
    rules.forEach(function (rule) {
        if (/^@/.test(rule)) {
            // COULDDO factor out regex
            var start = rule.indexOf("{") + 1;
            rule = rule.slice(0, start) + name + rule.slice(start);
        }
        else {
            rule = name + rule;
        }
        sheet.insertRule(rule, sheet.cssRules.length);
    });
    return id;
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
