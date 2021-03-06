// https://babeljs.io/en/repl 转换工具
class eleCBlog {
  _configpath = "./config.json";
  _articlelists = "./post/lists.json";

  _config = null;
  _atlist = null;

  constructor({ configpath, articlelists }){
    configpath ? this._configpath = configpath : null;
    articlelists ? this._articlelists = articlelists : null;
  }

  getArtcName(){
    let mdpath = location.hash.slice(1);
    if (mdpath) {
      try {
        return decodeURI(mdpath)
      } catch {
        return mdpath
      }
    }
  }

  async init(){
    await fetch(this._configpath, {
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    }).then(t=>t.json()).then(conf=>{
      this._config = conf;
      if (this._config.header.image) {
        document.querySelector(".header").style.background = `url(${this._config.header.image})`;
      }
      document.querySelector('.footer').innerHTML = ""
      let footul = document.createElement("ul");
      footul.className = "footer_ul";
      for (let ft in conf.footer) {
        let footli = document.createElement("li");
        footli.className = 'footer_li';
        footli.innerHTML = `<a class='footer_a' target="_blank" href="${conf.footer[ft]}">${ft}</a>`;
        footul.appendChild(footli);
      }
      document.querySelector('.footer').appendChild(footul);
    }).catch(e=>{
      console.error(e)
      document.querySelector('main').innerHTML('init data error, check the new version <a href="https://github.com/elecV2/eleCBlog">eleCBlog</a>')
    })

    await fetch(this._articlelists, {
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    }).then(t=>t.json()).then(conf=>{
      this._atlist = conf;
    }).catch(e=>{
      console.error(e)
      document.querySelector('main').innerHTML('init data error, check the new version <a href="https://github.com/elecV2/eleCBlog">eleCBlog</a>')
    })
  }

  index(status){
    document.title = this._config.header.title;
    document.querySelector('.main').innerHTML = "";
    document.querySelector(".header_title").innerHTML = this._config.header.title;

    if (status === 404) {
      let div = document.createElement("div");
      div.innerHTML = `404 - 《${this.getArtcName()}》 相关文章已不存在<br><br>最新文章列表：`
      document.querySelector('.main').appendChild(div)
    }
    let listul = document.createElement("ul");
    listul.className = 'articlelists';
    this._atlist.forEach(li=>{
      let listli = document.createElement("li");
      listli.className = 'articletitle';
      listli.innerHTML = `<a target="_blank" href="./#${encodeURI(li)}">${li}</a>`;
      listul.appendChild(listli);
    })
    document.querySelector('.main').appendChild(listul);
  }

  render(){
    let mdname = this.getArtcName();
    if (mdname) {
      document.querySelector('.main').innerHTML = "正在获取文章内容...";
      fetch("./post/" + mdname + '.md', {
        headers: {
          'content-type': 'text/plain;charset=UTF-8'
        }
      }).then(res=>{
        if (res.status === 200) {
          res.text().then(text=>{
            document.title = mdname;
            document.querySelector('.header_title').innerHTML = mdname;
            document.querySelector('.main').innerHTML = marked(text);
          })
        } else {
          console.log(mdname, '文章并不存在')
          this.index(404)
        }
      }).catch(err=>{
        console.error("loading error:", err);
        this.index();
      })
    } else {
      this.index();
    }
  }

  async start(){
    await this.init();
    this.render();
  }
}

let b = new eleCBlog({
  configpath: "./config.json",
  articlelists: "./post/lists.json",
});
b.start();