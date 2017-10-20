# API Bus
Provides a middle layer between the backend services and the front end.  
It's purpose is to add a separation so if backend services changes version, 
name or splits the front end does not have to be updated.   

## Framework
The api uses the [Slim framework](https://www.slimframework.com/docs) 

## Structure
Simplified overview of structure  

- public/
  - index.php: Where the app starts
- src/
  - Routes/: Contains all the route classes including helpers
  - dependencies.php: Dependency injector
  - middleware.php: Middleware initialisation layer, lets you add additional middleware to the app
  - routes.php: Base file where routes are defined
  - settings.php: App settings
  

## Router
Each route is contained within it's own class. The route class should implement the RouteInterface 
and provide the routes in a static method called ::routes.  
The getClient method should provide a reference to an initialised GuzzleHttp\Client that has the 
correct base_uri.  
Examples of the route matching string can be found at [Router](https://www.slimframework.com/docs/objects/router.html)  

## Proxying
A large portion of requests at least initially will be simply proxied, therefor a helper trait 
SimpleProxyTrait  has been provided to reduce the repetition.  
Simply set the proxy method in the router callback and the method will determine the type of request.

## Config

To start development, go to `src/config` folder and copy `local.default.php` config file into `local.php`.

The settings array that is passed to the slim app constructor is handled by a package UserFrosting/config.  
It will merge together the config files so that we can have defaults and override the defaults with environment
specific configs.    
All config files are stored under the src/config directory. The default.php is the base file where production settings 
will be stored.  

## Examples
The Routes\Playlist will show you a generic proxy for GET.  
The Routes\Bin will show you generic proxying for things such as POST, PUT and DELETE.  
