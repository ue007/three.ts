## Tech Stack
开发语言： Typescript
语法检测： eslint
打包工具： Webpack
第三方库： Three.js
代码管理： Git
数据模拟: Mock
部署： 

# 前端工程化步骤

## 环境检测

### 安装Node.js

查看node是否安装

```
node -v
```



## 创建项目

### 创建一个文件夹

```
mkdir template
```



### 切换至template目录

```
cd template
```



### 初始化项目

```
npm init
```



自动生成package.json文件，内容如下：

```javascript
{
  "name": "ts-template",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "ts"
  ],
  "author": "jeff.fu",
  "license": "ISC"
}

```



### 创建文件

- 在src的目录下，创建./src/index.ts
- 在src的目录下，创建index.html



## 配置TypeScript

安装typescript

```javascript
cnpm install typescript --save-dev
```

**typescript** 编译器，用来将ts文件编译为js文件。



### 初始化tsconfig

```javascript
tsc --init
```

生成tsconfig.json

```
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Basic Options */
    // "incremental": true,                         /* Enable incremental compilation */
    "target": "es5",                                /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */
    "module": "commonjs",                           /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    // "lib": [],                                   /* Specify library files to be included in the compilation. */
    // "allowJs": true,                             /* Allow javascript files to be compiled. */
    // "checkJs": true,                             /* Report errors in .js files. */
    // "jsx": "preserve",                           /* Specify JSX code generation: 'preserve', 'react-native', 'react', 'react-jsx' or 'react-jsxdev'. */
    // "declaration": true,                         /* Generates corresponding '.d.ts' file. */
    // "declarationMap": true,                      /* Generates a sourcemap for each corresponding '.d.ts' file. */
    // "sourceMap": true,                           /* Generates corresponding '.map' file. */
    // "outFile": "./",                             /* Concatenate and emit output to single file. */
    // "outDir": "./",                              /* Redirect output structure to the directory. */
    // "rootDir": "./",                             /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                           /* Enable project compilation */
    // "tsBuildInfoFile": "./",                     /* Specify file to store incremental compilation information */
    // "removeComments": true,                      /* Do not emit comments to output. */
    // "noEmit": true,                              /* Do not emit outputs. */
    // "importHelpers": true,                       /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,                  /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,                     /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true,                                 /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                       /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,                    /* Enable strict null checks. */
    // "strictFunctionTypes": true,                 /* Enable strict checking of function types. */
    // "strictBindCallApply": true,                 /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,        /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                      /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                        /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                      /* Report errors on unused locals. */
    // "noUnusedParameters": true,                  /* Report errors on unused parameters. */
    // "noImplicitReturns": true,                   /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,          /* Report errors for fallthrough cases in switch statement. */
    // "noUncheckedIndexedAccess": true,            /* Include 'undefined' in index signature results */
    // "noPropertyAccessFromIndexSignature": true,  /* Require undeclared properties from index signatures to use element accesses. */

    /* Module Resolution Options */
    // "moduleResolution": "node",                  /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    // "baseUrl": "./",                             /* Base directory to resolve non-absolute module names. */
    // "paths": {},                                 /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                              /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                             /* List of folders to include type definitions from. */
    // "types": [],                                 /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,        /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true,                        /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,                    /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,                /* Allow accessing UMD globals from modules. */

    /* Source Map Options */
    // "sourceRoot": "",                            /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                               /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,                     /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                       /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,              /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,               /* Enables experimental support for emitting type metadata for decorators. */

    /* Advanced Options */
    "skipLibCheck": true,                           /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true        /* Disallow inconsistently-cased references to the same file. */
  }
}

```

tsconfig.json配置可以参考：https://typescript.bootcss.com/tsconfig-json.html

## 配置Webpack

### 安装webpack 和webpack-cli

```
cnpm install webpack webpack-cli --save-dev
```

**webpack** 是一个用于现代 JavaScript 应用程序的 *静态模块打包工具*。

**webpack-cli** 提供了许多命令来使 webpack 的工作变得简单。



### 安装webpack dev server

```
cnpm install --save-dev webpack-dev-server 
```

[webpack-dev-server](https://github.com/webpack/webpack-dev-server) 可用于快速开发应用程序，支持热插拔。



### 安装ts-loader

```
cnpm install --save-dev ts-loader
```

**ts-loader**: This is the TypeScript loader for webpack，解析ts文件转换成浏览器可以识别的文件



### 配置Webpack.config.js

build/webpack.config.js文件内容如下：

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin }  = require('clean-webpack-plugin')
//使用node的模块
module.exports = {
    //这就是我们项目编译的入口文件
    entry: "./src/index.ts",
    output: {
        filename: "main.js"
    },
    resolve: {
        extensions: ['.ts','tsx','.js']
    },
    //这里可以配置一些对指定文件的处理
    //这里匹配后缀为ts或者tsx的文件
    //使用exclude来排除一些文件
    module:{
        rules:[
            {
                test:/\.tsx?$/,
                use:'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    //这个参数就可以在webpack中获取到了
    devtool: process.env.NODE_ENV === 'production'? false : 'inline-source-map',
    devServer:{
        //这个本地开发环境运行时是基于哪个文件夹作为根目录
        contentBase:'./dist',
        //当你有错误的时候在控制台打出
        stats: 'errors-only',
        //不启动压缩
        compress: false,
        host: 'localhost',
        port: 8081
    },
    //这里就是一些插件
    plugins:[
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['./dist']
        }),
        new HtmlWebpackPlugin({
            template: './src/template/index.html'
        })
    ]
}
```

webpack配置参考链接：https://webpack.docschina.org/configuration/



### 其他插件

#### **html-webpack-plugin** 

HTML Webpack Plugin， Plugin that simplifies creation of HTML files to serve your bundles。

安装脚本

```javascript
  npm i --save-dev html-webpack-plugin@latest
```



#### cross-env

用于设置环境变量的,方便设置开发环境和生产环境

```
cnpm install cross-env --save-dev
```

#### clean-webpack-plugin

clean-webpack-plugin 能清理一些指定的文件夹

```javascript
cnpm install clean-webpack-plugin html-webpack-plugin --save-dev
```



## 配置Eslint

ESLint 是一个代码检查工具，主要用来发现代码错误、统一代码风格，目前已被广泛的应用于各种 JavaScript 项目中。

TypeScript 除了是一个编译 ts 文件的工具以外，还可以作为一个静态代码检查工具使用。TypeScript 会对文件进行语法解析，如果遇到一些语法错误，或使用了未定义的变量，则会报错。

ESLint 也会对文件进行语法解析，它可以对一些代码风格进行约束，发现未定义的变量，但是对于错误的属性或方法引用，却无能为力。



### 安装eslint

cnpm 安装eslint脚本：

```
cnpm install eslint --save-dev
```



### 初始化

```
npx eslint --init
```



### 安装插件

```
cnpm install @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest --save-dev
```

**@typescript-eslint/eslint-plugin**: An ESLint plugin which provides lint rules for TypeScript codebases. https://www.npmjs.com/package/@typescript-eslint/eslint-plugin

**@typescript-eslint/parser**: An ESLint parser which leverages [TypeScript ESTree](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/typescript-estree) to allow for ESLint to lint TypeScript source code. https://www.npmjs.com/package/@typescript-eslint/parser



**eslint-plugin-import**: This plugin intends to support linting of ES2015+ (ES6+) import/export syntax, and prevent issues with misspelling of file paths and import names. All the goodness that the ES2015+ static module syntax intends to provide, marked up in your editor.https://www.npmjs.com/package/eslint-plugin-import

```
cnpm install eslint-plugin-import --save-dev
```







### 代码规范（airbnb）

选择使用airbnb的规范：

```javascript
 cnpm install eslint-config-airbnb-typescript@latest --save-dev
```

参考：[eslint的规则](https://eslint.org/docs/rules/) 、[typescript-eslint的规则](https://github.com/typescript-eslint/typescript-eslint/tree/v1.7.0/packages/eslint-plugin/docs/rules)、[airbnb的规则](https://github.com/airbnb/javascript)

### 修改规范

根据自己喜好，适当修改规范

```javascript
 rules: {
    indent: ['error', 'tab'],
    'linebreak-style': ['error', 'windows'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'class-methods-use-this': 0,
    'import/extensions': 0,
    'no-plusplus': 0,
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'none', ignoreRestSiblings: false },
    ],
    'max-len': 0,
    'no-underscore-dangle': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-console': 'off',
  },
```



### 配置.eslintignore

```
# don't ever lint node_modules
node_modules
# don't lint build output (make sure it's set to your correct build folder name)
dist
```



### 配置VS Code

#### 安装eslint扩展

https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint



#### 添加.vscode setting.json

```json
File-> Preference->Setting->Workspace->open setting.json
```

在setting.json文件中添加如下配置

```javascript
{
    "eslint.alwaysShowStatus": true,
    "eslint.format.enable": true,
    "eslint.lintTask.enable": true,
    "eslint.validate": ["typescript"],
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "files.eol": "\n"
}
```









## 配置脚本package.json

上边weapack的命令已经写好了，下边我们就在package.json文件中写指定的命令：

```javascript
 "scripts": {
    "start": "cross-env NODE_ENV=development webpack serve --config ./build/webpack.config.js",
    "build": "cross-env NODE_ENV=production webpack --config ./build/webpack.config.js"
  },
```

``

## 配置Mocker API

```
cnpm install mocker-api --save-dev
```



创建mock/mocker.js

```
const proxy = {
    'GET /api/user': { id: 1, username: 'kenny', sex: 6 },
    'GET /api/user/list': [
      { id: 1, username: 'kenny', sex: 6 },
      { id: 2, username: 'kenny', sex: 6 }
    ],
    'POST /api/login/account': (req, res) => {
      const { password, username } = req.body
      if (password === '888888' && username === 'admin') {
        return res.send({
          status: 'ok',
          code: 0,
          token: 'sdfsdfsdfdsf',
          data: { id: 1, username: 'kenny', sex: 6 }
        })
      } else {
        return res.send({ status: 'error', code: 403 })
      }
    },
    'DELETE /api/user/:id': (req, res) => {
      console.log('---->', req.body)
      console.log('---->', req.params.id)
      res.send({ status: 'ok', message: '删除成功！' })
    }
  }
  module.exports = proxy;
```

在webpack.config.js中添加如下配置

```javascript
 devServer: {
    before(app) {
      apiMocker(app, resolve('./mock/mocker.js'));
    },
  },
```









