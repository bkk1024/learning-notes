var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// 定义一个父类
var Animal = /** @class */ (function () {
    function Animal(name, age) {
        this.name = name;
        this.age = age;
    }
    Animal.prototype.say = function () {
        console.log('父类Animal的say()');
    };
    return Animal;
}());
// 定义子类Dog，继承父类Animal
var Dog = /** @class */ (function (_super) {
    __extends(Dog, _super);
    function Dog(name, age) {
        var _this = 
        // 如果在子类中写了构造函数，在其中必须对父类的构造函数进行调用
        _super.call(this, age) // 调用父类的构造函数
         || this;
        _this.age = age;
        return _this;
    }
    Dog.prototype.say = function () {
        // 在类的方法中，super就表示当前类的父类
        _super.prototype.say.call(this);
    };
    return Dog;
}(Animal));
var dog = new Dog('旺财', '4');
console.log('dog', dog);
