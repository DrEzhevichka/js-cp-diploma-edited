let url = 'https://jscp-diplom.netoserver.ru/';
function createRequest(body) {
   return fetch(url, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
   })
   .then(response => response.json())
   .catch(err => alert('Произошла ошибка ' + err));
}