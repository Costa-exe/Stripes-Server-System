# Stripes Server System

## Table of Contents

* [About The Project](#about-the-project)
* [Technologies](#technologies)
* [Setting Up](#setting-up)
* [How To Launch](#how-to-launch)

## About The Project

Stripes Server System is a local server with a built-in file managing system.
It is meant to be used to exchange data through LAN within different devices.
As version 1.1.0 is out, the application is only able to work on x64 Linux-based operation systems.


## Technologies

The project is built with:

* HTML, CSS, JavaScript (Client-Side);
* Node.js (Server-Side);

### NPM Packages used:

* [directory-tree](https://www.npmjs.com/package/directory-tree)
* [express](https://www.npmjs.com/package/express)
* [express-fileupload](https://www.npmjs.com/package/express-fileupload)
* [body-parser](https://www.npmjs.com/package/body-parser)
* [systeminformation](https://www.npmjs.com/package/systeminformation)
* [check-disk-space](https://www.npmjs.com/package/check-disk-space)
* [pkg](https://www.npmjs.com/package/pkg)

## Setting Up

Before launching you have to set up the NetParams.json file.

Download the latest release, extract the "Stripes Server System" folder and open it.

Open the "NetParams.json", this file contains two parameters "port" and "ip":

```
{
    "port" : 3000,
    "ip" : ""
}
```

fill the "ip" value with your ipv4 private address.
For example if your ipv4 is 0.0.0.0, fill the field like this:

```
{
    "port" : 3000,
    "ip" : "0.0.0.0"
}
```

you can also change the port with another one for whatever reason, but be sure to use a free port.

## How To Launch

Locate inside the "Stripes Server System" folder.

Open a terminal inside the folder and type:

```
$./run.sh
```   

you will obtain a response like this:

```
Server Listening on 0.0.0.0:3000
```
now open your browser and type "0.0.0.0:3000" in the URL field to reach the server and access the file manager.

YOUR DEVICE AND THE SERVER HAVE TO BE CONNECTED TO THE SAME INTERNET CONNECTION TO MAKE THEM COMMUNICATE.

To stop the connection press the keys "ctrl+c" on the terminal running the application on the server.

If you close the terminal without stopping the application the connection on the specified port will stay up until a reboot or shutdown of the server.

Usually you can also start the conection by pressing twice on run.sh, if you have a graphic desktop enviroment on your server, and choose to run it through terminal or not. Be carefull to run it on terminal or you won't be able to close the connection without a shutdown or reboot of the server. 
