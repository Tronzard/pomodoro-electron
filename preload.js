const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  ping: () => "pong",
  moveWindow: (dx, dy) => ipcRenderer.send("move-window", { dx, dy }),
  resizeWindow: () => ipcRenderer.send("resize-window"),
});
