const path = require('path');
const fs = require('fs');
const os = require('os');
const util = require('util');
const child_process = require('child_process');
const dtime = require('time-formater');

const exec = util.promisify(child_process.exec);

const getAbsoluteAdr = url => path.join(__dirname, url);

function checkExists(adress = '', content = '') {
  try {
    const _path = path.join(__dirname, adress);
    const _arr = _path.split(path.sep).filter(i => i);
    let url = '';
    _arr.forEach((it, idx) => {
      if (/^win/.test(os.platform()) && !idx) {
        url += `${it}`;
      } else {
        url += `/${it}`;
      }
      
      // 如果不存在则创建
      if (!fs.existsSync(url)) {
        // 最后一个是文件
        if (idx === _arr.length - 1) {
          fs.writeFileSync(url, content, 'utf8');
        } else {
          // 创建文件夹
          fs.mkdirSync(url);
        }
      } else {
        // 如果存在文件，则给文件加上时间戳
        if (idx === _arr.length - 1) {
          const _fileArr = url.split('.');
          _fileArr.splice(_fileArr.length - 2, 1, `${_fileArr[_fileArr.length - 2]}-${new Date().getTime()}`);
          fs.writeFileSync(`${_fileArr.join('.')}`, content, 'utf8');
        }
      }
    })
  } catch (error) {
    console.log(error.message || error);
  }
}

function copyHtmlToRoot(adress, to) { // 复制html文件到指定目录
  let files = [];
  if (fs.existsSync(to)) { // 文件是否存在 如果不存在则创建
      files = fs.readdirSync(adress);
      files.forEach(function (file, index) {
          var targetPath = adress + "/" + file;
          var toPath = to + '/' + file;
          // 如果不是文件夹并且包含.html
          if (!fs.statSync(targetPath).isDirectory() && /\.html/.test(file)) {
            fs.copyFileSync(targetPath, toPath);   
          }
      });
  } else {
      fs.mkdirSync(to);
      copyHtmlToRoot(adress, to);
  }
}

function setLevel(str) {
  const arr = str.split(',');
  let result = '';
  arr.forEach((it,idx) => {
    if (idx === arr.length - 1) {
      result += ` - ${it}`;
    } else {
      result += ` - ${it}
`;
    }
  })
  return result
}

function createNewBlog({
  title,
  categories,
  tags,
  content
}) {
  return new Promise(async (resolve, reject) => {
    try {
      const date = dtime().format('YYYY-MM-DD');
      const dates = date.split('-');
      const fileName = `${date}.md`;
      console.log('正在创建博客md文件');
      checkExists(`../docs/${dates[0]}/${dates[1]}/${fileName}`,
`---
title: ${title}
date: ${date}
categories:
${setLevel(categories)}
tags:
${setLevel(tags)}
---

${content}
`
      )
      console.log('正在打包blog静态资源');
      await exec(`vuepress build docs`, { cwd: getAbsoluteAdr('../') });
      console.log('正在复制打包后的html文件到根目录');
      copyHtmlToRoot(getAbsoluteAdr('../dist'), getAbsoluteAdr('../'));
      console.log('正在提交代码到github');
      await exec(`git add .`, { cwd: getAbsoluteAdr('../') });
      await exec(`git commit -m "feat: 新增一篇名为'${title}'的博客"`, { cwd: getAbsoluteAdr('../') });
      await exec(`git push origin master`, { cwd: getAbsoluteAdr('../') });
      resolve(true);
    } catch (err) {
      reject(err.message || err);
    }
  })
}

module.exports = {
  createNewBlog
}