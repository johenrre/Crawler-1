#### 遇到的问题

1. 编码格式问题

   - 可以通过如下可以知道这个页面使用的是 `gbk`编码格式

   - ```html
     <meta http-equiv="Content-Type" content="text/html; charset=gbk" />
     ```

   - 因为node的 `fs`不知吃gbk编码保存，所以引入`iconv-lite`解决编码转换

   - 这里的思路是通过requst返回二进制body，在通过iconv转成uft8

   - ```js
     const options = {
         url: url,
       	// 这里设置为null，body就会是二进制
         encoding: null,
       }
     
     request(options, function(error, response, body) {
       //进行解码
       const bufs = iconv.decode(body, 'GBK')
       //转为utf8
       const b = bufs.toString('utf8')
       writeToFile(path, b)
     })
     
     // 这里为什么要转成二进制，因为默认request包会对返回的数据
     // 做toString()也就是默认会变成utf8格式，所以要二进制
     ```

     

