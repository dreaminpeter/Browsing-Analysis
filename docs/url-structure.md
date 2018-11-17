# URL Structure

An URL is composed by several parts that together creates the identifier used by browsers. Given the following URL

```
https://www.google.ca/search?q=chrome+storage+sync+extension&oq=chrome+storage+sync+extension
```

We can break it apart as the following

- `https/http` => scheme or protocol (default ports are https => 443, http => 80)
- `hostname` => www.google.ca => can be either a domain or an IP address (IPv4 or IPv6)
- `port` => 443 (because we're using the https protocol without specifying a different port)
- `host` => hostname + port => www.google.ca (just because this url is using the default port)
- `/search` => pathname
- `q=chrome+storage+sync+extension&oq=chrome+storage+sync+extension` => query string

In newer JavaScript versions (latest browsers), you have the [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)
