var Deeks;
//var deekAddress = "0x7F230741e6eF6937Ba389134d272f239ea9DC511";
var deekAddress = "0xFD9fb070F0F434B06D374a82Befbe9523C4196b1";
//var deekAddressLocal = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";
//var userAccount;

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
        let i = 0
        let deeksMenu = document.getElementById('deeksMenu');
        deeksMenu.style.display = 'block'
        let container = document.getElementById('deeks');
        let picked = false;

        getBalanceOf(account)
            .then(function(result) {
                var deek_count = parseInt(result);
                //console.log("Account has: " + deek_count + " Deek");
                if(deek_count > 0){
                    //deeksCount.innerHTML = (deek_count);
                    for (let i = 0; i < deek_count; i++) {
                        getTokenOfOwnerByIndex(account, i)
                            .then(function(resultToken) {
                                //console.log("Token "+(i+1)+": " + resultToken);
                                //getDeekName(resultToken)
                                //	.then(function(resultDeekName) {
                                //console.log("Deek "+(i+1)+" Name: " + resultDeekName);
                                var img_url = '/images/deek_clear/' + resultToken + '.png';
                                let deek = document.createElement('img');
                                deek.src = 'https://deekhash.xyz/' + img_url;
                                deek.className = 'deekImage';
                                deek.alt = 'alt text';
                                deek.width = 50
                                deek.height = 50
                                deek.onclick = function (click) {
                                    window.localStorage.setItem('deekImage', deek.src)
                                    let deeks = document.getElementsByClassName("deekImage");
                                    for (let i=0; i < deeks.length; i++) {
                                        if (deeks[i] !== deek) {
                                            deeks[i].style.border = 'none';
                                            deeks[i].style.borderRadius = 'none';
                                        }
                                    }
                                    deek.style.border = deek.style.border !== '2px solid black' ? '2px solid black' : 'none';
                                    deek.style.borderRadius = deek.style.borderRadius !== '25% 10%' ? '25% 10%' : 'none';
                                }
                                window.localStorage.setItem('deekImage', deek.src)
                                container.append(deek);
                                i++
                            /*   $.ajax({
                                    url:img_url,
                                    type:'HEAD',
                                    error: function()
                                    {
                                        $("#deeks").append(`<a href="/deek/`+resultToken+`" class="deeks-list-item arcaded"><img src="/images/clear-deek.png"/>Deek`+resultToken+`</a>`);

                                    },
                                    success: function()
                                    {
                                        $("#deeks").append(`<a href="/deek/`+resultToken+`" class="deeks-list-item arcaded"><img src="/images/deek_thumbnail/`+resultToken+`.png"/>Deek`+resultToken+`</a>`);
                                    }
                                });
                               */
                                //});
                            });
                    }
                } else {
                    //console.log("This Account has no Deeks");
                    if(js_lang == 'ru'){
                        $("#walletInfo").html(`В твоём кошельке нет ни одного Дика<br /><a href="/" title="Пора купить">Пора купить!</a>`);
                    } else {
                        $("#walletInfo").html(`You don’t have any Deeks in you wallet.<br /><a href="/" title="Buy some deeks">It's time to buy!</a>`);
                    }
                }
            })


        if(section == 'index'){
			/*
			getDeekPrice()
				.then(function(resultAPrice) {
					actualPrice.innerHTML = 'Actual price: <span class="green">'+ (resultAPrice/1000000000000000000) +' ETH</span>';
			});
			*/
			
			getTotalSupply()
				.then(function(resultTotal) {
					if(js_lang == 'ru'){
						bornCounter.innerHTML = '<span class="green">'+resultTotal+'</span> из <span class="green">10128</span> Диков уже создано!';
					} else {
						bornCounter.innerHTML = '<span class="green">'+resultTotal+'</span> Deeks out of <span class="green">10128</span> were born';
					}
					
					getSuperDeeksBorn()
						.then(function(resultTotalBest) {
						var normalDeeks =  resultTotal - resultTotalBest;
						if(normalDeeks == 10000 || normalDeeks > 10000){
							if(js_lang == 'ru'){
								$(".buy-deek-container").html('<h2>Ты опоздал!</h2><h3 class="tx_success">Все 10,000 Диков распроданы!<br /><br />Попробуй выиграть СуперДиков в наших конкурсах!</h3>');
							} else {
								$(".buy-deek-container").html('<h2>You late!</h2><h3 class="tx_success">All 10,000 Deeks are sold out!<br /><br />Try to win a unique SuperDeeks in our game</h3>');
							}	
						}
					});
			});
						  
			fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=83NNEWF158AJ695GKEEA7HSKNGNZIGQHM6')
			  .then((response) => {
			    return response.json();
			  })
			  .then((data) => {
			    //console.log(data.result.ProposeGasPrice);
			    var gprice = data.result.ProposeGasPrice;
			    if(gprice < 140){
				    if(js_lang == 'ru'){
				    	$("#gasprice").html('Средняя цена на газ: <span class="gasprice_low">'+ gprice +' gwei</span>');
				    } else {
				    	$("#gasprice").html('Average Gas Price: <span class="gasprice_low">'+ gprice +' gwei</span>');
				    }
			    } else if(gprice > 250){
				    if(js_lang == 'ru'){
				    	$("#gasprice").html('Средняя цена на газ: <span class="gasprice_high">'+ gprice +' gwei</span>');
				    } else {
			    		$("#gasprice").html('Average Gas Price: <span class="gasprice_high">'+ gprice +' gwei</span>');
			    	}
			    } else {
				    if(js_lang == 'ru'){
				    	$("#gasprice").html('Средняя цена на газ: '+ gprice +' gwei');
				    } else {
				    	$("#gasprice").html('Average Gas Price: '+ gprice +' gwei');
				    }
			    }
			});  
		}
		if(section == 'mywallet'){
			const account = currentAccount;
		    showAccount.innerHTML = ("Account: " + account);
		    //console.log("Account: "+account);		       
		    
		       getBalanceOf(account)
		       .then(function(result) {
				  var deek_count = parseInt(result);
				  //console.log("Account has: " + deek_count + " Deek");	  
				  if(deek_count > 0){
					  	deeksCount.innerHTML = (deek_count);	
				  		for (let i = 0; i < deek_count; i++) {
				  			getTokenOfOwnerByIndex(account, i)
							.then(function(resultToken) {
							  //console.log("Token "+(i+1)+": " + resultToken);
								//getDeekName(resultToken)
								//	.then(function(resultDeekName) {
									  //console.log("Deek "+(i+1)+" Name: " + resultDeekName);
									  var img_url = '/images/deek_thumbnail/' + resultToken + '.png';
										$.ajax({
										    url:img_url,
										    type:'HEAD',
										    error: function()
										    {
										        $("#deeks").append(`<a href="/deek/`+resultToken+`" class="deeks-list-item arcaded"><img src="/images/clear-deek.png"/>Deek`+resultToken+`</a>`);

										    },
										    success: function()
										    {
										       	$("#deeks").append(`<a href="/deek/`+resultToken+`" class="deeks-list-item arcaded"><img src="/images/deek_thumbnail/`+resultToken+`.png"/>Deek`+resultToken+`</a>`);
										    }
										});
								//});
							});	
						}
				  } else {
					//console.log("This Account has no Deeks");
				  	if(js_lang == 'ru'){
					  	$("#walletInfo").html(`В твоём кошельке нет ни одного Дика<br /><a href="/" title="Пора купить">Пора купить!</a>`);
					} else {
						$("#walletInfo").html(`You don’t have any Deeks in you wallet.<br /><a href="/" title="Buy some deeks">It's time to buy!</a>`);
					}  
				  }
				})
			
			mintStatus = checkSuperdeekMintStatus(account);
			if(mintStatus.state == 1){
				superdeekMintStatus.innerHTML = "<div class='infocontainer-warning'>" + mintStatus.info + "</div>";
			}
		}
		if(section == 'superdeek'){
			// Do Nothing
		}
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

async function createNewDeek() {
	var newdeek_name = document.getElementById("formStartName").value;
	newdeek_name = ClearDeekName(newdeek_name);
	newdeek_name = newdeek_name.toUpperCase();
	newdeek_name = newdeek_name.trim();	
	var js_lang = $(langID).html();
	js_lang = ClearSection(js_lang);
	
	ym(74363542,'reachGoal','click-buy');
	if(clear_name.length == 0 || clear_name.length < 2 || clear_name.length > 50){
		if(js_lang == 'ru'){
			document.getElementById("divForName").innerHTML = "<div class='infocontainer-error'>Имя должно быть от 2 до 50 символов</div>";
		} else {
			document.getElementById("divForName").innerHTML = "<div class='infocontainer-error'>Name must be between 2 and 50 characters</div>";
		}
		$(buyButton).removeClass("active-buy-button");
	} else {
		//var nameIsFree = CheckFreeName(newdeek_name);
		//alert("Free = " + nameIsFree);
		if(CheckFreeName(newdeek_name) != 1){
			//alert("Not Free");
			if(js_lang == 'ru'){
				document.getElementById("divForName").innerHTML = "<div class='infocontainer-error'>Это имя уже занято!</div>";
			} else {
				document.getElementById("divForName").innerHTML = "<div class='infocontainer-error'>This name is used by another user</div>";
			}
			$(buyButton).removeClass("active-buy-button");
		} else {			
			//alert("Make DNA");
			dna = GetDeekNA(newdeek_name);
			if(dna){
				//alert("DNA done: " + dna);
				var currentAccount = null;
				const accounts = await ethereum.request({ method: 'eth_accounts' });		   
				
				if (accounts.length === 0) {
				} else if (accounts[0] !== currentAccount) {
					currentAccount = accounts[0]; 
					
					getDeekPrice()
						.then(function(resultPrice) {
							// This is going to take a while, so update the UI to let the user know
							// the transaction has been sent
							if(js_lang == 'ru'){
								$("#txStatus").html('<div class="tx_info">Необходимо подтвердить операцию в кошельке Metamask.</div>');
							} else {
								$("#txStatus").html('<div class="tx_info">Please confirm the transaction in your Metamask wallet.</div>');	
							}
							$(buyButton).removeClass("active-buy-button");
								
							if(bookDeekName(newdeek_name, dna, currentAccount) != 1){
								$("#txStatus").html('<div class="tx_fail">Failed to book name.</div>');
								$(buyButton).removeClass("active-buy-button");
							} else {
								// Send the tx to our contract:
								return Deeks.methods.createDeek(newdeek_name, dna)
								.send({ from: currentAccount,  value: resultPrice })
								.on('transactionHash', function(hash){
									if(js_lang == 'ru'){
										$(".buy-deek-container").html('<h2>Ура!</h2><h3 class="tx_success">Транзакция успешно отправлена в блокчейн.<br />Дик <br />"'+ newdeek_name +'"<br /> появится в вашем <a href="/ru/my-wallet" title="My wallet">кошельке</a> в ближайшее время! Скорость создания Дика зависит от того, какую цену на газ вы поставили.</h3>');
									} else {
										$(".buy-deek-container").html('<h2>Yay!</h2><h3 class="tx_success">Transaction has been successfully sent to the blockchain.<br />The Deek <br />"'+ newdeek_name +'"<br /> gonna appear in your <a href="/my-wallet" title="My wallet">wallet</a> soon! It may take a while depending on how greedy u were settin up the gas price.</h3>');
									}						
									
									penDeek(newdeek_name, dna, currentAccount);
									ym(74363542,'reachGoal','meta-pay');
								})
								.on("error", function(error) {
									// Do something to alert the user their transaction has failed
									// alert('FAIL');
									$("#txStatus").html('<div class="tx_fail">'+error.message+'</div>');
									console.log(error);
									deboName(newdeek_name, dna, currentAccount);
									ym(74363542,'reachGoal','meta-cancel');
								})
								.on("receipt", function(receipt) {
									// Transaction was accepted into the blockchain, let's redraw the UI
									if(js_lang == 'ru'){
										$(".buy-deek-container").html('<h2>Поздравляем!</h2><h3 class="tx_success">ДИК <br />"'+ newdeek_name +'"<br /> был успешно создан. Посмотрите его в <a href="/ru/my-wallet" title="My wallet">своём кошельке</a>!</h3>');
									} else {
										$(".buy-deek-container").html('<h2>Congratulations!</h2><h3 class="tx_success">The Deek <br />"'+ newdeek_name +'"<br /> was born. Check <a href="/my-wallet" title="My wallet">Your wallet</a></h3>');
									}							
									
									ym(74363542,'reachGoal','pay-done');
									//console.log(receipt);
								})
								;
							}
					});
				}
				
			} else {
				document.getElementById("divForName").innerHTML = "<div class='infocontainer-error'>Failed to create deek DNA</div>";
				$(buyButton).removeClass("active-buy-button");	
			}
		}
	}
}

async function createNewSuperDeek() {	
	var promocode = document.getElementById("formPromocode").value;
	promocode = ClearDeekName(promocode);
	promocode = promocode.trim();
	
	if(promocode.length > 0){
		var currentAccount = null;
		const accounts = await ethereum.request({ method: 'eth_accounts' });
		if (accounts.length === 0) {
		} else if (accounts[0] !== currentAccount) {
			currentAccount = accounts[0]; 
			isPromocode = FindPromocode(promocode, currentAccount);
			if(isPromocode.state == 0){
				infoContainer.innerHTML = "<div class='infocontainer-error'>Promo code does not exist</div>";
			} else if(isPromocode.state == 2) {
				infoContainer.innerHTML = "<div class='infocontainer-error'>Superdeek already Issued</div>";
			} else if(isPromocode.state == 1) {
				//console.log('Promocode here. Lets mint a superdeek');
				$("#txStatus").html('<div class="tx_info">Please confirm the transaction in your Metamask wallet.</div>');
				$(getSuperDeekButton).removeClass("active-get-superdeek-button");
				infoContainer.innerHTML = "";
					
				newdeek_name = isPromocode.s_name;
				dna = isPromocode.s_dna;
				s_pormocode = isPromocode.s_promocode;
					
				if(bookDeekName(newdeek_name, dna, currentAccount) != 1){
					$("#txStatus").html('<div class="tx_fail">Failed to book name.</div>');
					$(buyButton).removeClass("active-buy-button");
				} else {
					return Deeks.methods.createSuperDeek(newdeek_name, dna, s_pormocode)
					.send({ from: currentAccount,  value: "0" })
					.on('transactionHash', function(hash){							
						$(".promocode-container").html('<h2>Yay!</h2><h3 class="tx_success">Transaction has been successfully sent to the blockchain.<br />The Deek <br />"'+ newdeek_name +'"<br /> gonna appear in your <a href="/my-wallet" title="My wallet">wallet</a> soon! It may take a while depending on how greedy u were settin up the gas price.</h3>');
						penDeek(newdeek_name, dna, currentAccount);
						bornSuperdeek(newdeek_name, dna, s_pormocode);
					})
					.on("error", function(error) {
						// Do something to alert the user their transaction has failed
						// alert('FAIL');
						$("#txStatus").html('<div class="tx_fail">'+error.message+'</div>');
						//console.log(error);
						$(getSuperDeekButton).addClass("active-get-superdeek-button");
						deboName(newdeek_name, dna, currentAccount);	
					})
					.on("receipt", function(receipt) {
						// Transaction was accepted into the blockchain, let's redraw the UI							
						$(".promocode-container").html('<h2>Congratulations!</h2><h3 class="tx_success">The Deek <br />"'+ newdeek_name +'"<br /> was born. Check <a href="/my-wallet" title="My wallet">Your wallet</a></h3>');
					});
				}		
			}	
		}
	}	
}

function makeNewName(){
	var deek_name = document.getElementById("formStartName").value;
	
	$(infoContainer).html("");
	clear_name = ClearDeekName(deek_name);
	clear_name = clear_name.toUpperCase();
	
	document.getElementById("formStartName").value = clear_name;
	$("#txStatus").html('');
	
	clear_name = clear_name.trim();
	if(clear_name.length == 0 || clear_name.length < 2 || clear_name.length > 50){
		document.getElementById("divForName").innerHTML = "<div class='infocontainer-error'>Name must be between 2 and 50 characters</div>";
		$(buyButton).removeClass("active-buy-button");
	} else {
		clear_name = clear_name.trim();
		document.getElementById("divForName").innerHTML = ("<div class='infocontainer-normal'>This name will be registered: " + clear_name +"</div>");
		$(buyButton).addClass("active-buy-button");
	}
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

function CheckFreeName(deek_name){
	var data = {deek_name: deek_name};    
	//return 1;
	$.ajax({
	    url: "/isdeekfree",
	    type: "POST",
	    async: false, 
	    data: data,
	        
	    success: function(response) {
	       	result_free = $.parseJSON(response);
	        /*
	        if(result_free.state == 1){
		       	//alert('Free');
		        callback.call(result_free.state);
	        }else{
		        //alert('Not Free');
		        callback.call(result_free.state);
	        }
	        */
	    },
	    error: function(response) {
	        //alert('Error');
	        console.log('Error. No data has been sent for isFree.');
	        //$('#new_deek_error_msg').html('Error. No data has been sent for isFree.');
	        //$('#new_deek_success_msg').html('');
	    }
	 });
	 	
	return result_free.state;
}

function FindPromocode(promocode, address){
	var data = {promocode: promocode, address: address};    

	$.ajax({
	    url: "/ispromocodeexist",
	    type: "POST",
	    async: false, 
	    data: data,
	        
	    success: function(response) {
	       	result_promo = $.parseJSON(response);
	    },
	    error: function(response) {
	        console.log('Error. No data has been sent for isPromocodeExist.');
	    }
	 });
	 	
	return result_promo;
}

function bookDeekName(newdeek_name, dna, rs){
	var data = {deek_name: newdeek_name, dna:dna, rs:rs};	  
	$.ajax({
	    url: "/bookdeekname",
	    type: "POST",
	    async: false, 
	    data: data,       
	    success: function(response) {
	       	result_book = $.parseJSON(response);
	    },
	    error: function(response) {
	        console.log('Error. No data has been sent for Booking.');
	    }
	 });
	return result_book.state;
}

function deboName(newdeek_name, dna, rs){
	var data = {deek_name: newdeek_name, dna:dna, rs:rs};
	$.ajax({
	    url: "/deboname",
	    type: "POST",
	    async: false, 
	    data: data,       
	    success: function(response) {
	       	result_debo = $.parseJSON(response);
	    },
	    error: function(response) {
		    alert('Error. No data has been sent for ReBooking.');
	    }
	 });
	
	return result_debo.state;
}


function bornSuperdeek(newdeek_name, dna, s_pormocode){
	var data = {newdeek_name: newdeek_name, dna:dna, s_pormocode:s_pormocode};
	$.ajax({
	    url: "/bornsuperdeek",
	    type: "POST",
	    async: false, 
	    data: data,       
	    success: function(response) {
	       	result_born = $.parseJSON(response);
	    },
	    error: function(response) {
		    alert('Error. No data has been sent for ReBooking.');
	    }
	 });
	 
	return result_born.state;
}


function penDeek(newdeek_name, dna, rs){
	var data = {deek_name: newdeek_name, dna:dna, rs:rs};
	$.ajax({
	    url: "/pendeek",
	    type: "POST",
	    async: false, 
	    data: data,       
	    success: function(response) {
	       	result_pend = $.parseJSON(response);
	    },
	    error: function(response) {
		    alert('Error. No data has been sent for Pendeek.');
	    }
	 });
	
	return result_pend.state;
}

function checkSuperdeekMintStatus(account){
	var data = {account: account};
	$.ajax({
	    url: "/checkmintstatus",
	    type: "POST",
	    async: false, 
	    data: data,       
	    success: function(response) {
	       	result_mint = $.parseJSON(response);
	    },
	    error: function(response) {
		    //alert('Error. No data has been sent for mintStatus.');
	    }
	 });
	return result_mint;
}

function GetDeekNA(deek_name){
	dna = crc32(deek_name);
	dna = dna.toString(16);		
	while (dna.length < 8) {
		dna = '0' + dna;
	}
	element9 = getASpecialItem(dna);
	dna = dna+element9+'000';
	return dna;
}

var makeCRCTable = function(){
	var c;
	var crcTable = [];
	for(var n =0; n < 256; n++){
	    c = n;
	    for(var k =0; k < 8; k++){
	        c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
	    }
	    crcTable[n] = c;
	}
	return crcTable;
}
	
var crc32 = function(str) {
	var crcTable = window.crcTable || (window.crcTable = makeCRCTable());
	var crc = 0 ^ (-1);
	for (var i = 0; i < str.length; i++ ) {
	    crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
	}
	return (crc ^ (-1)) >>> 0;
}

function getASpecialItem(dna){
	var specialItem;
	
	item1 = dna.charAt(0);
	item2 = dna.charAt(1);
	item3 = dna.charAt(2);
	item4 = dna.charAt(3);
	item5 = dna.charAt(4);
	item6 = dna.charAt(5);
	item7 = dna.charAt(6);
	item8 = dna.charAt(7);	
	if(item1 == 'd' && item6 == '9' && item5 == '9' && item7 == 'e'){
		specialItem = '1';
	} else if((item1 == '3' || item1 == 'e') && item4 == 'a'){
		specialItem = '2';
	} else if((item1 == '6' || item1 == '7') && item8 == '3' && item7 == '8'){
		specialItem = '3';
	} else if(item1 == '9' && item5 == 'e' && item8 == '0'){
		specialItem = '4';
	} else if(item4 == 'd' && item5 == '4' && item8 == '8'){
		specialItem = '5';
	} else {
		specialItem = '0';
	}		
	return specialItem;
}

if(connectButton){
connectButton.addEventListener('click', () => {
	ethereum.request({ method: 'eth_requestAccounts' });
});
}

if(buyButton){
buyButton.addEventListener('click', () => {
	var buyButtonActive = $(buyButton).hasClass('active-buy-button');
	if (buyButtonActive){
		createNewDeek();
	}
});
}

/*
if(buttonAboutGas){
buttonAboutGas.addEventListener('click', () => {
	$(classAboutGas).toggleClass('active-w');
});
}
*/

if(getSuperDeekButton){
	getSuperDeekButton.addEventListener('click', () => {
		var getSuperDeekButtonActive = $(getSuperDeekButton).hasClass('active-get-superdeek-button');
		if (getSuperDeekButtonActive){
		createNewSuperDeek();
		}
	});
}
