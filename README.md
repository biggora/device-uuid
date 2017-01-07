# device-uuid
Fast browser device uuid generation plugin. The plugin based on [express-useragent](https://github.com/biggora/express-useragent) and written in pure JavaScript, no dependencies.

## Installation

```bash
 $ bower install device-uuid --save
```
or
```bash
 $ npm install device-uuid --save
```

## Usage overview

Include files in your HTML. The minimum required for this plugin are:

    <script src="/path/to/device-uuid.js" type="text/javascript"></script>

#### Execute the plugin:
automatically create not browser depended uuid:
```javascript
    var uuid = new DeviceUUID().get();
```
as a result example:
```
    e9dc90ac-d03d-4f01-a7bb-873e14556d8e
```

custom device uuid generation:
```javascript
var du = new DeviceUUID().parse();
    var dua = [
        du.language,
        du.platform,
        du.os,
        du.cpuCores,
        du.isAuthoritative,
        du.silkAccelerated,
        du.isKindleFire,
        du.isDesktop,
        du.isMobile,
        du.isTablet,
        du.isWindows,
        du.isLinux,
        du.isLinux64,
        du.isMac,
        du.isiPad,
        du.isiPhone,
        du.isiPod,
        du.isSmartTV,
        du.pixelDepth,
        du.isTouchScreen
    ];
    var uuid = du.hashMD5(dua.join(':'));
```


module provides details such as the following:

```js
{
  "isMobile":false,
  "isDesktop":true,
  "isBot":false,
  .....
  "browser":"Chrome",
  "version":"17.0.963.79",
  "os":"Windows 7",
  "platform":"Microsoft Windows",
  "source":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.79..."
}

```

### LICENSE

[MIT](LICENSE)
