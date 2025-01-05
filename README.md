# Discord Bot ~Ava

A Discord bot with many commands, some of the commands:  
*Ban, mute, kick, modlogs, weather, choose, embed and more.*  

If you like this project, please give it a star! ⭐  

## Steps 
Needs to have Node.js Installed (*tested with v22.1.0.*)  
Clone the repository or download the .zip file (*and unzip it*):  
- Open the folder in VS Code  
- Open a new terminal and run:  
```
npm install (Installs node_modules & package-lock.json)  
```
### Update .env
```
TOKEN = Discord Bot Token  
WEATHER_API_KEY = WeatherAPI Key for weather.js
GIF_API_KEY = Giphy.com api for gif.js  
CLIENT_ID = Discord Bot ID  
BOT_VERSION = Discord Bot Version (optional)
```
- Run these commands:   
```
node deploy-commands.js (register slash commands)
node index.js (starts bot and creates database)
```

### *More commands soon* ☃️
