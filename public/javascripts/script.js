
function addToCart(productID) {
  $.ajax({
        url: '/add-to-cart/' + productID,
        method: 'get',
        success: (response) => {
            if(response.status){
                let count = $('#cart-count').html()
                count = parseInt(count)+1
                $('#cart-count').html(count)
            }
        }
    })
}

function changeQuantity(cartID,productID,count) {
    $.ajax({
        url:'/change-product-quantity',
        data:{
            cart:cartID,
            product:productID,
            count:count
        },
        method:'post',
        success:(response)=>{
            alert(response)
        }
    })
}