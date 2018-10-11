# egg-squel

[eggjs](https://eggjs.org)的MySQL插件，与官方的egg-mysql不同，本插件基于[squel](https://github.com/hiddentao/squel)构造sql语句，具有更强的拓展性，避免裸写sql语句

## 安装

```bash
$ npm i egg-squel --save
```

## 使用

```js
// {app_root}/config/plugin.js
exports.squel = {
  enable: true,
  package: 'egg-squel',
};
```

## 配置

```js
// {app_root}/config/config.default.js
exports.squel = {
  client: {
    // host
    host: 'localhost',
    // 端口号
    port: '3306',
    // 用户名
    user: 'root',
    // 密码
    password: 'root',
    // 数据库名
    database: 'shop',
    // 其他参数参照https://github.com/mysqljs/mysql
  },
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
};
```

## 用法

### 基本用法

```js
class UserService extends Service {
  async list() {
    const list = await this.app.squel.select().from('user').limit(10);
    const count = await this.app.squel.select().from('user').count();
    return { count, list };
  }
}
```

支持select, insert, update, delete四大类操作，更多用法参照[squel](https://hiddentao.com/squel/)文档

其中count为本插件拓展的用法，用于方便计数

### 直接执行 sql 语句

有时候还是需要直接执行sql语句

```js
await this.app.squel.query('select now() as currentTime');
```

### squel嵌套

query函数可以直接拿到squel实例

```js
await this.app.squel.query(
  squel => squel.select()
    .from("students")
    .join(
        squel.select().field('score').from('results'),
        't'
    )
    .outer_join("expelled")
);

```

## License

MIT © [Wang Sijie](http://sijie.wang)
