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
