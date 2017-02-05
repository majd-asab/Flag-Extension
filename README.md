# FlagExtension

The purpose of this project is to display the IP address of the website you are visiting simultaneously as you navigate, and display the country's flag that the server belongs to.   
While there are other full extensions that are similar, this project point is to have dns lookup based on **your own dns servers** and **not** some 3rd party dns server which could jeopardize the integrity of the dns lookup.    

## Installation

* the entension part will be up on google-chrome's extension site available for download once the flags are mapped to the servers.   
For the meanwhile follow the instruction to run on google chrome:
1. clone the repo and place in a prefered location.
2. open chrome://extensions  in google chrome and enable `developer mode`
3. click on `Load unpacked extension...` and `open` the folder you cloned from the repo.   

## Usage
1. open a terminal window and run the dns.js file using the following command `node dns.js`    
2. you are done! start navigating websites and watch the ip address appear at the bottom right of the screen.

Note:    
1. Flags will be added very soon.
2. a dns-cache.txt file will appear, that stores your dns lookups. this will be used to map the ip's to the flags and prevent unnecessary redundant calls. This file will be set to be deleted every 48 horus.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


TODO: Write license
