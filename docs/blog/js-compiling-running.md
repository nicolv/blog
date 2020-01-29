# JS 编译与运行

## 前言

在编程过程中，需要用到状态，而状态被存在变量中。那么变量该怎么存？Javascript 使用作用域规则来存储变量。
那么，程序又是如何找到这些变量，从而使用他们？JavaScript 根据作用域规则来找到变量。
综上，作用域的规则在一门编程语言设计过程中，是很重要的。

---

## 编译与运行过程

下面是 JavaScript 语句，定义了一个变量 a，并为 a 赋值为 1。那么 JS 引擎、编译器和作用域具体是如何协作实现这个功能的呢？

```javascript
var a = 1;
```

实现这个功能，主要分成两个阶段：编译阶段、运行阶段。

### 1）编译阶段

JavaScript 引擎与编译器编译的过程，通常只需要几微妙。主要有以下三个步骤：

#### 1. 分词 / 词法分析

**编译器** 将上面的 code 分成 `var`、`a`、`=`、`1`、`;` 


#### 2. 语法分析

**编译器** 生成抽象语法树（Abstract Syntax Tree）   
VariableDeclaration  
 　├ Identifier (a)  
 　├ AssignmentExpression(1)  

[在线语法树生成器](https://esprima.org/demo/parse.html)

#### 3. 代码生成

在这个阶段，**编译器** 和 **JS 引擎** 将 AST 生成可执行代码（机器指令）。并且，代码会被分为两部分：
1. `var a`  这部分会在代码生成阶段被解释
2. `a = 1`  这部分会在代码执行阶段被执行

对于第一部分，**编译器** 询问 **作用域** 是否存在一个名叫 `a` 的变量  
- 是：忽略 `var a`  
- 否：  
  编译器 创建一个名叫 `a` 的变量  
  编译器 为 `a` 创建内存
 
而第二部分交给 **JavaScript 引擎** 在代码执行阶段执行。
        
### 2）代码执行阶段

 JavaScript 引擎 询问 **当前作用域** 是否存在变量 `a`

- 是：**JavaScript 引擎** 为 `a` 赋值为 `1`
- 否：**JavaScript 引擎** 继续在 **上级作用域** 中查找变量 `a`
- 查了所有 **上级作用域** 依然没找到 `a`：  
  **JavaScript 引擎** 抛出 `ReferenceError`

---

## 一些术语

### LHS 查询

表示 在作用域中查找变量，并接下来要执行赋值操作。  
就像在上述代码中，就是为 ``= 2`` 这个操作找到一个目标 ``a``。  

严格模式下，找不到变量，抛出``ReferenceError``  
非严格模式下，找不到变量，编译器将创建这个变量

### RHS 查询

表示 在作用域中取得对象的值。  
例如：``console.log(a)``  
 
如果在作用域中找不到这个对象，抛出``ReferenceError``      
如果在作用域中找到这个对象，但是不存在它的属性，抛出``TypeError``  
e.g. 
```javascript
var a = 1;  
console.log(a.b);
```
 
如果在作用域中找到这个对象，但是对它进行不合理操作，抛出``TypeError``  
e.g. 
```javascript
var a = 1;
a();
```

---

## 练习

```javascript
function foo(a) {
    var c = a + b;
    console.log(c);
}

var b = 2;
foo(3); // 5
```

在这段代码中，有 3 处 LHS 查询
- b =
- a =
- c =

有 5 处 RHS 查询
- foo(...
- a...
- ...b
- ...c
- console.log(...

---

## 遗留的问题（TODO）

1. javascript 引擎如何进行对性能进行优化？在哪个阶段进行优化？
   
2. 词法分析和分词有什么区别？

---

## 参考

[Imjben 的 blog](https://lmjben.github.io/blog/js-principle.html#%E7%BC%96%E8%AF%91%E8%BF%87%E7%A8%8B)