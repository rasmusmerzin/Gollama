import { app, BrowserWindow } from "electron";
import path from "path";

if (require("electron-squirrel-startup")) app.quit();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 300,
    icon: path.join(__dirname, "ollama.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.setMenu(null);
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
