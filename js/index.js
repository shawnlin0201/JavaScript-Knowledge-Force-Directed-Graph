
var btn_close = document.querySelector('.btn-close')

btn_close.addEventListener('click', function(){
    document.querySelector('.lightbox-wrapper').classList.remove('is-active')
})