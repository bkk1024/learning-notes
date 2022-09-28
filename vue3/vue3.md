# vue3

## reactive()

使用`reactive()`API来声明响应式状态(能在改变时触发更新的状态)。由`reactive()`创建的对象都是JavaScript Proxy其工作方式与普通对象相同。

```vue
<template>
	<p>{{ state.data1 }}</p>
	...
</template>

<script setup>
  import { reactive } from 'vue'
  
  defintOption({
    name: 'xxx'
  })
  
  const state = reactive({
    data1:'',
    data2: 0,
    data3: [],
    data4: {},
    ...
  })

</script>
```

> ##### 注
>
> 1、`reactive()` 返回的是一个原始对象的 `Proxy` ，它和原始对象是不相等的。
>
> 2、只有代理对象是响应式的，更改原始对象不会触发更新。因此，使用 Vue 的响应式系统的最佳时间是 **仅使用声明对象的代理版本** 。
>
> 3、对一个原始对象调用 `reactive()` 会返回代理对象，对一个已存在的代理对象调用 `reactive()` 会返回其本身。这样能保证访问代理的一致性。
>
> 4、响应式对象内的嵌套对象依然是代理。

### reactive() 的局限性

1. 仅对对象类型有效（对象、数组、Map、Set），而对 string、number和boolean这样的原始类型无效。

2. 因为 Vue 的响应式系统通过属性访问进行追踪的，因此我们必须始终保持对该响应式对象的相同引用。即我们不能随意地 **替换** 一个响应式对象，这会导致对初始引用的响应性丢失：

   ```JavaScript
   let state = reactive({ count: 0 })
   
   // 上面的引用 ({ count: 0 }) 将不再被追踪（响应性连接已丢失）
   state = reactive({ count: 1 })
   ```

   同时这也意味着当我们将响应式对象的属性赋值或结构至本地变量时，或是将该属性传入一个函数时，会失去响应性：

   ```JavaScript
   const state = reactive({ count: 0 })
   
   // n 是一个局部变量，无响应性
   let n = state.count
   n++
   
   // count 也和 state.count 失去了响应性连接
   let { count } = state
   count++
   
   // 该函数接收一个普通数字，并且将无法跟踪 state.count 的变化
   callSomeFunction(state.count)
   ```


## ref()

由于 `reactive()` 的限制，Vue 提供了一个 `ref()` 方法来允许我们创建可以使用任何值类型的响应式 ref，`ref()` 将传入参数的值包装为一个带 `.value` 属性的 ref 对象：

```JavaScript
import { ref } from 'vue'

const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0
```

ref 的 `.value` 属性也是响应式的。同时，当值为对象类型时，会用 `reactive()` 自动转换它的 `.value` ：

```javascript
const objectRef = ref({ count: 0 })

// 这是响应式的替换
console.log(objectRef.value) // { count: 0 }
```

ref  被传递给函数或是从一般对象上被解构时，不会丢失响应式：

```javascript
const obj = {
  foo: ref(1),
  bar: ref(2),
}

// 该函数接受一个 ref，需要通过 .value 取值，会保持响应性
callSomeFunction(obj.foo)

// 仍然是响应式的
const { foo, bar } = obj
```

> ##### 注
>
> `ref()` 让我们能创造一种对任意值的“引用”，并能够在不丢失响应性的前提下传递这些引用。这个功能很重要，因为它经常用于将逻辑提取到[组合函数](https://cn.vuejs.org/guide/reusability/composables.html)中。
>
> 1、ref 在模板中作为顶层属性被访问时，其会被自动“解包”，所以不需要使用 `.value` 。
>
> - `const foo = ref(0)` ：foo是顶层属性
> - `const obj = { foo: ref(0) }` ：obj.foo 不是顶层属性，要在模板中像使用顶层属性一样使用 obj.foo ，可以将其解构出来使用 `const { foo } = obj` ，这样 foo 即为顶层属性
>
> 2、当一个 ref 被嵌套在一个响应式对象中，作为属性被访问或更改时，它会自动解包，因此或表现得和一般属性一样，不需要使用 `.value` 。只有当嵌套在一个深层对象内时，才会发生 ref 解包，在[浅层响应式对象](https://cn.vuejs.org/api/reactivity-advanced.html#shallowreactive)中不会。
>
> 3、如果将一个新的 ref 赋值给一个关联了已有 ref 的属性，那么它会替换掉旧的 ref。
>
> 4、跟响应式对象不同，当 ref 作为响应式数组或像 `Map` 这种原生集合类型的元素被访问时，不会进行解包。
>
> ```JavaScript
> const state1 = reactive([ref('hello')]) 
> // 这里需要 .value
> console.log(state1[0].value)
> 
> const state2 = reactive(new Map([['count', ref(0)]]))
> // 这里需要 .value
> console.log(state2.get('count').value)
> ```

对于普通的 JavaScript 变量，我们可以通过编译时转换，来让编译器帮我们省去使用 `.value` 的麻烦。

```vue
<template>
  <button @click="increment">{{ count }}</button>
</template>

<script setup>
let count = $ref(0)
// 这里的这个 $ref() 方法是一个编译时的宏命令：它不是一个真实的、在运行时会调用的方法。而是用作 Vue 编译器的标记，表明最终的 count 变量需要是一个响应式变量。

function increment() {
  // 无需 .value
  count++
}
</script>
```

> ##### 注
>
> [响应性语法糖](https://cn.vuejs.org/guide/extras/reactivity-transform.html) 仍处于实验性阶段，后续可能改动。

## nextTick()

当你在 Vue 中更改响应式状态时，最终的 DOM 更新并不是同步生效的，而是由 Vue 将它们缓存在一个队列中，直到下一个“tick”才一起执行。这样是为了确保每个组件无论发生多少状态改变，都仅执行一次更新。

`nextTick()` 可以在状态改变后立即使用，以等待 DOM 更新完成。你可以传递一个回调函数作为参数，或者 await 返回的 Promise。

```JavaScript
import { nextTick } from 'vue'

const count = ref(0)

async function increament() {
  count.value++
  
  // 此时 DOM 还未更新
  console.log(document.getElementById('counter').textContent) // 0
  
  await nextTick()
  // 此时 DOM 已经更新
  console.log(document.getElementById('counter').textContent) // 1
}
```

## computed()

`computed()` 方法期望接收一个 `getter` 函数，返回值为一个**计算属性ref**，其和其他一般 ref 类似。

计算属性会自动追踪响应式依赖，它会检测计算属性依赖的变量的改变，当这个变量改变时，任何依赖于这个计算属性的绑定都会同时更新。

```vue
<template>
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>

<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

// 一个计算属性 ref
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
</script>
```

计算属性默认仅能通过计算函数得出结果。当尝试修改一个计算属性时，会出现一个运行时警告。只有在某些特殊场景中通过同时提供 `getter` 和 `setter` 来创建一个**可写的**计算属性。

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter，读取计算属性的值
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter，修改计算属性的值
  set(newValue) {
    // 注意：我们这里使用的是解构赋值语法
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})

fullName.value = 'John Doe'
// 调用 fullName 的 setter，firstName 和 lastName 会同时更新
</script>
```

> ### 注
>
> 计算属性只应做计算而不做其他功能。如，不要在计算函数中进行异步请求或者修改 DOM。
>
> 如果要通过一个变量的变动来进行其他修改可以使用[监听器](https://cn.vuejs.org/guide/essentials/watchers.html) 。

## Class 和 Style 绑定

我们可以给 `:class` 传递一个对象来动态切换 class。

```vue
<div :class="{ active: isActive }"></div>
<!-- 表示 active 这个类名是否存在取决于 isActive 的真假 -->
```

同时，`:class` 可以与一般的 class 同时存在，如：

```vue
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

`:class` 绑定的对象并不一定需要写成内联字面量的形式，也可以直接绑定一个对象，同样也可以绑定一个返回对象的计算属性：

```vue
<template>
	<div :class="classObject"></div>
	<div :class="comClassObject"></div>
<template/>

<script setup>
	import { reactive, computed } from 'vue'
  const classObject = reactive({
    active: true,
    'text-danger': false
  })
  
  const comClassObject = computed(() => ({
    active: true,
    'text-danger': false
  }))
</script>
```

`:class` 可以绑定一个数组来渲染多个 class：

```vue
<template>
	<div :class="[activeClass, errorClass]"></div>
<template/>

<script setup>
	import { ref } from 'vue'
  const activeClass = ref('active')
  const errorClass = ref('text-danger')
</script>
```

`:class` 也可以使用三元表达式：

`<div :class="[isActive ? activeClass : '', errorClass]"></div>` 

`:style` 与 `:class` 类似。

## 事件处理

- 在内联事件处理器中访问事件参数：有时需要在内联事件处理器方法传入一个特殊的 `$event` 变量或者使用内联箭头函数：

  ```vue
  <template>
  	<!-- 使用特殊的 $event 变量 -->
  	<button @click="warn('Form cannot be submitted yet.', $event)">
  	  Submit
  	</button>
  	
  	<!-- 使用内联箭头函数 -->
  	<button @click="(event) => warn('Form cannot be submitted yet.', event)">
  	  Submit
  	</button>
  <template/>
  
  <script setup>
  	function warn(message, event) {
  	  // 这里可以访问原生事件
  	  if (event) {
  	    event.preventDefault()
  	  }
  	  alert(message)
  	}
  </script>
  ```

- 事件修饰符：在处理事件时调用 `event.preventDefault()` 或 `event.stopPropagation()` 是很常见的。尽管我们可以直接在方法内调用，但如果方法能更专注于数据逻辑而不用去处理 DOM 事件的细节会更好。

  为了解决上述问题，Vue 提供了事件修饰符，使用 `.` 表示指令后缀：

  1. `.stop`：阻止事件冒泡
  2. `.prevent`：阻止默认事件
  3. `.self`：将事件绑定到自身，只有自身才能触发，通常用于避免冒泡事件的影响
  4. `.capture`：捕获冒泡，即有冒泡发生时，有该修饰符的dom元素会先执行，如果有多个，从外到内依次执行，然后再按自然顺序执行触发的事件
  5. `.once`：点击事件只触发一次
  6. `.passive`：该修饰符大概意思用于对DOM的默认事件进行性能优化，根据官网的例子比如超出最大范围的滚动条滚动的

- 按键修饰符：[链接](https://cn.vuejs.org/guide/essentials/event-handling.html#key-modifiers) 

## defineEmits()

`defineEmits()` 宏**不能**在子函数中使用。它必须直接放置在 `<script setup>` 的顶级作用域下。

- 父组件

  ```vue
  <template>
  	<my-button @warn="warn"> Submit </my-button>
  <template/>
  
  <script setup>
  	function warn(params) { ... }
  </script>
  ```

- 子组件 my-button

  ```vue
  <template>
  	<button @click="show"> Submit </button>
  <template/>
  
  <script setup>
  	const emit = defineEmits(['warn'])
    
    const show = () => {
      emit('warn', /* 要传入的参数，没有参数则可以不写 */)
    }
  </script>
  ```

[官网链接](https://cn.vuejs.org/guide/components/events.html#declaring-emitted-events) 

##  依赖注入（Provide & Inject）

一般来说，使用 Props，可以从父级向子级传递数据，但是当层级过深时，要跨级传递数据则需要一层一层的使用 Props ，直到传递到目标组件，这样会显得过于繁琐。因此，Vue 提供了 `provide()` 和 `inject()` 函数来实现跨级传递数据。

- `provide()`

  ```vue
  <script setup>
  import { provide } from 'vue'
  
  provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
  </script>
  ```

- `inject()`

  ```vue
  <script setup>
  import { inject } from 'vue'
  
  const message = inject('message')
  </script>
  ```

  > ##### 注
  >
  > 如果 provide() 提供的值是一个 ref ，则注入进来的是该 ref 的对象，而不会自动解包。这使得注入方组件能够通过 ref 对象保持了和供给方的响应性链接。

[其他详细用法](https://cn.vuejs.org/guide/components/provide-inject.html) 

## Transition

`<Transition>` 是一个内置组件，它可以将进入和离开动画应用到通过默认插槽传递给它的元素或组件上。进入或离开可以由以下条件之一触发：

- `v-if` 
- `v-show` 
- 特殊元素 `<component>`  切换的动态组件

基本用法：

```vue
<template>
	<button @click="show = !show">Toggle</button>
	<Transition>
	  <p v-if="show">hello</p>
	</Transition>
</template>

<style scoped>
	.v-enter-active,
	.v-leave-active {
	  transition: opacity 0.5s ease;
	}
	
	.v-enter-from,
	.v-leave-to {
	  opacity: 0;
	}
</style>
```

[其他用法](https://cn.vuejs.org/guide/built-ins/transition.html) 

## TransitionGroup

[<TransitionGroup>](https://cn.vuejs.org/guide/built-ins/transition-group.html) 是一个内置组件，用于对 `v-for` 列表中的元素或组件的插入、移除和顺序改变添加动画效果。

## 路由

`src/router/index.js` 

```JavaScript
// 导入创建路由的方法
/*
	createWebHashHistory：哈希历史模式
	createWebHistory：H5历史模式
	这两个模式二选一进行创建
*/
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
// 导入路由页面，导入 src/views/ 文件夹下的所有 vue 文件
const views = import.meta.glob('../views/**/*.vue')
// 定义路由路径
const routes = [
  {
    path: '/',
    name: 'main',
    component: views['../views/Main.vue'],
    children: [
      {
        path: '',
        name: 'home',
        component: views['../views/Home.vue'],
        meta: {
          title: '首页'
        }
      },
      ... // 其他子路由
    ]
  },
  ... // 其他路由
]
    
const router = createRouter({
  routes,
  history: createWebHashHistory()
})

export default router
```

[vue-router官方文档](https://router.vuejs.org/zh/introduction.html) 

## useRoute() & useRouter()

```javascript
import { useRoute, useRouter } from 'vue-router'

const route = useRoute() // 当前路由地址，相当于在模板中使用 $route
const router = useRouter() // router 实例，相当于在模板中使用 $router
```

