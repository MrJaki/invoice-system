const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1800,
    height: 1100
  });

  win.loadFile(
    path.join(
      __dirname,
      "../frontend/dist/index.html"
    )
  );
}


app.whenReady().then(() => {

  // Start backend inside Electron
  require(
    path.join(
      __dirname,
      "../backend/app.js"
    )
  );

  createWindow();

});


app.on("window-all-closed", () => {
  app.quit();
});