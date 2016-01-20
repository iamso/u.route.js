u.route.js
==========
simple routing for the browser

Example Setup
-------------

### Javascript
```javascript
var auth = function(route) {
  return function(req) {
    if (window.authorized) {
      if (route) {
        u.route.redirect(route, true);
        return false;
      }
      else {
        return true;
      }
    }
    else {
      if (req.pathname !== '/signin') {
        u.route.redirect('/signin', true);
        return false;
      }
      else {
        return true;
      }
    }
  };
};

u.route.use(function(req){
  console.log('use', req);
});

u.route('/', auth('/home'));

u.route('/signin', auth('/home'), function(req) {
  console.log('signin route', req);
});

u.route('/signout', function(req) {
  console.log('signout route', req);
  redirect('/signin');
});

u.route('/forgot/:token?', function(req) {
  console.log('forgot route', req);
});

u.route('/home', auth(), function(req) {
  console.log('home route', req);
});

u.route('/item/:id', auth(), function(req) {
  console.log('item route', req);
});

u.route('/item/:id/edit', auth(), function(req) {
  console.log('edit route', req);
});

u.route('/new', auth(), function(req) {
  console.log('new route', req);
});

u.route('/search/:q?', auth(), function(req) {
  console.log('search route', req);
});

u.route.default = function(req) {
  console.log('fallback route', req);
};

u.route.init();

```

### .htaccess 

```apacheconf
RewriteEngine On
RewriteBase /

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-l
RewriteRule ^ index.html [QSA,L]
```


License
-------

[MIT License](LICENSE)
