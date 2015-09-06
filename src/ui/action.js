const m = require("mithril");

export default function(title, click) {
    return m("a", {"href": "#", onclick: click}, title);
};
