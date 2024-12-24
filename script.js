const state = {
    earnings :0 ,
    expanses :0 , 
    net :0 ,
    transactions :[
{
    id: Math.floor(Math.random() * 1000),
    text:"Example",
    amount:10,
    type:  "credit",  
}
] ,


};


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
                        <div class="left">
                            <p>${text}</p>
                             <p>${sign}$ ${amount}</p>
                        </div>
                        <div class="status ${isCreadit ?"credit":"debit"}">${isCreadit ?"C":"D"} </div>
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
      id: Math.floor(Math.random() * 1000),
      text: text,
      amount: +amount,
      type: isEarn ? "credit" : "debit",
    };


  state.transactions.push(transaction);
  renderTransactions();
  console.log({ state });
}
renderTransactions();
transactionFormEl.addEventListener("submit",addTransaction) ;
