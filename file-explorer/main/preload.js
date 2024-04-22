const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
	on: (channel, callback) => {
		ipcRenderer.on(channel, callback);
	},
	send: (channel, args) => {
		ipcRenderer.send(channel, args);
	},
});
