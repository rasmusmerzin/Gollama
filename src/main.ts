import { app, BrowserWindow, shell } from "electron";
import path from "path";

if (require("electron-squirrel-startup")) app.quit();

function createWindow() {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 560,
    minHeight: 420,
    icon: path.join(__dirname, "ollama.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.endsWith("devtools")) window.webContents.toggleDevTools();
    else shell.openExternal(url);
    return { action: "deny" };
  });
  window.setMenu(null);
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    window.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  const windows = BrowserWindow.getAllWindows();
  if (windows.length === 0) createWindow();
  for (const window of windows) window.setMenu(null);
});
