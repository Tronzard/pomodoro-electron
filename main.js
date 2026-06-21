const { app, BrowserWindow } = require("electron");
const path = require("path");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1,
    height: 1,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    resizable: false,
    alwaysOnTop: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile("index.html");

  win.once("ready-to-show", () => {
    resizeToContent();
    win.show();
  });
}

function resizeToContent() {
  setTimeout(() => {
    win.webContents
      .executeJavaScript(
        `
      ({
        width: document.body.scrollWidth,
        height: document.body.scrollHeight
      })
    `,
      )
      .then((size) => {
        win.setContentSize(size.width, size.height);
      });
  }, 80);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
