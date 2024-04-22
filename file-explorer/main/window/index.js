const { app, BrowserWindow } = require("electron");
const serve = require("electron-serve");
const { registerTitlebarIpc } = require("./titlebarIpc");

const appServe = app.isPackaged
	? serve({
			directory: path.join(__dirname, "../out"),
		})
	: null;

function createAppWindow() {
	appWindow = new BrowserWindow({
		width: 800,
		height: 600,
		backgroundColor: "#202020",
		show: false,
		autoHideMenuBar: true,
		frame: false,
		titleBarStyle: "hidden",
		icon: path.resolve("assets/images/icon.ico"),
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			nodeIntegrationInWorker: false,
			nodeIntegrationInSubFrames: false,
			preload: APP_WINDOW_PRELOAD_WEBPACK_ENTRY,
			sandbox: false,
		},
	});

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

	// Show window when its ready to
	appWindow.on("ready-to-show", () => appWindow.show());

	// Register Inter Process Communication for main process
	registerMainIPC();

	// Close all windows when main window is closed
	appWindow.on("close", () => {
		appWindow = null;
		app.quit();
	});

	return appWindow;
}

function registerMainIPC() {
	/**
	 * Here you can assign IPC related codes for the application window
	 * to Communicate asynchronously from the main process to renderer processes.
	 */
	registerTitlebarIpc(appWindow);
}

module.exports = { createAppWindow };
