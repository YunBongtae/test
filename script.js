// console.log(222)
let realData = []
const reservationStatus = {
    reserved : '예약',
    seated : '착석 중',
}
const reservationStatusBtn = {
    reserved : '착석',
    seated : '퇴석',
}
const reservationStatusChange = {
    reserved : 'seated',
    seated : 'done',
}

const customerDetail = {
    name : '고객 성명',
    level : '고객 등급',
    memo : '고객 메모',
    request : '요청사항',
}
const reservationDetail = {
    status : {
        value : '예약 상태',
        render: (data)=>{
            return reservationStatus[data]
        }
    },
    timeReserved : {
        value : '예약 시간',
        render: (data)=>{
            return setDate(data)
        }
    },
    timeRegistered : {
        value : '접수 시간',
        render: (data)=>{
            return setDate(data)
        }
    },
}

const setDate = (date)=>{
    const setDate = new Date(date) 
    let hour = setDate.getHours();
    let minute = setDate.getMinutes();
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    return `${hour}:${minute}`
}

const detailRenderFunc = (index)=>{
    const data = realData[index]
    let renderReservationData = ''
    let renderCustomerData = ''
    const customerObj = data.customer
    Object.keys(reservationDetail).forEach((value)=>{
        const reservationObj =  typeof(reservationDetail[value]) == 'object' && reservationDetail[value]
        renderReservationData+= `
         <tr>
              <th>${reservationObj.value}</th>
               <td><span class="${value}">${reservationObj.render(data[value])}</span></td>
        </tr>
        `
    })
    Object.keys(customerDetail).forEach((value)=>{
        console.log(value, data)

        renderCustomerData+= `
         <tr>
              <th>${customerDetail[value]}</th>
              <td><span class="${value}">${customerObj[value]}</span></td>
        </tr>
        `
    })
    document.getElementById('reservationDetail').innerHTML = renderReservationData
    document.getElementById('customerDetail').innerHTML = renderCustomerData
}
function updateData(index, value) {
  realData[index].status = reservationStatusChange[value];
}

//데이터 갱신 후 이벤트 업데이트
const init = ()=>{
    const btnList = document.querySelectorAll(".item-box-btn");
    btnList.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id')
            const findData = realData.find(element => element.id === id);
            var index = realData.findIndex(i => i.id == id); 
            updateData(index, findData.status )
            renderFunc()
        });
    });
    const boxList = document.querySelectorAll(".item-box");
    boxList.forEach(box => {
        box.addEventListener('click', (e) => {
            if(e.target.tagName =='BUTTON') return;
            const id = e.currentTarget.getAttribute('data-id')
            var index = realData.findIndex(i => i.id == id); 
            
            if(window.innerWidth < 1024){
                document.getElementsByClassName('item-detail')[0].classList.add('show')
            }
            detailRenderFunc(index)
        });
    });

    document.getElementById('dim').addEventListener('click', (e) => {
        document.getElementsByClassName('item-detail')[0].classList.remove('show')
    })
    
}
const menuData = (list)=>{
    const returnData = []
    list.map((data)=>{
        returnData.push(`${data.name}(${data.qty})`)
    })
    return returnData.join()
}
const tableData = (list)=>{
    const returnData = []
    list.map((data)=>{
        returnData.push(data.name)
    })
    return returnData.join()
}

const renderFunc = ()=>{
    const result = realData.filter(data => data.status !== 'done');
    let returnData = ''
    result.map((data)=>{
        const customer = data?.customer
        returnData +=  `<li class="item-box" data-id="${data?.id}">
                <div class="item-box-left">
                <span class="item-box-time">${setDate(data?.timeReserved)}</span>
                <span class="item-box-reservation ${data?.status}">${reservationStatus[data?.status]}</span>
                </div>
                <div class="item-box-center">
                <div class="item-box-name">${customer?.name} - ${tableData(data?.tables)}</div>
                <div class="item-box-person">성인 : ${customer?.adult || 0}명 아이 : ${customer?.adult || 0}명</div>
                <div class="item-box-menu">${menuData(data?.menus)}</div>
                </div>
                <button class="item-box-btn ${data?.status}" data-id="${data?.id}">${reservationStatusBtn[data?.status]}</button>
            </li>`
        
    })
    document.getElementById('reservationList').innerHTML = returnData
    init()
}

const changeFunc = (data, itme)=>{
    renderFunc()// 데이터 변경 이후 항상 화면 랜더링
    
}
fetch('https://frontend.tabling.co.kr/v1/store/9533/reservations')
 	.then(res => res.json())
    .then((data) => {
        realData = data?.reservations
        renderFunc()
        detailRenderFunc(0)
    });