# **eMooring** #

A [mooring ](https://en.wikipedia.org/wiki/Mooring_(watercraft))refers to any permanent structure to which a vessel may be secured. eMooring modernizes the operation of marinas with the installation of a wireless sensor network to monitor mooring berths, measuring the sea water level and observing the weather conditions.

The marinas administrators have a clear view of the status of the berths, improving this way the quality of the services and the scheduling of the yachting trips


## How to Use ##
First, make sure you have **Node.js** (npm & bower) and **MongoDB** installed.

** 1. Clone **

```
#!javascript

git clone https://IvanLovric@bitbucket.org/IvanLovric/emooring.git
```


** 2. Setup web server and run it**

```
#!javascript

cd emooring/web-server
npm run demo
```

*This command will install all of the latest dependencies and run web server. Installation might take some time. If you’re failing to connect to the registries, try change the proxy variable.*

** 3. Run python coordinator**

```
#!javascript
cd emooring
python demo.py
```
*For example, you can set 15 numbers of iterations and 3 sensors.*


## Demo ##
Go to http://localhost:3000/eMooring/

![eMooring-demo.png](https://bitbucket.org/repo/zrMbeA/images/1354752457-eMooring-demo.png)