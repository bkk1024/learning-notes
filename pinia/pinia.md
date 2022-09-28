# pinia

pinia 与 vuex(<=4版本) 的区别在于：

- 它去掉了 `mutations` 。
- 并且没有 `modules` 嵌套结构。pinia 通过设计提供平面结构，但是我们也可以通过在另一个 Store 中导入和使用来自隐式嵌套 Store。stores 文件夹下的每个 js 文件就是一个单独的 store，但是它也仍然支持 Store 之间的交叉组合方式。
- 没有命名空间模块。

## 安装

`npm install pinia` 

## 定义一个 Store

pinia 的 store 是使用 `defineStore()` 定义的，并且它需要一个**唯一**的名称，作为第一个参数传递：

```javascript
import { defineStore } from 'pinia'

// useStore 可以随便取名
// 第一个参数是应用程序中 store 的唯一 id
export const useStore = defineStore('main', {
  ... // 其他代码
})
```

- 使用

  ```vue
  <script setup>
    import { useStore } from '@/stores/counter'
    
    const store = useStore()
  </script>
  ```

  > ##### 注
  >
  > 1、可以根据需要定义任意数量的 store，并且每个 store 应该在**不同的文件中**定义。
  >
  > 2、当 store 被实例化后，就可以直接在 store 上访问 `state | actions | getter` 。
  >
  > 3、store 是一个用 `reactive` 包裹的对象，这意味这不需要在 getter 之后写 `.value` ，但是，如同 setup 中的 props 一样，也不能对其进行解构。

- 为了从 Store 中提取的属性同时保持其响应式，就需要使用 `storeToRefs()` 。它将为任何响应式属性创建 refs：

  ```vue
  <script setup>
    import { useStore } from '@/stores/counter'
    import { storeToRefs } from 'pinia'
    
    const store = useStore()
    const { name, count } = storeToRefs(store)
    /*
    	name 和 count 式响应式引用，这也会为插件添加的属性创建引用，
    	但跳过任何 action 或非响应式(不是 ref/reactive)的属性
    */
  </script>
  ```

## State

大多数时候，state 是 store 的核心部分。在 pinia 中，状态被定义为返回初始状态的函数。

```js
import { defineStore } from 'pinia'

const useStore = defineStore('storeId', {
  state: () => {
    return {
      name: '张三',
      count: 0,
    }
  }
})
```

### 访问 state

默认情况下，可以通过 store 实例访问状态来直接读取和写入状态：

```js
const store = useStore()

store.count++
```

除了以上访问方法，也可以使用 `$patch` 方法。它可以同时更改多个 state 中的状态：

```js
store.$patch({
  count: store.count++,
  name: '李四',2
})
```

使用 `$patch` 这种方法在修改集合(如从数组中删除、拼接元素等)都需要创建一个新集合。因此，`$patch` 方法也接收一个函数来批量修改集合内部分兑现的情况：

```js
cartStore.$patch((state) => {
  state.items.push({ name: '王五', count: 3 })
  state.isChanged = true
})
```

### 重置状态

可以调用 `$reset()` 方法将状态重置到初始值：

```js
const store = useStore()
store.count++
store.$reset()
```

### 替换 state

1. 可以通过将 `$state` 属性设置为新对象来替换 Store 的整个状态：`store.$state = { age: 18, name: '赵六' }` 
2. 可以通过更改 `pinia` 实例的 state 来替换应用程序的整个状态：`pinia.state.value = {}` 

### 订阅状态：[链接](https://pinia.web3doc.top/core-concepts/state.html#%E8%AE%A2%E9%98%85%E7%8A%B6%E6%80%81) 

可以通过 store 的 `$subscribe()` 方法查看状态机器变化，类似 Vuex 的 subscribe 方法。

与常规的 `watch()` 相比，使用它的有点是 *subscriptions* 只会在 *patches* 之后触发一次

```js
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type
  // 与 cartStore.$id 相同
  mutation.storeId
  // 仅适用于 mutation.type === 'patch object'
  mutation.payload
  
  // 每当它发生变化时，将整个状态持久化到本地存储
  localStorage.setItem('cart', JSON.stringify(state))
})
```

## Getter

Getter 就是 Store 状态的计算值，可以用 `defineStore()` 中的 `getter` 属性定义。它接收 state 作为第一个参数：

```JavaScript
export const useStore = defineStore('main', {
  state: () => ({
    count: 0,
  }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
})
```

在某个 getter 中也可以使用其他 getter，我们可以使用 `this` 访问到整个 store 的实例：

```JavaScript
export const useStore = defineStore('main', {
  state: () => ({
    count: 0,
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
    doublePlusCount() {
      // return this.count * 2 + 1
      return this.doubleCount + 1
    }
  },
```

在组件中访问 getter：

```vue
<template>
  <p>Double count is {{ store.doubleCount }}</p>
</template>

<script setup>
  const store = useStore()
</script>
```

### 将参数传递给 getter

本质上来说，我们无法向 Getters 传递任何参数，但是，我们可以从 getter 返回一个函数以接收任何参数：

```JavaScript
export const useStore = defineStore('main', {
  getters: {
    getUserById: (state) => {
      return (userId) => {
        return state.users.find((user) => user.id === userId)
      }
    }
  }
})
```

在组件中使用：

```vue
<script setup>
  const store = useStore()
</script>

<template>
  <p>User 2: {{ store.getUserById(2) }}</p>
</template>
```

### 访问其他 Store 的 getter

```JavaScript
import { useOtherStore } from './other-store'

export const useStore = defineStore('main', {
  state: () => ({ ... }),
  getters: {
    otherGetter(state) {
  		const otherStore = useOtherStore()
			return state.localData + otherStore.data
		}
  }
})
```

## Actions

使用 `defineStore()` 中的 `actions` 属性定义，用来处理业务逻辑：

```javascript
export const useStore = defineStore('main', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.counter++
    },
    randomizeCounter() {
      this.counter = Math.round(100 * Math.random())
    }
  }
})
```

actions 可以是异步的，我们可以在其中 `await` 任何 API 调用甚至其他操作。

```js
import { mande } from 'mande'

const api = mande('/api/users')

export const useUsers = defineStore('users', {
  state: () => ({
    userData: null,
    // ...
  }),
  
  actions: {
    async registerUser(login, password) {
      try {
        this.userData = await api.post({ login, password })
        console.log('登录成功')
      } catch (error) {
        console.log('登录失败')
        return error
      }
    }
  }
})
```

在组件中使用：

```vue
<script setup>
  const users = useUsers()
  
  users.registerUser(login, password)
</script>
```

访问其他 store 的 actions 的操作类似 getters。

### 订阅 Actions：[链接](https://pinia.web3doc.top/core-concepts/actions.html#%E8%AE%A2%E9%98%85-actions) 
