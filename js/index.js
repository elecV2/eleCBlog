"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// https://babeljs.io/en/repl 转换工具
var eleCBlog = /*#__PURE__*/function () {
  function eleCBlog(_ref) {
    var configpath = _ref.configpath,
        articlelists = _ref.articlelists;

    _classCallCheck(this, eleCBlog);

    _defineProperty(this, "_configpath", "./config.json");

    _defineProperty(this, "_articlelists", "./post/lists.json");

    _defineProperty(this, "_config", null);

    _defineProperty(this, "_atlist", null);

    configpath ? this._configpath = configpath : null;
    articlelists ? this._articlelists = articlelists : null;
  }

  _createClass(eleCBlog, [{
    key: "getArtcName",
    value: function getArtcName() {
      var mdpath = location.hash.slice(1);

      if (mdpath) {
        try {
          return decodeURI(mdpath);
        } catch (_unused) {
          return mdpath;
        }
      }
    }
  }, {
    key: "init",
    value: async function init() {
      var _this = this;

      await fetch(this._configpath, {
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        }
      }).then(function (t) {
        return t.json();
      }).then(function (conf) {
        _this._config = conf;

        if (_this._config.header.image) {
          document.querySelector(".header").style.background = "url(".concat(_this._config.header.image, ")");
        }

        document.querySelector('.footer').innerHTML = "";
        var footul = document.createElement("ul");
        footul.className = "footer_ul";

        for (var ft in conf.footer) {
          var footli = document.createElement("li");
          footli.className = 'footer_li';
          footli.innerHTML = "<a class='footer_a' target=\"_blank\" href=\"".concat(conf.footer[ft], "\">").concat(ft, "</a>");
          footul.appendChild(footli);
        }

        document.querySelector('.footer').appendChild(footul);
      }).catch(function (e) {
        console.error(e);
        document.querySelector('main').innerHTML('init data error, check the new version <a href="https://github.com/elecV2/eleCBlog">eleCBlog</a>');
      });
      await fetch(this._articlelists, {
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        }
      }).then(function (t) {
        return t.json();
      }).then(function (conf) {
        _this._atlist = conf;
      }).catch(function (e) {
        console.error(e);
        document.querySelector('main').innerHTML('init data error, check the new version <a href="https://github.com/elecV2/eleCBlog">eleCBlog</a>');
      });
    }
  }, {
    key: "index",
    value: function index(status) {
      document.title = this._config.header.title;
      document.querySelector('.main').innerHTML = "";
      document.querySelector(".header_title").innerHTML = this._config.header.title;

      if (status === 404) {
        var div = document.createElement("div");
        div.innerHTML = "404 - \u300A".concat(this.getArtcName(), "\u300B \u76F8\u5173\u6587\u7AE0\u5DF2\u4E0D\u5B58\u5728<br><br>\u6700\u65B0\u6587\u7AE0\u5217\u8868\uFF1A");
        document.querySelector('.main').appendChild(div);
      }

      var listul = document.createElement("ul");
      listul.className = 'articlelists';

      this._atlist.forEach(function (li) {
        var listli = document.createElement("li");
        listli.className = 'articletitle';
        listli.innerHTML = "<a href=\"#".concat(encodeURI(li), "\">").concat(li, "</a>");
        listul.appendChild(listli);
      });

      document.querySelector('.main').appendChild(listul);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var mdname = this.getArtcName();

      if (mdname) {
        document.querySelector('.main').innerHTML = "正在获取文章内容...";
        fetch("./post/" + mdname + '.md', {
          headers: {
            'content-type': 'text/plain;charset=UTF-8'
          }
        }).then(function (res) {
          if (res.status === 200) {
            res.text().then(function (text) {
              document.title = mdname;
              document.querySelector('.header_title').innerHTML = mdname;
              document.querySelector('.main').innerHTML = marked(text);
            });
          } else {
            console.log(mdname, '文章并不存在');

            _this2.index(404);
          }
        }).catch(function (err) {
          console.error("loading error:", err);

          _this2.index();
        });
      } else {
        this.index();
      }
    }
  }, {
    key: "start",
    value: async function start() {
      await this.init();
      this.render();
    }
  }]);

  return eleCBlog;
}();

var b = new eleCBlog({
  configpath: "./config.json",
  articlelists: "./post/lists.json"
});
b.start();

/***** hashchange ******/
addEventListener('hashchange', event => {
  b.render();
});
/***** hashchange end */