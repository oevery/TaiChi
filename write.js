const fs = require('fs')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

//降序排列
function compare(property){
  return function(obj1,obj2){
      var value1 = obj1[property];
      var value2 = obj2[property];
      return value2 - value1;
  }
}

async function write() {
  const posts = await db.get('posts').value()
  const sortPosts = await posts.sort(compare('id'));
  const baseUrl = 'https://api.github.com/repos/taichi-framework/TaiChi/issues/';
  const des = '# TaiChi-ModuleList\n\n## 本列表为从太极 issues 列表抓取的信息，不对正确率以及覆盖率作任何保证，仅供尝鲜使用，佛系维护此份列表。';
  fs.appendFileSync('README.md', des, (err) => {if (err) conlose.log(err)});
  sortPosts.map(async (item) => {
    const result = `\n\n<details>
  <summary>${item.name}</summary>
  <h3>模块用途：</h3>
  <p>${item.use}</p>
  <h3>更新日志：</h3>
  <p>${item.changelog}</p>
  <h3>模块版本号：</h3>
  <p>${item.version}</p>
  <h3>模块安装包：</h3>
  <p>${item.package}</p>
  <p>issue URL：<a href="${baseUrl + item.id}"># ${item.id}</a></p>
</details>`;
    fs.appendFileSync('README.md', result, (err) => {if (err) conlose.log(err)});
  })
}

write()