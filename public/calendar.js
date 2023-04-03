const currentTitle = document.getElementById('current-year-month');
const calendarBody = document.getElementById('calendar-body');
let today = new Date();
const thisDate = new Date();
let first = new Date(today.getFullYear(), today.getMonth(),1);
const dayList = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const monthList = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const leapYear=[31,29,31,30,31,30,31,31,30,31,30,31];
const notLeapYear=[31,28,31,30,31,30,31,31,30,31,30,31];
let pageFirst = first;
let pageYear;
let reCheckIn;
let reCheckOut;

if((first.getFullYear() % 4 === 0 && first.getFullYear() % 100 !== 0) || first.getFullYear() % 400 === 0){
    pageYear = leapYear;
}else{
    pageYear = notLeapYear;
}

function showCalendar(){
    let monthCnt = 100;
    let cnt = 1;
    for(let i = 0; i < 6; i++){
        const $tr = document.createElement('tr');
        $tr.setAttribute('id', monthCnt);   
        for(let j = 0; j < 7; j++){
            if((i === 0 && j < first.getDay()) || cnt > pageYear[first.getMonth()]){
                const $td = document.createElement('td');
                $tr.appendChild($td);     
            }else{
                const $td = document.createElement('td');
                $td.textContent = cnt;
                $td.setAttribute('id', cnt);                
                $tr.appendChild($td);
                cnt++;
            }
        }
        monthCnt++;
        calendarBody.appendChild($tr);
    }
    currentTitle.innerHTML = monthList[first.getMonth()] + '&nbsp;&nbsp;&nbsp;&nbsp;'+ first.getFullYear();
}
showCalendar();

function removeCalendar(){
    let catchTr = 100;
    for(let i = 100; i< 106; i++){
        const $tr = document.getElementById(catchTr);
        $tr.remove();
        catchTr++;
    }
}

function prev(){
    if(pageFirst.getMonth() === 1){
        pageFirst = new Date(first.getFullYear()-1, 12, 1);
        first = pageFirst;
        if((first.getFullYear() % 4 === 0 && first.getFullYear() % 100 !== 0) || first.getFullYear() % 400 === 0){
            pageYear = leapYear;
        }else{
            pageYear = notLeapYear;
        }
    }else{
        pageFirst = new Date(first.getFullYear(), first.getMonth()-1, 1);
        first = pageFirst;
    }
    today = new Date(today.getFullYear(), today.getMonth()-1, 1);
    if (today.getMonth() === thisDate.getMonth()) {
        today = thisDate;
    }
    currentTitle.innerHTML = monthList[first.getMonth()] + '&nbsp;&nbsp;&nbsp;&nbsp;'+ first.getFullYear();
    removeCalendar();
    showCalendar();
    clickedDate1 = document.getElementById(today.getDate());
    clickedDate1.classList.add('active');
    clickStart();
}

function next(){
    if(pageFirst.getMonth() === 12){
        pageFirst = new Date(first.getFullYear()+1, 1, 1);
        first = pageFirst;
        if((first.getFullYear() % 4 === 0 && first.getFullYear() % 100 !== 0) || first.getFullYear() % 400 === 0){
            pageYear = leapYear;
        }else{
            pageYear = notLeapYear;
        }
    }else{
        pageFirst = new Date(first.getFullYear(), first.getMonth()+1, 1);
        first = pageFirst;
    }
    today = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    if (today.getMonth() === thisDate.getMonth()) {
        today = thisDate;
    }
    console.log('next' + today);
    currentTitle.innerHTML = monthList[first.getMonth()] + '&nbsp;&nbsp;&nbsp;&nbsp;'+ first.getFullYear();
    removeCalendar();
    showCalendar(); 
    clickedDate1 = document.getElementById(today.getDate());
    clickedDate1.classList.add('active');  
    clickStart();
}

let clickedDate1 = document.getElementById(today.getDate());
clickedDate1.classList.add('active');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);
let tdGroup = [];

function clickStart(){
    for(let i = 1; i <= pageYear[first.getMonth()]; i++){
        tdGroup[i] = document.getElementById(i);
        if (reCheckIn) {
            if ((i < reCheckIn.getDate() && first.getMonth() === reCheckIn.getMonth()) || first.getMonth() < reCheckIn.getMonth()) {
                tdGroup[i].setAttribute('class', 'before');
            }
        } else {
            if ((i < thisDate.getDate() && first.getMonth() === thisDate.getMonth()) || first.getMonth() < thisDate.getMonth()) {
                tdGroup[i].setAttribute('class', 'before');
            }
        }
        tdGroup[i].addEventListener('click', changeToday);
    }
}

function changeToday(e){
    for(let i = 1; i <= pageYear[first.getMonth()]; i++){
        if(tdGroup[i].classList.contains('active')){
            tdGroup[i].classList.remove('active');
        }
        if (e.currentTarget.className === 'before') {
            alert('해당 날짜는 선택할 수 없습니다. 다시 선택하십시오.');
            break;
        }
        clickedDate1 = e.currentTarget;
        clickedDate1.classList.add('active');
        today = new Date(today.getFullYear(), today.getMonth(), clickedDate1.id);
    }
}
clickStart();

const btn = document.getElementById('nextbtn');
btn.addEventListener('click', checkOut);
const caption = document.getElementById('caption');
const buttons = document.getElementById('buttons');
let newBtn = document.getElementById('prevbtn');
newBtn.addEventListener('click', checkIn);
const calendar = document.querySelector('.calendar');

function checkOut() {
    if (!reCheckIn) {
        reCheckIn = today;
        console.log('checkin' + moment(reCheckIn, "YYYY-MM-DD 15:00:00"));
    }
    removeCalendar();
    showCalendar();
    caption.textContent = "체크아웃";
    btn.textContent = "완료";
    if (newBtn.style.display != 'none') {
        reCheckOut = today;
        console.log('checkout' + moment(reCheckOut, "YYYY-MM-DD 11:00:00"));
        if (reCheckIn.getFullYear() === reCheckOut.getFullYear() && reCheckIn.getMonth() === reCheckOut.getMonth() && reCheckIn.getDate() === reCheckOut.getDate()) {
            alert('숙박은 1박 이상 가능합니다. 날짜를 다시 선택하십시오.');
            btn.textContent = "다음";
            reCheckIn = null;
            reCheckOut = null;
            today = thisDate;
        }
        calendar.style.display = 'none';
        btn.style.display = 'none';
        newBtn.style.display = 'none';
        document.getElementById('recheck').textContent = `${reCheckIn} ~ ${reCheckOut}`;
    } else {
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        newBtn.style.display = 'inline-block'
    }
    console.log('today' + today);
    clickedDate1 = document.getElementById(today.getDate());
    clickedDate1.classList.add('active');  
    clickStart();
}

function checkIn() {
    reCheckIn = null;
    caption.textContent = "체크인";
    btn.textContent = "다음";
    newBtn.style.display = 'none';
    removeCalendar();
    showCalendar();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    clickedDate1 = document.getElementById(today.getDate());
    clickedDate1.classList.add('active');  
    clickStart();
}

const openCal = document.getElementById('open-cal');
openCal.addEventListener('click', OpenCalendar);

function OpenCalendar() {
    if (calendar.style.display === 'none') {
        calendar.style.display = 'block';
        btn.style.display = 'inline-block';
        checkIn();
    } else {
        calendar.style.display = 'none';
        btn.style.display = 'none';
        newBtn.style.display = 'none';
    }
}