let btns = document.querySelectorAll(".btn");
let ctrlbtns = document.querySelectorAll(".ctrl");
let turnX = true;
let count = 0

const resetGame = () => {
    for (let btn of btns) {
        btn.innerText = "";
        btn.disabled = false;
        btn.style.backgroundColor = "aqua"
        count=0;
    }
    document.querySelector(".msg-box").classList.add("hide");
}

ctrlbtns.forEach((ctrlbtn) => {
    ctrlbtn.addEventListener("click", resetGame)
})

document.querySelector("#reset").addEventListener("click",resetGame)

btns.forEach((btn) => {
    btn.addEventListener("click",()=>{
        if (turnX === true) {
            btn.innerText = "X";
            turnX = false;
        }
        else {
            btn.innerText = "0";
            turnX = true;
        }
        count++;
        btn.disabled = true;
        btn.style.backgroundColor = '#a7ecf8ff';
        console.log(count)
        
        if (checkWinner() === false && count===9) {
            showMsgBox("Its a tie, No One is winner")
            document.querySelector(".msg-box").style.backgroundColor = '#fa9d72ff';
        }
    })
//console.log(btn)
})

const showMsgBox = (msg) => {
 //   console.log(winner)

    for (let btn of btns) {
        btn.disabled = true;
    }
    
    document.getElementById("msg").innerText = msg;
    document.querySelector(".msg-box").classList.remove("hide");
}

function checkWinner() {
    let pos = [[0,1,2],
               [0,3,6],
               [0,4,8],
               [1,4,7],
               [3,4,5],
               [2,4,6],
               [2,5,8],
               [6,7,8]];

    let winner = false

   // console.log(pos[0])
    for (let i of pos) {
    //    console.log(i[0],i[1],i[2])
    //    console.log(btns[i[0]].innerText,btns[i[1]].innerText,btns[i[2]].innerText);

        let p1 = btns[i[0]].innerText
        let p2 = btns[i[1]].innerText
        let p3 = btns[i[2]].innerText

        if (p1 != "" && p2 != "" && p3 != "") {
            if (p1 === p2 && p2 === p3) {
                console.log("Winner is ", p1)
                showMsgBox(`Congratulations, Winner is ${p1}`);
                document.querySelector(".msg-box").style.backgroundColor = '#74ee98ff';
                winner = true
            }
        }
    }
    return winner;
}



// btns.forEach((btn) => {
//     btn.addEventListener("click",() => {
//         btn.innerText = "X";
//         console.log("Button was clicked ${btn.innerHTML}");
//     }))
//     // console.log(btn)
    
// }
