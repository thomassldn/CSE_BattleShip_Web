
let copybutton = document.getElementById('copybutton');


copybutton.addEventListener('click', e =>{
    //let urlValue = url.value;
    let url = document.getElementById('url_link');
    if(url === null) return false;
    url.focus();
    url.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        alert('Copying text command was ' + msg);
      } catch (err) {
        alert('Oops, unable to copy');
      }
});
