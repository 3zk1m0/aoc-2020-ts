import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput.split('').map(x => parseInt(x))

const input = prepareInput(readInput())

const MAXCUP = 1000000;
const MINCUP = 1;

class Node {
  value: number
  right: Node
  left: Node

  constructor(value: number) {
    this.value = value
    this.left = this
    this.right = this
  }
}

const addNode = (value, head) => {
  const newNode = new Node(value)
  newNode.right = head
  newNode.left = head.left.right
  head.left.right = newNode
  head.left = newNode
  return newNode
}

const runGame = (rounds, lookup, head) => {
  let current = head
  for (let i = 0; i < rounds; i++) {
    const taken = current.right
    current.right = current.right.right.right.right
    let value = current.value
    let destination
    while (!destination) {
      value--
      if (value < MINCUP) value = MAXCUP
      if (
        value != taken.value &&
        value != taken.right.value &&
        value != taken.right.right.value
      ) {
        destination = lookup[value]
      }
    }
    taken.right!.right!.right = destination.right
    destination.right = taken
    current = current.right
  }
}

const goA = (input) => {
  const lookup = Array(9)

  let head = new Node(input[0])
  lookup[input[0]] = head
  input.slice(1).forEach((cup) => {
    const node = addNode(cup, head)
    lookup[cup] = node
  });

  runGame(100, lookup, head)
  
  const result = []
  let tmp = lookup[1].right
  while (tmp.value != 1) {
    result.push(tmp.value)
    tmp = tmp.right
  }

  return result.join('')
}

const goB = (input) => {
  const lookup = Array(9)

  let head = new Node(input[0])
  lookup[input[0]] = head
  input.slice(1).forEach((cup) => {
    const node = addNode(cup, head)
    lookup[cup] = node
  });

  for (let i = 10; i <= 1000000; i++) {
    const node = addNode(i, head)
    lookup[i] = node
  }

  runGame(10000000, lookup, head)

  return lookup[1].right.value * lookup[1].right.right.value
}

/* Tests */

// test()

/* Results */

// Solution to part 1: 25398647
// Solution to part 2: 363807398885

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
