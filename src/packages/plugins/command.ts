import { onMounted, onUnmounted, reactive } from 'vue'

interface CommandExecute {
  undo: () => void,
  redo: () => void
}

interface Command {
  name: string, //命令标志
  keyboard?: string | string[], //命令快捷键
  execute: (...args: any[]) => CommandExecute,
  flollowQueue?: boolean //命令执行完成之后是否需要执行undo redo存入命令队列
  init?: () => (() => void | undefined),  //命令初始化函数
  data?: any   //命令缓存的数据
  // destroy?: () => (() => void | undefined),
}

function createComander() {
  const state = reactive({
    current: -1,
    queue: [] as CommandExecute[],
    commandArray: [] as Command[],
    destroyList: [] as ((() => void) | undefined)[],
    commands: {} as Record<string, (...args: any[]) => void>
  })

  const registry = (command: Command) => {
    state.commandArray.push(command)
    state.commands[command.name] = (...args) => {

      console.log('command.name:', command.name);
      console.log('state:', state);


      const { undo, redo } = command.execute(...args)

      redo()
      if (command.flollowQueue === false) {
        return
      }
      let { queue, current } = state
      if (queue.length > 0) {
        queue = queue.slice(0, current + 1)
        state.queue = queue
      }
      queue.push({ undo, redo })
      state.current = current + 1;
    }

  }

  const init = () => {
    console.log('init');

    const onKeydown = (e: KeyboardEvent) => {
      console.log('监听到键盘事件')
    }
    window.addEventListener('keydown', onKeydown)

    // debugger
    state.commandArray.forEach(command => {
      // !!command.init && console.log(command.init())
      console.log('command-init');


      return !!command.init && state.destroyList.push(command.init())
    })
    state.destroyList.push(() => window.removeEventListener('keydown', onKeydown))
  }



  registry({
    name: 'undo',
    keyboard: 'ctrl+z',
    flollowQueue: false,
    execute: () => {


      return {
        undo: () => {
          // 命令被執行的時候，要做的事情
        },
        redo: () => {
          // 重做的事情


          const { current } = state


          if (current === -1) {
            return
          }
          console.log('curent:', current);
          const { undo } = state.queue[current]


          if (undo) {
            undo()
          }
          state.current--

        }
      }
    }
  })


  registry({
    name: 'redo',
    keyboard: [
      'ctrl+y',
      'ctrl+shirt+z'
    ],
    flollowQueue: false,
    execute: () => {


      // 
      return {
        redo: () => {

          let { current } = state

          if (!state.queue[current + 1]) return
          console.log(state.queue);

          const { redo } = state.queue[current + 1]
          redo()
          state.current += 1
        },
        undo: () => {

        }
      }
    }
  })
  onUnmounted(() => state.destroyList.forEach(fn => !!fn && fn()))



  return {
    state,
    registry,
    init,
  }
}

export { Command, createComander }