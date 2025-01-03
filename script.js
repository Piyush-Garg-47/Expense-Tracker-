const state = {
    earnings :0 ,
    expanses :0 , 
    net :0 ,
    transactions :[ ] ,


};

let isUpdate = false ; 
let tid ;

const transactionFormEl = document.getElementById("transactionForm");

const renderTransactions  = () =>{
    const transactionContainerEl = document.querySelector(".transactions");
    const netAmountEl = document.getElementById("netAmount");
    const earningsEl = document.getElementById("earnings");
    const expansesEl = document.getElementById("expanses");

    const transactions = state.transactions 

    let earnings = 0 ;
    let expanses = 0 ;
    let net = 0 ; 
    transactionContainerEl.innerHTML = "";
    transactions.forEach((transaction)=>{
        const {id , amount , text , type} = transaction ; 
        const isCreadit = type === 'credit' ? true :false ; 
        const sign = isCreadit ? '+':'-';
       const transactionEl = `
         <div class="transaction" id="${id}">
                 <div class="content" onclick ="showEdit(${id})">
                       <div class="left">
                            <p>${text}</p>
                             <p>${sign}$ ${amount}</p>
                        </div>
                        <div class="status ${isCreadit ?"credit":"debit"}">${isCreadit ?"C":"D"} </div>
                        <div class="lower">
                           <div class="icon" onclick ="handleUpdate(${id})">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAUVBMVEX///8AAAB/f39HR0cxMTH39/ft7e37+/vIyMgbGxtra2v09PQREREmJiYJCQm7u7vT09OZmZlfX1+wsLB2dnY8PDyOjo5UVFTg4OCmpqY6OjrZ8ydbAAACw0lEQVR4nO3c2W6rMBSFYUMzNUMzdEjb93/Qk1OlBGMbY1yLtdD6r3rX/VVFGCS2MUoppZRSSimllFJKKTWn6nrqCf6muqpmIbk5ZiH5ccxAcnfQSxoHuaTloJZYDmJJx0ErcRykEo+DUuJ1EEoCDjpJ0EEm6XFQSXodRJKIg0ayfopBWCRLSeCSBKXl4ydqSb1YNT8zS273j1lIfu6DM5Dc7+f0kuZcQi5pna+oJdY5kVjSOe/SSpxzO6nE8/xBKfE+RxFKAs+DSRIESPC5NkEC7UiQgDsGS+AdAyUEjkESCscACYkjKqFxRCREjl4JlaNHQuYISugcAQmhwyuhdHgkpA5HQuvoSIgdlmQ94fy/jXZYkunLcEBJshxAkkwHjCTbcZMs47+meH/gYL5/yFEoOeQokRxylEgOOUokhxwlkkOOEskhR4nkkKNEcshRIjnkKJEccpRIDjlKJIccJZJDjhIN2AdA4Rj05RCFI1+C4siV4DjyJEiOHAmEY5P0rSCuw2zTvnqEdZhF4vebqI5dlfolKqbDHKs8CYrjfsgaLYFxmPvYIyU4DrOvMiRAjlMz1AgJkMOcH2MlS5Ac5tIaLFEC5TCH9mh0+wAerezhyPYBtHrtjEe1D6DdW3dAon0AVu/OiDT7AKzWL+6QJPsA7Da+MSn2AXT68P7BCfYBdLv6/3Xg9wE4Pfsh6PsAnD4DDvB9AG5fQQjyPgBP2zAEdx+Ar0UPBHUfgK9dnwN0H4C3Yz8EcR+Av7TtRbgOE38KBNsHEGofhaB8sd3fKe7gkJzjDA7JJa7gkBziiP+O7WbqQSOtoob9U33cTT1mvO4LFLvD5XyaesKBOS9Qfnt5f3uFvy5auS9Qbj1fPzbItz5P7guUxfbrc+qpRmS9QCG5rL01L1CILmtvV8LL2ts332WtlFJKKaWUUkoppZRSWf0Dn7ImZ7FjAmEAAAAASUVORK5CYII=" alt="pen">
                           </div>
                           <div class="icon" onclick ="handleDelete(${id})">
                            <img src="data:image/png;base64,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" alt="trash">
                           </div>
                        </div>
                       </div>
                    </div>
                    </div>
       `; 

       earnings += isCreadit ?amount :0 ; 
       expanses += !isCreadit ?amount :0 ; 
        net = earnings - expanses ; 
       transactionContainerEl.insertAdjacentHTML("afterbegin" , transactionEl) ;


    }); 
       netAmountEl.innerHTML = `$ ${net}`;
       earningsEl.innerHTML = `$ ${earnings}`;
       expansesEl.innerHTML = `$ ${expanses}` ; 
} ;

const addTransaction = (e) => {
    e.preventDefault();
  
    const isEarn = e.submitter.id === "earnBtn" ? true : false;
  
    const formData = new FormData(transactionFormEl);
    const tData = {};
  
    formData.forEach((value, key) => {
        tData[key] = value;
    });
    const { text, amount } = tData;
    const transaction = {
      id: isUpdate ? tid : Math.floor(Math.random() * 1000),
      text: text,
      amount: +amount,
      type: isEarn ? "credit" : "debit",
    };
 if(isUpdate){
   const tindex = state.transactions.findIndex((t) => t.id === tid) ; 

   state.transactions[tindex] = transaction ; 
   isUpdate = false ; 
   tid = null; 
 }else{
   state.transactions.push(transaction);
 }
  renderTransactions();
  console.log({ state });
}

const showEdit = (id) =>{
const selectedTransactions = document.getElementById(id);
const lowerEl = selectedTransactions.querySelector(".lower");
lowerEl.classList.toggle("showTransaction");
};
const handleUpdate =(id) =>{ 
isUpdate = true ; 
tid = id ;
const transaction = state.transactions.find((t) => t.id === id ) ; 
const{text , amount} = transaction ; 
const textInput  = decodeURIComponent.getElementById("text");
const amountInput = document.getElementById("amount");
textInput.value = text ;
amountInput.value = amount ; 
};
const handleDelete =(id) =>{
    const filteredTransaction = state.transactions.filter((t) =>t.id !== id) ;
    state.transactions = filteredTransaction  ;
    renderTransactions();
};
renderTransactions();
transactionFormEl.addEventListener("submit",addTransaction) ;
