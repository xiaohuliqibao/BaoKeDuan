// 引入模块
const fs = require('fs');
const path = require('path');

// 主函数入口const fs = require('fs');

// fs.stat('./test.html', (err, stats) => {
//     if (err) {
//       console.error(err);
//     }
//     // we have access to the file stats in `stats`
//     //console.log(stats);
// });

// console.log(path.resolve('test.html'))
// console.log(path.extname('test.html'))
// console.log(path.dirname('test.html'))
// console.log(path.basename('test.html'))

// console.log(path.resolve())

// const isFile = fileName => {
//     return fs.lstatSync(fileName).isFile();
//   };

// fs.readdirSync('../source/img/food').map((file) => {
//     console.log(file);
//     return path.join('../source/img/food',file);
// }).filter(isFile)


// const components = []

// const files = fs.readdirSync('../source')
// files.forEach(file => {
//     const filePath = path.join('../source',file)
//     const fileStat = fs.statSync(filePath)
//     if(fileStat.isDirectory()){
//         components.push(file)
//     }
// })

// console.log(components)

function showfileinfo(filePath)
{
    console.log(filePath);
    console.log(path.extname(filePath));
    console.log(path.dirname(filePath));
    console.log(path.basename(filePath));
    console.log(fs.statSync(filePath).size);
    console.log(fs.statSync(filePath).ctime.toLocaleDateString());
}

function fileTest(filedir) {
    // let filefullpaths = new Array();
    fs.readdirSync(filedir).map(file => {
            const filePath = path.join(filedir,file)
            const fileStat = fs.statSync(filePath)
            if(fileStat.isDirectory()){
                fileTest(filePath)
            }
            if(fileStat.isFile()){
                console.log(path.resolve(filePath));
                // filefullpaths.push(path.resolve(filePath));
                showfileinfo(path.resolve(filePath))
            }
        })
    // console.log(filefullpaths);
    // return filefullpaths;
}

fileTest('../source')
// console.log(files);
// files.forEach(filePath => {
//     console.log(filePath);
//     console.log(path.extname(filePath));
//     console.log(path.dirname(filePath));
//     console.log(path.basename(filePath));
//     console.log(fs.statSync(filePath).size);
//     console.log(fs.statSync(filePath).ctimeMs);
// })

console.log("Session End");

