const axios = require('axios')
const qs = require('qs')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

//定义数据库数据结构
db.defaults({
    posts: [],
    blackLists: [],
  })
  .write()

async function addBlackList(number) {
  await db.get('blackLists').push({
    'id': number
  }).write()
  console.log(`issue ${number} 已处理完毕\n`)
}

async function load() {
  // 需要抓取的 issues 起止数
  const issuesStartNumber = 420;
  const issuesStopNumber = 793;
  const baseUrl = 'https://api.github.com/repos/taichi-framework/TaiChi/issues/';

  //获取数据库 issues 黑名单
  const blackList = await db.get('blackLists').value();

  for (let number = issuesStartNumber; number <= issuesStopNumber; number++) {
    // let number = 484;
    //如果 issues number 不在黑名单中则进行下一步
    if (blackList.find(item => item.id == number) == null) {

      const trueUrl = baseUrl + number;
      const response = await axios({
        method: 'get',
        url: trueUrl,
        params: {
          'client_id': '',
          'client_secret': ''
        }
      });
      const data = response.data;

      if (data.state !== 'open') {

        //被 bot 关闭的 issue 加入黑名单
        if (data.closed_by.login === 'close-issue-app[bot]') {
          addBlackList(number)
        } else {
          if ((/新增模块支持：/).test(data.title) || (/模块更新支持：/).test(data.title)) {

            const body = data.body.replace(/## /g, '').replace(/\r\n+|\n+|：+/g, '<br>');

            const mainBody = body.match(/模块名字<br>(.*?)<br>(.*?)$/) !== null? body.match(/模块名字<br>(.*?)<br>(.*?)$/): body.match(/模块名字(.*?)<br>(.*?)$/);
            const name = mainBody[1].replace(/^<br>+|<br>+$/g, '');
            const description = mainBody[2].replace(/\(请务必给出模块.*?\)/, '');

            const use = description.match(/模块用途(.*?)模/) !== null ? body.match(/模块用途(.*?)模块版本号/)[1].replace(/^<br>+|<br>+$/g, '') : "";
            const changelog = description.match(/模块更新了什么？(.*?)模块安装包/) !== null ? body.match(/模块更新了什么？(.*?)模块安装包/)[1].replace(/^<br>+|<br>+$/g, '') : "";
            const version = description.match(/模块版本号(.*?)模/)[1].replace(/^<br>+|<br>+$/g, '');
            const package = description.match(/模块安装包(.*?)$/)[1].replace(/^<br>+|<br>+$/g, '');
            
            if (db.get('posts').find({
                name: name
              }).value() == null) {
              await db.get('posts').push({
                id: number,
                name,
                use,
                changelog,
                version,
                package
              }).write()
            } else {
              await db.get('posts').find({
                  name: name
                }).assign({
                  id: number,
                  use,
                  changelog,
                  version,
                  package
                })
                .write()
            }
            await addBlackList(number);
          }else {
            addBlackList(number)
          }
        }
      }
    }
  }
}

load()