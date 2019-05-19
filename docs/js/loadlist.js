'use strict';

window.onload = function () {
  $.getJSON('./db/moduleList.json', (data) => {
    const lists = data.lists;
    let str = '';
    let category = '';
    lists.map(async (item) => {
      category === item.category ? str += '' : str += `<h2 class="doc-chapter-title mdui-text-color-theme">${item.category}</h2>`;
      category = item.category;
      str += `
    <div class="mdui-panel-item">
      <div class="mdui-panel-item-header">
        <div class="mdui-panel-item-title">${item.name}</div>
        <i class="mdui-panel-item-arrow mdui-icon material-icons">keyboard_arrow_down</i>
      </div>
      <div class="mdui-panel-item-body">
        <h3 class="doc-chapter-title mdui-text-color-theme">介绍</h3>
        <p>${item.summary}</p>
        <h3 class="doc-chapter-title mdui-text-color-theme">版本</h3>
        <p>${item.version}</p>
        <h3 class="doc-chapter-title mdui-text-color-theme">下载地址</h3>
        <a href="${item.link}" class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent">点击下载</a>
      </div>
    </div>`
    });
    let addList = $('#moduleList div[class=mdui-panel]');
    addList.append(str);
  })
}