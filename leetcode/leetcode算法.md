# 简单

## 两数之和

给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

[链接](https://leetcode.cn/problems/two-sum) 

```javascript
// 解法一：双重循环
const twoSum = function(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] == target) {
        return [i, j]
      }
    }
	}
}


// 解法二：哈希表，
const twoSum = function(nums, target) {
  const map = new Map()
  for (let i = 0; i < nums.length; i++) {
    const my_target = target - nums[i]
    if (map.has(my_target)) {
      return [i, map.get(my_target)]
    }
    map.set(nums[i], i)
  }
}
```

> ##### 注
>
> 哈希表也叫散列表，哈希表是一种数据结构，它提供了快速的插入操作和查找操作，无论哈希表总中有多少条数据，插入和查找的时间复杂度都是为O(1)，因为哈希表的查找速度非常快，所以在很多程序中都有使用哈希表，例如拼音检查器。
>
> 解法二使用哈希表处也可以换成一个新的数组，但是因为哈希表的查找和插入的时间复杂度为O(1)，而数组查找的复杂度为O(n)，所以使用哈希表可以优化时间复杂度。

## 合并两个有序链表

将两个升序链表合并为一个新的升序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 

[链接](https://leetcode.cn/problems/merge-two-sorted-lists/) 

```javascript
const mergeTwoLists = function (list1, list2) {
  const prehead = new ListNode(-1)
  let prev = prehead

  while (list1 != null && list2 != null) {
    
    if (list1.val <= list2.val) {
      prev.next = list1
      list1 = list1.next
    } else {
      prev.next = list2
      list2 = list2.next
    }
    prev = prev.next
  }

  // 合并后 list1 和 list2 最多只有一个还未被合并完，我们直接将链表末尾指向未合并完的链表即可
  prev.next = list1 === null ? list2 : list1
  return prehead.next
}
```

> ##### 注
>
> 链表存储的数据元素的物理存储位置是随机的，每个数据元素在存储时都配备一个指针，用以指向自己的直接后继元素。
>
> 链表中的每个数据存储都由两部分组成：1、数据元素本身，其所在的区域称为数据域；2、指向直接后继元素的指针，所在区域称为指针域。这两部分组成一个节点。
>
> 头指针：一个普通的指针，特点是永远指向第一个节点的位置。
>
> 头节点：一个不存储任何数据的空节点，通常作为链表的第一个节点。对于链表来说，头节点不是必须的，它的作用只是为了方便解决某些实际问题。
>
> 首元节点：由于头节点的缘故，链表中第一个存有实际数据的节点称为首元节点，只是一个称谓，没有实际意义。

# 中等

## 两数相加

给你两个非空的链表，表示两个非负的整数。它们每位数字都是按照逆序的方式存储的，并且每个节点只能存储一位数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

[链接](https://leetcode.cn/problems/add-two-numbers) 

```JavaScript  
const addTwoNumbers = function(l1, l2) {
  let sum = new ListNode('0') // 结果链表
  let shiwei = 0
  let result = sum
  while (shiwei || l1 || l2) {
    let myL1 = l1 ? l1.val : 0
    let myL2 = l2 ? l2.val : 0
    let res = myL1 + myL2 + shiwei // 三个数相加的最大值为 9 + 9 + 1 = 19
    shiwei = res >= 10 ? 1 : 0 // 判断是否需要进 1
    sum.next = new ListNode(res % 10) // 保留相加后的结果的个位数
    sum = sum.next // 指针指向下一位
    l1 = l1 ? l1.next : null // 指针指向下一位
    l2 = l2 ? l2.next : null // 指针指向下一位
  }
  return result.next
}
```

## Z 字形变换

将一个给定字符串 s 根据给定的行数 numRows ，以从上往下、从左到右进行 Z 字形排列。

比如输入字符串为 "PAYPALISHIRING" 行数为 3 时，排列如下：

P      A     H    N
A  P  L  S  I  I  G
Y      I      R

之后，你的输出需要从左往右逐行读取，产生出一个新的字符串，比如："PAHNAPLSIIGYIR"。

[链接](https://leetcode.cn/problems/zigzag-conversion) 

```JavaScript
const convert = function (s, numRows) {
  // 当只能写出一列时
  if (s.length <= numRows || numRows <= 1) return s
  // 当能写出多列时
  let arr = new Array(numRows).fill('') // 先初始化数组
  let loop = 2 * (numRows - 1) // 计算每几个字符一个循环
  for (let i = 0; i < s.length; i++) {
    const rem = i % loop
    if (rem < numRows) {
      // 这里将z字的上边存入
      arr[rem] += s[i]
    } else {
      // 这里将z字的斜边存入
      arr[loop - rem] += s[i]
    }
  }
  return arr.join('')
}
```

## 盛最多水的容器

给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。

找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。

返回容器可以储存的最大水量。

说明：你不能倾斜容器。

![img](https://aliyun-lc-upload.oss-cn-hangzhou.aliyuncs.com/aliyun-lc-upload/uploads/2018/07/25/question_11.jpg)

[链接](https://leetcode.cn/problems/container-with-most-water) 

```JavaScript
// 双指针解法
const maxArea = function (height) {
  let max = 0
  let left = 0
  let right = height.length - 1
  while (left != right) {
    let area = Math.min(height[left], height[right]) * (right - left)
    max = max > area ? max : area
    if (height[left] <= height[right]) {
      left = left + 1
    } else {
      right = right - 1
    }
  }
  return max
}
```

> ##### 双指针解法
>
> 定义两个指针，一个指向数组头部，一个指向数组尾部。循环计算两个指针之间的最大盛水量，然后判断哪个指针需要移动，指针移动后再次进行计算，当两个指针指向同一位置时退出循环。

## 三数之和

给你一个整数数组 `nums` ，判断是否存在三元组 `[nums[i], nums[j], nums[k]]` 满足 `i != j`、`i != k` 且 `j != k` ，同时还满足 `nums[i] + nums[j] + nums[k] == 0` 。请

你返回所有和为 `0` 且不重复的三元组。

**注意：**答案中不可以包含重复的三元组。

[链接](https://leetcode.cn/problems/3sum/) 

```JavaScript
// 双指针解法
const threeSum = function (nums) {
  // 最左侧值为定值，右侧所有值进行两边推进计算
  let res = []
  nums.sort((a, b) => a - b)
  let size = nums.length
  if (nums[0] <= 0 && nums[size - 1] >= 0) {
    // 保证数组中同时存在正数和负数
    let i = 0
    while (i < size - 2) {
      if (nums[i] > 0) break // 最左侧大于0，无解
      let first = i + 1 // 头指针
      let last = size - 1 // 尾指针
      while (first < last) {
        if (nums[i] * nums[last] > 0) break // 三数同符号，无解
        let sum = nums[i] + nums[first] + nums[last]
        if (sum === 0) {
          res.push([nums[i], nums[first], nums[last]])
        }
        if (sum <= 0) {
          // 负数过小，first右移
          while (nums[first] === nums[++first]) { } // 重复值跳过
        } else {
          // 和大于0，last左移
          while (nums[last] === nums[--last]) { } // 重复值跳过
        }
      }
      while (nums[i] === nums[++i]) { } // 重复定值跳过
    }
  }

  return res
}
```

> ##### 双指针
>
> 1、取定值：首先定好一个要进行相加的数字，这个数字为数组从左到右的每个数字(最后两个数字除外)
>
> 2、定好双指针：头指针指向定值后面剩余所有数据的第一个，尾指针指向定值后面剩余所有数据的最后一个
>
> 3、相加：将定值、头指针、尾指针相加，然后判断结果是否符合要求，符合则存储，否则判断其与要求的大小，若其小于等于(之所以等于也要进行右移是因为结果符合要求并存储时，没有移动指针)要求，则头指针右移，否则尾指针左移，当头尾指针指向同一处时，跳出此次循环
>
> 4、跳过重复值：在取定值时，若将要取的定值与已经取的定值相等，则跳过此次取值进行下一次取值；在移动指针时，若要移动的指针下次指向的值与现在指向的值相同，则跳过此次指针的移动，直接进行下一次指针移动
>
> 5、当题目要求为三数之和为0：在取定值前判断数组第一个值和数组在最后一个值是否为不同符号数，若同为正数或负数，则表示这个数组中没有三个数相加为0；若定值大于0，则表示从定值往后没有三个值相加等于0；若定值与尾指针同符号，则表示在这个范围内没有三个值相加等于0
>
> 6、通过前后值是否相等来剔除重复值的前提条件是在进行步骤1234前对数组进行了排序

## 删除链表的倒数第 N 个结点

给你一个链表，删除链表的倒数第 `n` 个结点，并且返回链表的头结点。

[链接](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/) 

```JavaScript
const removeNthFromEnd = function (head, n) {
  let left = head // 左边的指针
  let right = head // 右边的指针
  // 让右指针走在左指针的前面n个
  while (n) {
    right = right.next
    n--
  }
  if (!right) return head.next // 左指针指向头节点，
  // 当右指针指向尾节点时，左指针指向的节点的下一个节点就是要删除的
  while (right.next) {
    left = left.next
    right = right.next
  }
  left.next = left.next.next // 删除左指针的下一个节点

  return head
}
```

> ##### 双指针
>
> 1、头指针：指向链表头节点
>
> 2、尾指针：指向链表第n个节点
>
> 3、循环移动头尾指针，当尾指针指向尾节点时(尾节点.next == null)，左指针指向的节点的下一个节点即是要删除的节点

## 括号生成

数字 `n` 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且有效的括号组合。

[链接](https://leetcode.cn/problems/valid-parentheses/) 

```JavaScript
// 深度递归
const generateParenthesis = function (n) {
  let result = []

  const dfs = (leftNum, rightNum, str) => {
    /* 深度递归：
      当左括号未达到最大数时，添加左括号；
      当左括号数量大于右括号数量时，添加右括号
      当字符串长度为2n时，将字符串压入数组，退出递归
    */
    if (str.length == 2 * n) {
      result.push(str)
      return
    }
    if (leftNum > 0) dfs(leftNum - 1, rightNum, str + '(')
    if (leftNum < rightNum) dfs(leftNum, rightNum - 1, str + ')')
  }

  dfs(n, n, '')
  return result
}
```

# 困难

## 正则表达式匹配

给你一个字符串 `s` 和一个字符规律 `p`，请你来实现一个支持 `'.'` 和 `'*'` 的正则表达式匹配。

- `'.'` 匹配任意单个字符
- `'*'` 匹配零个或多个前面的那一个元素

所谓匹配，是要涵盖整个字符串 `s`的，而不是部分字符串。

[链接](https://leetcode.cn/problems/regular-expression-matching/) 

```JavaScript
// 动态规划
const isMatch = function (s, p) {
  if (s == null || p == null) return false

  const sLen = s.length,
    pLen = p.length

  // 初始化 dp 表格
  const dp = new Array(sLen + 1) // 初始化一维数组
  for (let i = 0; i < dp.length; i++) {
    dp[i] = new Array(pLen + 1).fill(false) // 将项默认为false，初始化二维数组
  }

  dp[0][0] = true
  // base case
  // s为空，p不为空，由于*可以匹配0个字符，所以有可能为true
  for (let i = 1; i < pLen + 1; i++) {
    if (p[i - 1] == "*") dp[0][i] = dp[0][i - 2]
  }
  // 迭代
  for (let i = 1; i < sLen + 1; i++) {
    for (let j = 1; j < pLen + 1; j++) {
      if (s[i - 1] == p[j - 1] || p[j - 1] == ".") {
        dp[i][j] = dp[i - 1][j - 1]
      } else if (p[j - 1] == "*") {
        if (s[i - 1] == p[j - 2] || p[j - 2] == ".") {
          dp[i][j] = dp[i][j - 2] || dp[i - 1][j - 2] || dp[i - 1][j] // * 匹配0个或多个
        } else {
          dp[i][j] = dp[i][j - 2] // * 匹配0个
        }
      }
    }
  }
  return dp[sLen][pLen] // 长sLen的s串 是否匹配 长pLen的p串
}
```

[本题动态规划解法](https://leetcode.cn/problems/regular-expression-matching/solution/by-sdwwld-9s8f/) 

>  ##### 动态规划
>
> [看一遍就理解：动态规划详解](https://zhuanlan.zhihu.com/p/365698607) 