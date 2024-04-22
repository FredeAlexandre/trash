const { app, BrowserWindow } = require("electron");
const path = require("node:path");

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
		autoHideMenuBar: true,
		frame: false,
		titleBarStyle: "hidden",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	win.maximize();

	if (app.isPackaged) {
		appServe(win).then(() => {
			win.loadURL("app://-");
		});
	} else {
		win.loadURL("http://localhost:3000");
		win.webContents.on("did-fail-load", (e, code, desc) => {
			win.webContents.reloadIgnoringCache();
		});
	}
};

app.on("ready", () => {
	createWindow();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
