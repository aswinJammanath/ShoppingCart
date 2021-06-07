
function addToCart(productID) {
    $.ajax({
        url: '/add-to-cart/' + productID,
        method: 'get',
        success: (response) => {
            if (response.status) {
                let count = $('#cart-count').html()
                count = parseInt(count) + 1
                $('#cart-count').html(count)
            }
        }
    })
}

function changeQuantity(cartID, productID, count) {
    let quantity = parseInt(document.getElementById(productID).innerHTML)
    count = parseInt(count)

    $.ajax({
        url: '/change-product-quantity',
        data: {
            cart: cartID,
            product: productID,
            count: count,
            quantity: quantity
        },
        method: 'post',
        success: (response) => {
            if (response.removeProduct) {
                alert("Product removed from cart")
                location.reload()
            } else {
                document.getElementById(productID).innerHTML = quantity + count
            }
        }
    })
}

function removeQuantity(cartID,productID){
    $.ajax({
        url:'/remove-product',
        data:{
            cart:cartID,
            product:productID
        },
        method:'post',
        success:(response)=>{
            alert("Product removed from cart")
            location.reload()
        }
    })
}