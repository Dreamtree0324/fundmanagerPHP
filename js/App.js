class App {
    constructor() {
        this.list = document.querySelectorAll("nav > ul > a");
        this.fundList = [];
        this.fundCnt = 1; //현재 펀드 번호

        this.list.forEach(x => {
            x.addEventListener("click", this.changeMenu.bind(this));
        });

         //투자자 리스트
        this.invList = [];

        this.articleList = document.querySelectorAll("article");

        this.loadingMethod = {
            "list": this.loadingList.bind(this),
            "register": this.loadingRegister.bind(this),
            "investor": this.loadingInvestor.bind(this)
        }

        this.invContainer = document.querySelector(".inv-list");

        this.fundContainer = document.querySelector(".fund_list");

        document.querySelector("#register button").addEventListener("click", this.registerFund.bind(this));

        this.list[0].click();

        this.popup = document.querySelector(".popup");
        document.querySelector("#btnClose").addEventListener("click", this.closePopup.bind(this));
        document.querySelector("#btnInvest").addEventListener("click", this.investFund.bind(this));

        this.signCanvas = document.querySelector("#sign");
        this.signCanvas.width = this.signCanvas.clientWidth;
        this.signCanvas.height = this.signCanvas.clientHeight;
        this.sCtx = this.signCanvas.getContext("2d");

        this.beforePoint= {x:0, y:0};
        this.startDraw = false;
        this.signCanvas.addEventListener("mousedown", (e) => {
            this.startDraw = true;
            this.beforePoint.x = e.offsetX;
            this.beforePoint.y = e.offsetY;
        });

        this.signCanvas.addEventListener("mouseup", (e) => {
            this.startDraw = false;
        });

        this.signCanvas.addEventListener("mousemove", (e) => {
            if(!this.startDraw) return;
            this.sCtx.beginPath();
            this.sCtx.moveTo(this.beforePoint.x, this.beforePoint.y);
            this.sCtx.lineTo(e.offsetX, e.offsetY);
            this.sCtx.stroke();
            this.beforePoint.x = e.offsetX;
            this.beforePoint.y = e.offsetY;
            
        })

        this.toastContainer = document.querySelector("#toastList");
    }

    investFund() {
        let fundNo = document.querySelector("#investNo").value;
        const fund = this.fundList.find(x => x.number == fundNo);
        if (!fund) {
            return;
        };

        let money = document.querySelector("#money").value * 1;
        if (money <= 0) {
            this.showMsg("금액을 올바르게 입력하세요");
            return;
        }
        let result = fund.invest(money);
        this.showMsg(result.msg);
        let name = document.querySelector("#name").value;
        let signData = this.signCanvas.toDataURL();

        if (result.success) {
            //투자 성공시
            this.popup.querySelector("#btnClose").click();
            
            let inv = new Investor(fund, name, money, signData);
            this.invList.push(inv);

            this.list[0].click();

            console.log(inv);
        }

    };

    openPopup(fund) {
        this.popup.querySelector("#investNo").value = fund.number;
        this.popup.querySelector("#investName").value = fund.name;
        this.popup.querySelector("#name").value = "";
        this.popup.querySelector("#money").value = 0;
        this.sCtx.clearRect(0,0, this.signCanvas.width, this.signCanvas.height);
        this.popup.classList.add("active");
        
    };

    closePopup() {
        this.popup.classList.remove("active");
    };

    changeMenu(e) {
        e.preventDefault();
        let target = e.target.dataset.target;

        this.articleList.forEach(x => x.classList.remove("active"));
        document.querySelector("#" + target).classList.add("active");

        this.list.forEach(x => x.classList.remove("active"));
        e.target.classList.add("active");

        this.loadingMethod[target]();

        let inner = document.querySelector(".inner_content");
        let h = document.querySelector("#" + target).clientHeight;
        inner.style.height = h + 'px';
    }

    //펀드 등록 페이지
    loadingRegister() {
        let no = "00000" + this.fundCnt;
        no = no.substring(no.length - 5);

        document.querySelector("#fundNo").value = no;
        document.querySelector("#fundName").value = "";
        document.querySelector("#endDate").value = "";
        document.querySelector("#total").value = "";
    }

    //펀드 등록 로직
    registerFund() {
        let no = document.querySelector("#fundNo").value;
        let name = document.querySelector("#fundName").value;
        let endDate = document.querySelector("#endDate").value;
        let total = document.querySelector("#total").value;

        if (name == "" || endDate == "" || total == "") {
            this.showMsg("값이 누락되어 있습니다.");
            return;
        }

        let fund = new Fund(no, name, endDate, total);
        this.fundList.push(fund);
        this.showMsg("등록되었습니다.");
        this.fundCnt++;
        this.list[0].click();
    }

    //펀드 리스트 페이지
    loadingList() {
        this.fundContainer.innerHTML = "";
        this.fundList.forEach(x => {
            let div = x.getTemplate();
            this.fundContainer.appendChild(div);
            div.querySelector("button").addEventListener("click", () => {
                this.openPopup(x);
            });
            x.drawCircle();
        });
    }

    //투자자 목록 페이지
    loadingInvestor() {
        this.invContainer.innerHTML= "";
        this.invList.forEach(x => {
            this.invContainer.appendChild(x.getTemplate());
        });
    }

    showMsg(msg) {
        let div = document.createElement("div");
        div.classList.add("toast");
        div.innerHTML = `
        <p class="msg">${msg}</p>
        <span class="close">&times;</span>`;

        let closed = false;

        let closeTimer = setTimeout( () => {
            if(closed) return;
            div.style.opacity = 0;
            setTimeout(() => {
                this.toastContainer.removeChild(div);
            }, 600);
        }, 2500);

        div.querySelector(".close").addEventListener("click", () => {
            closed = true;
            div.style.opcity = 0;
                this.toastContainer.removeChild(div);
        });

        this.toastContainer.appendChild(div);

    }

}

window.onload = function () {
    const app = new App();
}