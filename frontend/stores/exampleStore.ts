import { defineStore } from 'pinia';

export const useExampleStore = defineStore('exampleStore', {
  state: () => ({
    message: 'Hello from Pinia!',
    counter: 0,
  }),
  actions: {
    increment() {
      this.counter++;
    },
    updateMessage(newMessage: string) {
      this.message = newMessage;
    },
  },
  getters: {
    upperCaseMessage: (state) => state.message.toUpperCase(),
  },
});
