# Electron experiment

## up and running

- install node >= 11
- install yarn >=1.17
- clone https://github.com/plumpNation/electron-server-experiment and follow it's README

```
yarn start
```

## Cookies

### sent from server
To check the cookie being returned by the server use the curl command...

```
curl -c - http://localhost:1234
```

... or use Postman etc.

### sent to the server

When running the application, check the server console and you should see a
cookies being sent back.

## todo

- [x] add a debugger
- [x] make a request to the hello world endpoint
- [x] return a cookie from the hello world endpoint
- [x] retrieve the cookie
- [ ] build the app
- [ ] pass variables to the built app on the command line
- [ ] create config for dev and prod

