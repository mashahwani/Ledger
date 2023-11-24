// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  require: require,
});
contextBridge.exposeInMainWorld("api", {
  // Function to fetch data from the main process
  fetchDataFromMain: async (pageNumber = 0) => {
    return await ipcRenderer.invoke("fetchDataFromMain", pageNumber);
  },
  // Add a new record
  addLedgerRecord: async (data) => {
    return await ipcRenderer.invoke("addLedgerRecord", data);
  },

  total: async () => {
    return await ipcRenderer.invoke("total");
  },
  deleteRecord: async (id) => {
    return await ipcRenderer.invoke("deleteRecord", id);
  },
  editRecord: async (data) => {
    return await ipcRenderer.invoke("editRecord", data);
  },

  // search record
  search: async (word) => {
    return await ipcRenderer.invoke("search", word);
  },
});
