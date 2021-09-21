# ![Overwatch Pugs Logo](https://media.discordapp.net/attachments/362749870387363841/867199378511233024/Untitled.png)
Discord bot application that helps players sort out teams in Overwatch based on roles.

## Programming language and Tools used
<p align="left"><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a> <a href="https://nodejs.org" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a></p>

## How to use
Currently the bot can't be used in multiple servers at the same time, so I have no way to host this bot.

Luckily, setting up the bot is pretty easy:

**Requirements:**
* Node.js
* Any IDE (e.g. VSCode, you can even use your default text editor if you really have to)
* Discord Bot Application (Please use this [guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot))

First step is to clone the directory using ```git clone https://github.com/gasech/OWPUGs.git``` or downloading the ZIP file directly from the repository page and extracting it into your computer.


In the root folder, create a new file named `.env`, inside the file you can put your token like this `TOKEN=YOURTOKEN`

Should look like this
```
TOKEN=12a34bc456defc234257cfvcv3d351xyz
```

You can save the file and close it and open Node.js command prompt.

Go to your directory using `cd C:\Users\youruser\Documents\OWPUGS`

Write the following command `node index.js`, your bot should be running now.

**How to use**

First off you have to invite your bot application to the server you want to play with other players.

After this, you have to create the following roles below in your server, you can do it manually or by typing `pugs!createroles` (To use this command you have to give your bot server permissions):

```
Main Tank, Off Tank, DPS Hitscan, DPS Flex, Flex Support, Main Support
```

To start picking up teams, you need atleast 12 players in a voice channel, type `pugs!pickup` and it should start picking up players and setting up teams.

The rest should be pretty much straightforward, you can type `pugs!commands` to see all the commands

**Tasks**

- [ ] Add integration with MongoDB