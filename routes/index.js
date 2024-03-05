var express = require('express');
var sharp = require('sharp');
var multer = require('multer');
var fs = require('fs');
var yaml = require('js-yaml');
const { exec } = require('child_process');
const { count } = require('console');

var router = express.Router();

var uploadDest = multer({dest: './tmp/'})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/bootstrap', function(req, res, next) {
  res.render('bootstrapindex', { title: 'Bootstrap' });
});


router.get('/test',function (req,res,next) {
  const users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ];

  // 构建响应对象
  const response = {
    status: 'success',
    code: 2000, 
    data: users,
    message: 'Success'
  };

  res.json(response);
})

router.post('/login',function (req,res,next){
  const number = req.body.number
  const code = req.body.code
  if(number == '9303'&& code == '123321'){
    res.json({
      status: 'success',
      code: 2000, 
      data: req.body,
      message: 'Success'
    })
  }
  else{
    res.json({
      status: 'error',
      code: 9999, 
      data: req.body,
      message: 'Error'
    })
  }
  
}
)

/*  */
router.get('/uploadpath',function (req,res,next) {
  try {
    const yamlData = fs.readFileSync('./source/_data/album.yml', 'utf8');
    const parsedData = yaml.load(yamlData);
    const photoPath = parsedData.map(item => item.path_name).flat();
    // 查找path_name为/foodPhoto的数据
    return res.json({success: true,code: 2000, data: photoPath,message: 'success'});
  }catch (err) {
    console.error('无法读取YAML文件：', err);
    return res.json({success: false,code: 9901, data: '无法读取YAML文件：',message: 'error'});
  }
})
/*upload single file  */
router.post('/upload/:path?',uploadDest.single('image'), function(req, res, next) {
  const filenameNew = new Date().getTime();
  sharp(req.file.path)
    .webp({ quality: 80 })
    .toFile(`./source/img/${req.params.path}/${filenameNew}.webp`, (err, info) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log(info);
        //修改blog中的album.yml
        try {
          const yamlData = fs.readFileSync('./source/_data/album.yml', 'utf8');
          const parsedData = yaml.load(yamlData);
          // 查找path_name为/foodPhoto的数据
          parsedData.find(item => item.path_name === `/${req.params.path}Photo`).album_list[0].image.push(`https://resources.qibao.icu/img/${req.params.path}/${filenameNew}.webp`);
          const updatedYamlData = yaml.dump(parsedData);  
          fs.writeFileSync('./source/_data/album.yml', updatedYamlData, 'utf8');
          //更新blog
          //  exec('zsh && cd .. && source /etc/zprofile &&  ../node_modules/hexo/bin/hexo clean && ../node_modules/hexo/bin/hexo g', (error, stdout, stderr) => {
          //    if (error) {
          //      console.error(`执行Shell命令时发生错误：${error.message}`);
          //    }
          //  });
          const imageInfo = {path: req.params.path,name:filenameNew+'.webp'}
          return res.json({success: true,code: 2000, data: imageInfo,message: 'Success'});
        }catch (err) {
          console.error('无法读取YAML文件：', err);
          return res.json({success: false,code: 9901, data: '上传文件失败',message: 'error'});
        }
        
      }
    });
});

/*upload multer file  */
router.post('/uploads/:path?',uploadDest.array('images',9), function(req, res, next) {
  req.files.forEach(file => {
    const filenameNew = new Date().getTime();
    sharp(file.path)
      .webp({ quality: 80 })
      .toFile(`./source/img/${req.params.path}/${filenameNew}.webp`, (err, info) => {
        if (err) {
          console.error(err);
          //res.status(500).send('Internal Server Error');
        } else {
          const yamlData = fs.readFileSync('./source/_data/album.yml', 'utf8');
          const parsedData = yaml.load(yamlData);
          // 查找path_name为/foodPhoto的数据
          parsedData.find(item => item.path_name === `/${req.params.path}Photo`).album_list[0].image.push(`https://resources.qibao.icu/img/${req.params.path}/${filenameNew}.webp`);
          const updatedYamlData = yaml.dump(parsedData);  
          fs.writeFileSync('./source/_data/album.yml', updatedYamlData, 'utf8');
          console.log(info);
          //res.send('Images uploaded and converted to webp');
        }
      });
  });
  return res.json({success: true,code: 2000, data: null,message: 'Success'});
});


module.exports = router;
