const fs = require('fs')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

async function write() {
  const posts = await db.get('posts').value()
  const baseUrl = 'https://api.github.com/repos/taichi-framework/TaiChi/issues/';
  const des = '# TaiChi-ModuleList\n\n## 本列表为从太极 issues 列表抓取的信息，不对正确率以及覆盖率作任何保证，仅供尝鲜使用，佛系维护此份列表。';
  fs.appendFileSync('README.md', des, (err) => {if (err) conlose.log(err)});
  posts.map(async (item) => {
    const result = `\n\n<details>
  <summary>${item.name}</summary>
  <p>模块用途：${item.use}</p>
  <p>更新日志：${item.changelog}</p>
  <p>模块版本号：${item.version}</p>
  <p>模块安装包：${item.package}</p>
  <p>issue url：<a url="${baseUrl + item.id}"># ${item.id}</a></p>
</details>`;
    fs.appendFileSync('README.md', result, (err) => {if (err) conlose.log(err)});
  })
}

write()