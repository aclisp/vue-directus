export class URLSearchParams {
  _dict = {};

  constructor(search) {
    search = search || "";
    // support construct object with another URLSearchParams instance
    if (search instanceof URLSearchParams) {
      search = search.toString();
    }
    this._dict = parseToDict(search);
  }

  append(name, value) {
    appendTo(this._dict, name, value);
  }

  toString() {
    var dict = this._dict,
      query = [],
      i,
      key,
      name,
      value;
    for (key in dict) {
      name = encode(key);
      for (i = 0, value = dict[key]; i < value.length; i++) {
        query.push(name + "=" + encode(value[i]));
      }
    }
    return query.join("&");
  }
}

function parseToDict(search) {
  var dict = {};

  if (typeof search === "object") {
    // if `search` is an array, treat it as a sequence
    if (isArray(search)) {
      for (var i = 0; i < search.length; i++) {
        var item = search[i];
        if (isArray(item) && item.length === 2) {
          appendTo(dict, item[0], item[1]);
        } else {
          throw new TypeError(
            "Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements"
          );
        }
      }
    } else {
      for (var key in search) {
        // eslint-disable-next-line no-prototype-builtins
        if (search.hasOwnProperty(key)) {
          appendTo(dict, key, search[key]);
        }
      }
    }
  } else {
    // remove first '?'
    if (search.indexOf("?") === 0) {
      search = search.slice(1);
    }

    var pairs = search.split("&");
    for (var j = 0; j < pairs.length; j++) {
      var value = pairs[j],
        index = value.indexOf("=");

      if (-1 < index) {
        appendTo(
          dict,
          decode(value.slice(0, index)),
          decode(value.slice(index + 1))
        );
      } else {
        if (value) {
          appendTo(dict, decode(value), "");
        }
      }
    }
  }

  return dict;
}

function appendTo(dict, name, value) {
  var val =
    typeof value === "string"
      ? value
      : value !== null &&
        value !== undefined &&
        typeof value.toString === "function"
      ? value.toString()
      : JSON.stringify(value);

  // #47 Prevent using `hasOwnProperty` as a property name
  if (hasOwnProperty(dict, name)) {
    dict[name].push(val);
  } else {
    dict[name] = [val];
  }
}

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function isArray(val) {
  return !!val && "[object Array]" === Object.prototype.toString.call(val);
}

function encode(str) {
  var replace = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\x00",
  };
  return encodeURIComponent(str).replace(
    // eslint-disable-next-line no-useless-escape
    /[!'\(\)~]|%20|%00/g,
    function (match) {
      return replace[match];
    }
  );
}

function decode(str) {
  return str
    .replace(/[ +]/g, "%20")
    .replace(/(%[a-f0-9]{2})+/gi, function (match) {
      return decodeURIComponent(match);
    });
}
