"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
        document.querySelector('.footer').innerHTML = "";
        var footul = document.createElement("ul");
        footul.className = "footer_ul";

        for (var ft in conf.footer) {
          var footli = document.createElement("li");
          footli.className = 'footer_li';
          footli.innerHTML = "<a class='footer_a' href=\"".concat(conf.footer[ft], "\">").concat(ft, "</a>");
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
    value: function index() {
      if (this._config.header.image) {
        document.querySelector(".header").style.background = "url(".concat(this._config.header.image, ")");
      }

      document.title = this._config.header.title;
      document.querySelector(".header_title").innerHTML = this._config.header.title;
      var listul = document.createElement("ul");
      listul.className = 'articlelists';

      this._atlist.forEach(function (li) {
        var listli = document.createElement("li");
        listli.className = 'articletitle';
        listli.innerHTML = "<a target=\"_blank\" href=\"/#".concat(encodeURI(li), "\">").concat(li, "</a>");
        listul.appendChild(listli);
      });

      document.querySelector('.main').appendChild(listul);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var mdpath = location.hash.slice(1);
      var mdname = decodeURI(mdpath);
      document.querySelector('.main').innerHTML = "";

      if (mdpath) {
        fetch("./post/" + mdname + '.md', {
          headers: {
            'content-type': 'text/plain;charset=UTF-8'
          }
        }).then(function (res) {
          return res.text();
        }).then(function (text) {
          document.title = mdname;
          document.querySelector('.header_title').innerHTML = mdname;
          document.querySelector('.main').innerHTML = marked(text);
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