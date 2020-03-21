const indexedDb =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

let db;
const request = indexedDb.open('offlineTrans', 1);

request.onupgradeneeded = ({target}) =>{
    let db = target.result;
    db.createObjectStore("pending", {autoIncrement: true})
};

request.onsuccess = ({target}) =>{
    db = target.result;
    console.log('DB LOADED');
}

function saveRecord(data){
    console.log('saving record!')
    const transaction = db.transaction(['pending'], 'readwrite');
    const store = transaction.objectStore('pending');
    store.add(data)
}

