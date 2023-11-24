const { app, BrowserWindow } = require("electron");

const { createWindow } = require("./window");

app.whenReady().then(createWindow); // Creating Window

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
