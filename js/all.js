console.log('hello');
console.log(api_path,token);

let productData = [];
let cartData = [];
const productList = document.querySelector('.productWrap');
const productSelect = document.querySelector('.productSelect');

const cartDataList = document.querySelector('.cartDataList');
const productWrap = document.querySelector('.productWrap');

const orderInfoForm = document.querySelector('.orderInfo-form');
//change
productSelect.addEventListener('change',function(e){
	let selected = e.target.value;
	console.log(selected);
	if(selected == '全部'){
		getProductList();
		return;
	}
	let str ='';
	productData.forEach(function(item){	
		if(item.category == selected){
			str += `<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}" alt="">
                <a href="#" class="js-addCart" data-id='${item.id}'>加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${item.origin_price}</del>
                <p class="nowPrice">NT$${item.price}</p>
            </li>`;
		}		
	})
	productList.innerHTML = str;
})
function init(){
	getProductList();
	getCartList();
}
init();
function getProductList(){
	axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
	.then(function(response){
		console.log(response);
		productData = response.data.products;
		console.log(productData);
		let str = '';
		productData.forEach(function(item){
		    str += `<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}" alt="">
                <a href="#" class="js-addCart" id="addCardBtn" data-id='${item.id}'>加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${item.origin_price}</del>
                <p class="nowPrice">NT$${item.price}</p>
            </li>`;
		})
		productList.innerHTML = str;
	})
}
//addToCart
productWrap.addEventListener('click',function(e){
	e.preventDefault();
	let addCartClass = e.target.getAttribute('class');
	// if(addCartClass !== 'js-addCart'){
	// 	console.log(addCartClass);
	// 	return;
	// }
	let addCartId = e.target.getAttribute('data-id');
	getCartItem(addCartId);
})

function getCartItem(id){
	let numCheck = 1;
	cartData.forEach(function(item){
	  if(item.product.id == id){
	  	numCheck = item.quantity +=1;
	  }
	})
	
	axios.post('https://livejs-api.hexschool.io/api/livejs/v1/customer/james/carts',
	{
	  "data": {
	    "productId": id,
	    "quantity": numCheck
	  }
	})
	.then(function(res){
		console.log(res);
		getCartList();
	})
	
}




//getCartList

function getCartList(){
	axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/james/carts`)
	.then(function(res){
		console.log(res);
		cartData = res.data.carts;
		console.log(cartData);
		console.log(res.data.finalTotal);
		document.querySelector('.js-total').textContent = res.data.finalTotal;
		renderCartList();
	})
}

function renderCartList(){
	let str = '';
	// 
	cartData.forEach(function(item){
		str+= `<tr class="${item.id}">
		<td>
            <div class="cardItem-title">
                <img src="${item.product.images}" alt="">
                <p>${item.product.title}</p>
            </div>
        </td>
        <td>NT$${item.product.price}</td>
        <td>${item.quantity}</td>
        <td>NT$${item.product.price * item.quantity}</td>
        <td class="discardBtn">
            <a href="#" class="material-icons" data-id="${item.id}" data-product="${item.product.title}">
                clear
            </a>
        </td>
        </tr>`;
	})
	cartDataList.innerHTML =str;
}

//discardBtn 刪除特定
const shoppingCartList = document.querySelector('.cartDataList');
shoppingCartList.addEventListener('click',function(e){
	e.preventDefault();
	const cartId = e.target.getAttribute('data-id');
	if(cartId == null){
		alert('你點擊到其他東西了');
		return;
	}
	const cartTitle = e.target.getAttribute('data-product');
	console.log(cartTitle);
	axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
	.then(function(res){
		alert(`刪除 ${cartTitle} 品項成功`);
		getCartList();
	})
})



//discardAllBtn 刪除全部
const discardAllBtn = document.querySelector('.discardAllBtn');

discardAllBtn.addEventListener('click',function(e){
	e.preventDefault();
	axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
	.then(function(res){
		alert('全部刪除購物車成功');
		getCartList();
	})

})


//送出訂單
const orderInfoBtn = document.querySelector('.orderInfo-btn');
orderInfoBtn.addEventListener('click',function(e){
	e.preventDefault();
	if(cartData == 0){
		alert('請加入購物車');
		return;
	}

	
	const customerName = document.querySelector('#customerName').value;
	const customerPhone = document.querySelector('#customerPhone').value;
	const customerEmail = document.querySelector('#customerEmail').value;
	const customerAddress = document.querySelector('#customerAddress').value;
	const tradeWay = document.querySelector('#tradeWay').value;
	if(customerName == "" || customerPhone == "" || customerEmail == "" || customerAddress == "" || tradeWay == ""){
		alert('資料不得為空');
		return;
	}
	console.log(customerName,customerPhone,customerEmail,customerAddress,tradeWay);
	axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,{
	  "data": {
	    "user": {
	      "name": customerName,
	      "tel": customerPhone,
	      "email": customerEmail,
	      "address": customerAddress,
	      "payment": tradeWay
	    }
	  }
	}).then(function(res){
		alert('訂單建立成功');
		getCartList();
		orderInfoForm.reset();
	})
})








