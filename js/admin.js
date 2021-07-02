let orderData = [];
const orderList = document.querySelector('.js-orderList');
function init(){
	getOrderList();
}
init();
function getOrderList(){
  axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders`,{
  	headers:{
  		authorization: token,
  	}
  })
  .then(function(res){
  	console.log(res.data);
  	orderData = res.data.orders;
  	//組訂單字串
  	let str = '';
  	orderData.forEach(function(item){
  		//組時間
  		const timeStamp = new Date(item.createdAt * 1000);
  		const orderTime = `${timeStamp.getFullYear()}/${timeStamp.getMonth()+1}/${timeStamp.getDate()}`;
  		console.log(orderTime);



  		//組產品字串
  		let productStr = "";
  		item.products.forEach(function(productItem){
  			productStr += `<p>${productItem.title} x ${productItem.quantity}</p>`
  		})
  		let orderStatus = '';
  		if(item.paid == true){
  			orderStatus = '已處理'
  		}else{
  			orderStatus = '未處理'
  		}
  		str +=`<tr>
		        <td>${item.id}</td>
		        <td>
		          <p>${item.user.name}</p>
		          <p>${item.user.tel}</p>
		        </td>
		        <td>${item.user.address}</td>
		        <td>${item.user.email}</td>
		        <td>
		          <p>${productStr}</p>
		        </td>
		        <td>${orderTime}</td>
		        <td class="orderStatus">
		          <a href="#" data-status="${item.paid}" class="js-orderStatus" data-id="${item.id}">${orderStatus}</a>
		        </td>
		        <td>
		          <input type="button" class="delSingleOrder-Btn js-orderDelete" data-id="${item.id}" value="刪除">
		        </td>
		    </tr>`		
	  	})
  		orderList.innerHTML = str;
  		renderC3();
	})
}


orderList.addEventListener('click',function(e){
	e.preventDefault();
	const targetClass = e.target.getAttribute('class');
	console.log(targetClass);
	let id = e.target.getAttribute('data-id');
	if(targetClass == 'js-orderStatus'){
		console.log(e.target.getAttribute('data-status'));
		let status = e.target.getAttribute('data-status');
		console.log(id);
		changeOrderItem(status,id)
		return;
	}
	if(targetClass == 'delSingleOrder-Btn js-orderDelete'){
		deleteOrderItem(id);
	}
})

function changeOrderItem(status,id){
	let newStatus;
	if(status == 'true'){
		newStatus = false;
	}else{
		newStatus = true;
	}
	axios.put(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders/`,{
	  "data": {
	    "id": id,
	    "paid": newStatus
	  }
	},{
  	headers:{
  		authorization: token,
  	}
  })
  .then(function(res){
    alert('修改訂單成功');
    getOrderList();
  })
}






function deleteOrderItem(id){
	axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders/${id}`,{
  	headers:{
  		authorization: token,
  	}
  })
	.then(function(res){
		alert('刪除訂單成功');
		getOrderList();
	})
}

function renderC3(){
	console.log(orderData);
	let total = {};
	orderData.forEach(function(item){
		item.products.forEach(function(productItem){
			if(total[productItem.category] == undefined){
				total[productItem.category] = productItem.price * productItem.quantity
			}else{
				total[productItem.category] += productItem.price * productItem.quantity
			}
		})
	})
	console.log(total);

	let categoryAry = Object.keys(total);
	console.log(categoryAry);
	let newData = [];
	categoryAry.forEach(function(item,i){
		let ary = [];
		ary.push(total[item],i+1);
		newData.push(ary);
		console.log(newData);
	})

	// C3.js
	let chart = c3.generate({
	    bindto: '#chart', // HTML 元素綁定
	    data: {
	        type: "pie",
	        columns: newData,
	        colors:{
	            "Louvre 雙人床架":"#DACBFF",
	            "Antony 雙人床架":"#9D7FEA",
	            "Anty 雙人床架": "#5434A7",
	            "其他": "#301E5F",
	        }
	    },
	});
}



const discardAllBtn = document.querySelector('.discardAllBtn');
discardAllBtn.addEventListener('click',function(e){
	axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders/`,{
  	headers:{
  		authorization: token,
  	}
  }).then(function(res){
  		alert('刪除訂單成功');
		getOrderList();
  })
})











