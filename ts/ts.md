## TS声明类型

### 给变量声明类型

```typescript
// 声明一个变量，同时指定它的类型为 number
let num: number = 12
// num 的类型设置为了 number，在以后的使用过程中无法将其赋值为其他类型，只能为数字，否则会报错
num = 10
num = 23
num = 'hello' // 此处报错

// 如果变量的声明和赋值是同时进行的，TS可以自动对变量进行类型检测
let bool = false  // 这里TS自动检测到变量 bool 为 boolean
bool = 12 // 这里报错
```

### 给函数的入参声明类型

```typescript
function sum(a: number, b: number): number {
  // 最后在函数声明末尾声明的类型表示这个函数 return 出去的值的类型
  return a + b
}

sum(123, 456)
sum(123, '456')  // 此处会报错
```

### 使用字面量进行类型声明

```typescript
let a: 10 // 这里使用 10 作为类型给a，即规定了a只能等于10，相当于声明了一个常量
a = 11 // 报错

// 使用：可以使用 | 来连接多个类型，这种连接方式不止于字面量，正常的类型也可以连接
let sex: 'male' | 'female'
sex = 'male'
sex = 'female'
```

### 其他类型

1. any：表示声明了一个任意类型，则此变量不会被TS的类型检测，同JS的变量声明一样。

2. unknown：表示位置类型的值，其效果类似于any，但是区别在于any类型的变量可以赋值给其他类型的变量，但是unknown不能。

3. void：用来表示为空值，以函数为例，即表示函数没有返回值。

4. never：表示永远不会返回值，如一个用来抛出错误的函数，其不会返回任何值，即为never。

5. object：表示一个JS对象。

   ```typescript
   let a = {
     name: string,
     age?: number, // ?表示这个属性是可选的
     [propName: string]: any, // 表示任意属性任意类型
   }
   
   a = {name: '张三'}
   a = {name: '张三', sex: 'male', age: 18}
   a = {} // 会报错
   ```

6. array：表示一个数组。

   ```typescript
   let numArr: number[] // 表示一个数字数组，写法1
   let strArr: string[] // 表示一个字符串数组
   let NumArr: Array<number> // 表示一个数字数组，写法2
   ```

7. tuple：表示一个元组，即一个固定长度的数组。

   ```typescript
   let tup: [string, string] // 表示一个长度为2的字符串数组
   let tup1: [string, number, boolean] // 表示一个长度为3的数组
   ```

8. enum：表示一个枚举。

   ```typescript
   enum Gender{ // 声明了一个枚举
     Male = 0, // 也可以不写等于多少，写了就是自己规定了
     Female = 1
   }
   let person: {
     name: '张三',
     gender: Gender.Male
   }
   console.log(person.gender === Gender.Male)
   ```

9. 类型的别名：即可以自己规定一个类型。

   ```typescript
   type myType = 1 | 2 | 3 // 给 1 | 2 | 3 这个类型起了一个名字
   let num: myType // 使用这个类型
   ```

### 类型断言

类型断言：可以用来告诉解析器变量的实际类型，其写法有两种

1. 使用as关键字：`s = e as string`
2. 使用<>包含类型：`s = <string>e`

## TS的编译选项

1. 创建一个`tsconfig.json`这个文件

2. 进行配置：

   ```json
   // 这里只是写出了部分配置
   {
   	// 本文件是ts编译器的配置文件，ts编译器可以根据它的信息来对代码进行编译
   	"include": [
   		// 用来指定哪些ts文件需要被编译
   		// ** 表示任意目录
   		// * 表示任意文件
   		"./src/**/*"
   	],
   	"compilerOptions": {
   		// 编译选项是配置文件中非常重要和复杂的配置选项
   		"target": "ES5", // 指定TS被编译为的JS版本
   		// "module": "ES6", // 指定要使用的模块化的规范
   		// "lib": [] // 用来指定项目中要使用的库
   		"outDir": "./dist", // 用来指定编译后文件所在的目录
   		"outFile": "./dist/app.js", // 输出的文件，将所有的文件合并成一个文件
   		"allowJs": false, // 是否对js文件进行编译，默认false
   		"checkJs": false, // 是否对js文件进行检测语法，默认false
   		"removeComments": false, // 是否移除注释，默认false
   		"noEmit": false, // 是否生成编译后的文件，默认false
   		"noEmitOnError": true, // 当有错误时是否生成编译文件，默认false
   		"strict": false, // 所有严格检查的总开关，默认false
   		"alwaysStrict": false, // 编译后的文件是否开启严格模式，默认false
   		"noImplicitAny": false, // 是否不允许隐式的any类型，默认false
   		"noImplicitThis": false, // 是否不允许明确类型的this，默认false
   		"strictNullChecks": false // 是否严格的检查空值，默认false
   	}
   	// "exclude": [
   	// 	// 用来指定哪些ts文件不需要被编译
   	// 	// 默认值：["node_modules", "bower_components", "jspm_packages"]
   	// 	"./src/hhh/**/*"
   	// ]
   	// "extends": "", // 定义被继承的配置文件
   	// "files": [], // 指定被编译的文件列表，与include类似，但是include是指定文件夹，files是指定确定的文件
   }
   ```

3. 使用`tsc`命令即可直接通过配置文件进行编译，使用`tsc -w`即可对所有进行编译的ts文件进行检测改动并自动编译

## 使用webpack打包TS代码

[webpack打包TS笔记](https://github.com/JasonkayZK/typescript-learn/tree/3-webpack) 

[tsconfig.json和webpack.config.js两个配置文件内容](https://github.com/Nliver/Typescript_study/blob/main/chapter01/part03/) 

## 面向对象

面向对象简而言之就是程序之中所有的操作都需要的通过对象来完成。

在程序中所有的对象都分为两部分：数据(属性)、功能(方法)。如身高体重是数据，吃喝拉撒睡是功能。

### class 类

要创建对象需要先定义一个类，所谓的类可以理解为对象的模型，程序中可以根据类创建指定类型的对象。

使用`class` 关键字定义一个类

```typescript
// 定义一个类
class Person {
  // 构造函数，在对象被创建时调用
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  // 实例属性，需要 new 一个实例才能读取
  name: string
  age: number
  // 在属性Or方法前使用 static 关键字可以定义类属性(静态属性)，不需要 new 实例就能读取Or使用
  static gender: string = 'male'
  // 在属性前使用 readnoly 关键字可以定义一个只读属性，无法对其进行修改
  readonly height: number = 185
  // 两个关键字一起使用，创建了一个静态只读属性
  static readonly weight: number = 110
  
  // 定义方法
  sayHello() {
    console.log('hello')
  }
}

// 使用 new 关键字创建一个类的实例
const person = new Person('zhangsan', 18)

console.log('person', person)
```

### 继承

#### 继承与重写

```typescript
// 定义一个父类
class Animal {
  name: string
  age: number
  
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  
  say() {
    console.log('父类Animal的say()')
  }
}

// 定义子类Dog，继承父类Animal
class Dog extends Animal {
  // 当子类中有个和父类中相同的属性或方法时，这个子类中的属性或方法会覆盖掉父类中相同的这个方法(只是在这个子类中覆盖了，并没有修改原先父类中的属性或方法)
  // 这种子类覆盖父类的形式称为 重写
  say() {
    console.log(`子类Dog${this.name}的say()`)
  }
  
  // 在子类中也可以定义其他的属性或方法
  run() {
    console.log(`子类Dog${this.name}的run()`)
  }
}

const dog = new Dog('旺财', 4)
console.log('dog', dog)
```

#### super关键字

在类的方法中，`super`就表示当前类的父类

```typescript
// 定义一个父类
class Animal {
  name: string
  age: number
  
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  
  say() {
    console.log('父类Animal的say()')
  }
}

// 定义子类Dog，继承父类Animal
class Dog extends Animal {
  age: string
  
  constructor(name: string, age: string) {
    // 如果在子类中写了构造函数，在其中必须对父类的构造函数进行调用
    super(age) // 调用父类的构造函数
    this.age = age
  }
  
  say() {
    // 在类的方法中，super就表示当前类的父类
    super.say()
  }
}

const dog = new Dog('旺财', '4')
console.log('dog', dog)
```

#### 抽象类

以`abstract`开头的类时抽象类，抽象类与其他类区别不大，只是不能用来创建对象，抽象类生来就是给其他类继承的。

```typescript
// 这个类是抽象类，只能用来给其他对象继承，无法直接它来创建对象
abstract class Animal {
  ...
  // 定义一个抽象方法，使用abstract开头，没有方法体，只能定义在抽象类中，子类必须对抽象方法进行重写
  abstract say(): void
}
```

#### 接口

接口就是用来定义一个类的结构，用来定义一个类中应该包含哪些属性和方法。同时，接口也可以当成类型声明去使用。

使用`interface`关键字来定义接口。接口可以重复定义，同名的接口的结构为所有同名加起来的结构。使用 `implements` 关键字来实现一个接口。

```typescript
// 定义一个接口
interface myInterface {
  // 接口中所有的属性都不能有实际的值
  name: string
  age: number
  say(): void // 接口中定义的所有方法都是抽象方法
}

// 定义类，去实现一个接口，使用implements关键字
class MyClass implements myInterface {
  name: string
  age: number
  
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  
  say() {}
}
```

#### 属性的封装

在定义对象时，属性是在对象中设置的，属性可以任意的被修改，这会导致对象中的数据变得非常不安全。

1. public修饰符：公共属性，使用`public`修饰的属性可以在任意位置访问修改

2. private修饰符：私有属性，使用`private`修饰的属性只能在当前类的内部进行访问修改，在其子类中都无法访问和修改

   ```typescript
   // 方式1
   class Person1 {
     private name: string
     private age: number
     
     constructor(name: string, age: number) {
       this.name = name
       this.age = age
     }
     
     setName(name: string) {
       this.name = name
     }
     getName() {
       return this.name
     }
     setAge(age: number) {
       this.name = age
     }
     getAge() {
       return this.age
     }
   }
   
   const per1 = new Person1('张三', 18)
   console.log('per1', per1)
   per1.setName = '李四'
   per1.setAge = 16
   console.log('per1', per1)
   
   // 方式2
   class Person2 {
     private name: string
     private age: number
     
     constructor(name: string, age: number) {
       this.name = name
       this.age = age
     }
     
     // 这里的get和set是TS官方提供的，这样子的好处在于，后面对这些属性进行修改和访问时可以像原先一样直接用'.'操作
     set name(name: string) {
       this.name = name
     }
     get name() {
       return this.name
     }
     set age(age: number) {
       this.name = age
     }
     get age() {
       return this.age
     }
   }
   
   const per2 = new Person2('张三', 18)
   console.log('per2', per2)
   per2.name = '李四'
   per2.age = 16
   console.log('per2', per2)
   ```

   > ##### 提示
   >
   > 本身使用`private`修饰符后，在外部使用'.'操作符访问和修改类的私有属性会报错，但是TS的编译器是可以编译成功的，因此，如果想要达到出错就无法编译的效果，建议在TS的配置文件中将添加上`"noEmitOnError": true`。

3. protected修饰符：被保护的属性，只能在当前类和其子类中进行访问或修改。它的效果与私有属性类似，只不过私有属性无法在子类中访问或修改。

> 属性可以直接定义在构造函数中，可以简化代码。
>
> ```typescript
> class Person1 {
>   private name: string
>   private age: number
>   
>   constructor(name: string, age: number) {
>     this.name = name
>     this.age = age
>   }
> }
> 
> class Person2 {
>   constructor(private name: string, private age: number) {}
> }
> // 以上两种写法效果一样
> ```

## 泛型

在定义函数或类时，如果遇到类型不明确时就可以使用泛型。

```typescript
/** 定义泛型的名称可以随便写，不一定只能用T
    使用泛型而不使用any的好处是不会跳过类型检测 **/
function fn<T>(a: T): T{
  return a
}

// 调用方式一
fn(10) // 不指定泛型，TS可以对类型进行推断，但是不是所有都行

// 调用方式二
fn<string>('10') // 指定泛型


/** 泛型也可以定义多个 **/
function fn1<T, K>(a: T, b: <K>)<T, K> {
  return a, b
}


/** 泛型也可以规定范围 **/
interface Inter {
  length: number
}

/** 这里表示的意思是泛型T必须是Inter的一个实现类(子类) **/
function fn2<T extends Inter>(a: T): number{
  return a.length
}

fn2('asdfasdf')


/** 定义类时也可以使用泛型 **/
class MyClass<T> {
  name: T
  constructor(name: T) {
    this.name = name
  }
}

const mc = new MyClass<string>(name: '张三')
```

