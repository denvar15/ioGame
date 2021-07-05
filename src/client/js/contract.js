var Deeks;
var deekAddress = "0x7F230741e6eF6937Ba389134d272f239ea9DC511";
//var deekAddress = "0xFD9fb070F0F434B06D374a82Befbe9523C4196b1"; - TestNet

const infoContainer = document.querySelector('#infomsg-container');
const connectButton = document.querySelector('#button-connect');
const buyButton = document.querySelector('#button-buy');
const letsConnectContainer = document.querySelector('.lets-connect-container');
const mainContainer = document.querySelector('.main-container');
const showAccount = document.querySelector('.showAccount');
const actualPrice = document.querySelector('#actial_price');
const deeksCount = document.querySelector('#showDeeksCount');
const bornCounter = document.querySelector('#born_counter');
const getSuperDeekButton = document.querySelector('#button-get-superdeek');
const superdeekMintStatus = document.querySelector('#txMintStatus');
//const buttonAboutGas = document.querySelector('#more_about_gas_fee');
const classAboutGas = document.querySelector('.class_about_gas');
const langID = document.querySelector('#langid');
const playerNameInput = document.getElementById('playerNameInput');
const nameLabel = document.getElementById('menu_input_label-js');



async function startApp(section, item_id, js_lang) {
	Deeks = new web3js.eth.Contract(DeekABI, deekAddress);
	       
	var currentAccount = null;
	const accounts = await ethereum.request({ method: 'eth_accounts' });
	
	section = ClearSection(section);
	js_lang = ClearSection(js_lang);
		
	if (accounts.length === 0) {
		// MetaMask is locked or the user has not connected any accounts
		if(js_lang == 'ru'){
			console.log('Необходимо подключить MetaMask.');
		} else {
			console.log('Please connect to MetaMask.');
		}
	} else if (accounts[0] !== currentAccount) {
        window.localStorage.clear()
		currentAccount = accounts[0];  
	}
	
	if(currentAccount != null){
        //alert('Metamask Connected');
		//$(letsConnectContainer).removeClass("active-w");
		//$(mainContainer).addClass("active-w");
	
        const account = currentAccount;
        const shortAccount = account.substr(0, 10);
        
        let i = 0
        let deeksMenu = document.getElementById('deeksMenu');
        deeksMenu.style.display = 'block'
        let container = document.getElementById('deeks');
        let picked = false;
        
        playerNameInput.value = '';
        
        $("#startMenu_address").html(`Address:<br />`+account+`<br />`+shortAccount);

        getBalanceOf(account)
            .then(function(result) {
                var deek_count = parseInt(result);
                //console.log("Account has: " + deek_count + " Deek");
                if(deek_count > 0){
	                $("#deeks_empty_info").html(``);
                    //deeksCount.innerHTML = (deek_count);
                    for (let i = 0; i < deek_count; i++) {
                        getTokenOfOwnerByIndex(account, i)
                            .then(function(resultToken) {
                                //console.log("Token "+(i+1)+": " + resultToken);
                                getDeekName(resultToken)
                                	.then(function(resultDeekName) {
                                //console.log("Deek "+(i+1)+" Name: " + resultDeekName);
                                var img_url = '/images/deek_clear/' + resultToken + '.png';
                                let deek = document.createElement('img');
                                deek.src = 'https://deekhash.xyz/' + img_url;
                                deek.className = 'deekImage';
                                deek.alt = 'Deek ' + resultToken;
                                deek.width = 50
                                deek.height = 50
                                
                                deek.onclick = function (click) {
	                                playerNameInput.value = resultDeekName; 
	                                $(nameLabel).html(`Name: `+resultDeekName); 
	                                     
                                    window.localStorage.setItem('deekImage', deek.src)
                                    let deeks = document.getElementsByClassName("deekImage");
                                    for (let i=0; i < deeks.length; i++) {
                                        if (deeks[i] !== deek) {
                                            deeks[i].style.border = '2px solid #ffffff';
                                            //deeks[i].style.borderRadius = 'none';
                                        }
                                    }
                                    //deek.style.display = 'inline'
                                    deek.style.border = deek.style.border !== '2px solid #00e400' ? '2px solid #00e400' : 'none';
                                    deek.style.borderRadius = deek.style.borderRadius !== '10px' ? '10px' : 'none';
                                    $("#startButton").addClass("active-play");
                                }
                                
                                window.localStorage.setItem('deekImage', deek.src)
                                container.append(deek);
                                
								});
                                
                                i++
                            });
                    }
                } else {
                    $("#deeks_empty_info").html(`<p style="margin-top: 0;">You don’t have any Deeks for game!</p><p><b>To start the game, you must have at least one token from <a href="https://deekhash.xyz" title="Buy some deeks" target="_blank" rel="nofollow noopener">Deekhash.xyz</a></b></p>`);
                }
            })
	} else {
		//alert('Metamask is not connected');
        let start = document.getElementById('startMenuWrapper');
        start.style.display = 'none';
        let metamaskConnect = document.getElementById('metamaskConnect');
        metamaskConnect.style.display = 'block'
        //$(mainContainer).removeClass("active-w");
		//$(letsConnectContainer).addClass("active-w");
		//$("#m_cont").html('');
	}
}

function getTotalSupply() {
    return Deeks.methods.totalSupply().call();
}

function getSuperDeeksBorn() {
    return Deeks.methods.getSuperDeeksBorn().call();
}

function getDeekDna(id) {
    return Deeks.methods.dnaByTokenId(id).call();
}
      	
function getDeekName(id) {
	return Deeks.methods.nameByTokenId(id).call();
}
      
function getBalanceOf(address) {
    return Deeks.methods.balanceOf(address).call();
}

function getTokenOfOwnerByIndex(address, index) {
    return Deeks.methods.tokenOfOwnerByIndex(address, index).call();
}

function getDeekPrice() {
    return Deeks.methods.getDeekPrice().call();
}

function ClearDeekName(deek_name){
	deek_name = deek_name.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
	deek_name = deek_name.replace(/[^a-z0-9@!.,;:=_)(\s]/gi, '');
	deek_name = deek_name.trimLeft();
	return deek_name;
}

function ClearSection(section){
	section = section.replace(/[^a-z]/gi, '');
	section = section.trim();
	return section;
}

if(connectButton){
connectButton.addEventListener('click', () => {
	ethereum.request({ method: 'eth_requestAccounts' });
});
}