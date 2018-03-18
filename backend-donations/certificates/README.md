# Certificates used by OAuth 2.0 module (simple_oauth)
https://www.drupal.org/project/simple_oauth

Generate a pair of keys to encrypt the tokens. And store them in this folder for security reasons.
```
./private.key
./public.key
```
```
openssl genrsa -out private.key 2048
openssl rsa -in private.key -pubout > public.key
```

Path to these keys should be stored in /admin/config/people/simple_oauth

