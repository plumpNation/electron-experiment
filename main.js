// Modules to control application life and create native browser window
const { app, BrowserWindow, session } = require('electron')
const config = require('config')

const fetch = require('electron-fetch').default;
const { Cookie } = require('tough-cookie') // could use CookieJar
const path = require('path')

const program = require('./program')

const apiPath = 'http://localhost:1234'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

console.log(config.get('foo'))

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // createWindow();
  getCookie().then(testCookie);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////

async function testCookie() {
  const cookie = await session.defaultSession.cookies.get({url: apiPath});

  return fetch(apiPath + '/test-cookie', {
    headers: {
      cookie: cookie[0].name + '=' + cookie[0].value,
    },
    credentials: 'same-origin'
  });
}

function getCookie() {
  return fetch(apiPath)
    .then((res) => {
      return Promise.all([
        res,
        storeCookies(res)
      ]);
    })
    .then(([res]) => res.json())
    .then(body => console.log(body))
    .catch(e => console.log(e));
}

function storeCookies(res) {
  const cookie = Cookie.parse(res.headers.get('set-cookie'));

  return session.defaultSession.cookies.set({
    url: apiPath,
    name: cookie.key,
    value: cookie.value,
  });
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

