const xlsx = require('xlsx');
const fs = require('fs');

let workbook = xlsx.readFile('./test.xlsx');
let sheetNames = workbook.SheetNames;
const result = {};
sheetNames.forEach(it => {
  result[it] = getDateArr(it);
});

function getDateArr(sheetName) {
  const result = [];
  let sheet1 = workbook.Sheets[sheetName];
  let range = xlsx.utils.decode_range(sheet1['!ref']);

  //循环获取单元格值
  for (let R = range.s.r; R <= range.e.r; ++R) {
    let date = '', code = '';
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let cell_address = { c: C, r: R }; //获取单元格地址
      let cell = xlsx.utils.encode_cell(cell_address); //根据单元格地址获取单元格
      //获取单元格值
      if (sheet1[cell] && R) {
        const value = sheet1[cell].v;
        if (C) {
          code = value;
        } else {
          if (value && typeof value === 'number') {
            const d = new Date(1900, 0, value - 1);
            date = parseTime(d);
          }
        }
      }
    }
    if (R) {
      result.push({
        date,
        code
      });
    }
  }
  return result;
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
function parseTime(time, cFormat = '{y}-{m}-{d}') {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

const content = `module.exports = ${JSON.stringify(result)}`;
const opt = {
  flag: 'w', // a：追加写入；w：覆盖写入
}

fs.writeFile('codeData.js', content, opt, (err) => {
  if (err) {
    console.error(err)
  }
})
