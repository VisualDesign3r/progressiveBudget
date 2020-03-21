const static_cache = 'my-static-cache-v1';
const data_cache = 'my-data-cache-v1';

const filesToCache = [
    "/" ,
    "/db.js",
    "/index.html",
    "/index.js",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
]

self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(static_cache).then(function(cache){
            console.log('opened cache!');
            return cache.addAll(filesToCache)
        })
    )
})

self.addEventListener('fetch', function(event){
    console.log('fetching!')
    if(event.request.url.includes('/api')){
        console.log('API CACHE TRIGGERED!')
        //handle API request
        event.respondWith(
            caches.open(data_cache).then(function(cache){
                return fetch(event.request)
                .then(response=>{
                    if(response.status === 200){
                        cache.put(event.request.url, response.clone())
                    }
                    return response
                })
                .catch(err=>{
                    return cache.match(event.request.url)
                })
            })
        )
        return;
    }

    event.respondWith(
        fetch(event.request).catch(function(){
            return caches.match(event.request).then(function(res){
                if(res){
                    return res
                }else {
                    return caches.match('/index.html')
                }
            })
        })
    )
})