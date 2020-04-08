class eleCBlog {
  _configpath = "./config.json";
  _articlelists = "./post/_lists.json";

  _config = null;
  _atlist = null;

  constructor({ configpath, articlelists }){
    configpath ? this._configpath = configpath : null;
    articlelists ? this._articlelists = articlelists : null;
  }

  async init(){
    await fetch(this._configpath, {
      headers: {
        'content-type': 'application/json;charset=utf-8'
      }
    }).then(t=>t.json()).then(conf=>{
      this._config = conf;
      document.querySelector('.footer').innerHTML = ""
      let footul = document.createElement("ul");
      footul.className = "footer_ul";
      for (let ft in conf.footer) {
        let footli = document.createElement("li");
        footli.className = 'footer_li';
        footli.innerHTML = `<a class='footer_a' href="${conf.footer[ft]}">${ft}</a>`;
        footul.appendChild(footli);
      }
      document.querySelector('.footer').appendChild(footul);
    })

    await fetch(this._articlelists, {
      headers: {
        'content-type': 'application/json;charset=utf-8'
      }
    }).then(t=>t.json()).then(conf=>{
      this._atlist = conf;
    })
  }

  index(){
    if (this._config.header.image) {
      document.querySelector(".header").style.background = `url(${this._config.header.image})`;
    }
    document.title = this._config.header.title;
    document.querySelector(".header_title").innerHTML = this._config.header.title;

    let listul = document.createElement("ul");
    listul.className = 'articlelists';
    this._atlist.forEach(li=>{
      let listli = document.createElement("li");
      listli.className = 'articletitle';
      listli.innerHTML = `<a target="_blank" href="./${encodeURI(li)}">${li}</a>`;
      listul.appendChild(listli);
    })
    document.querySelector('.main').appendChild(listul);
  }

  render(){
    let mdpath = location.pathname.slice(1);
    let mdname = decodeURI(mdpath);
    document.querySelector('.main').innerHTML = "";
    if (mdpath) {
      fetch("./post/" + mdname + '.md').then(res=>res.text()).then(text=>{
        document.title = mdname;
        document.querySelector('.header_title').innerHTML = mdname;
        document.querySelector('.main').innerHTML = marked(text);
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
  articlelists: "./post/_lists.json",
});
b.start();