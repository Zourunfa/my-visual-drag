import { reactive } from 'vue'

interface CommandExecute {
  undo: () => void,
  redo: () => void
}

interface Command {
  name: string, //命令标志
  keyboard?: string | string[], //命令快捷键
  execute: (...args: any[]) => CommandExecute,
  flollowQueue?: boolean //命令执行完成之后是否需要执行undo redo存入命令队列
}

function createComander() {
  const state = reactive({
    current: -1,
    queue: [] as CommandExecute[],
    commands: {} as Record<string, (...args: any[]) => void>
  })

  const registry = (command: Command) => {
    state.commands[command.name] = (...args) => {
      console.log('state:', state);


      const { undo, redo } = command.execute(...args)
      console.log(undo, redo);

      if (command.flollowQueue !== false) {


        state.queue.push({ undo, redo })
        state.current = state.current + 1
      }
      redo()


    }
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
          console.log(state.queue);
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





  return {
    state,
    registry
  }
}

export { Command, createComander }