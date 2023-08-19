const apiKey = 'YOUR API KEY HERE';

        let web3;
        let contractAddress = '0xc14B4d4CA66f40F352d7a50fd230EF8b2Fb3b8d4';
        let userAddress;
        
        async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to use this dApp!');
        return;
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });

    web3 = new Web3(window.ethereum);
    userAddress = await web3.eth.getAccounts().then(accounts => accounts[0]);
    let today = new Date();
    let dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = today.toLocaleDateString('en-US', dateOptions);

    document.getElementById('todayDate').value = formattedDate;
    document.getElementById('userAddress').value = userAddress;

    console.log('Connected to wallet:', userAddress);
    
    await checkTokenBalance();
    }

    window.addEventListener('DOMContentLoaded', () => {
        const connectButton = document.getElementById('cnctBtn');
        connectButton.addEventListener('click', connectWallet);
      });
        
      
      async function checkTokenBalance() {
        if (!web3 || !userAddress) {
          alert('Please connect your wallet first!');
          return;
        }
      
        let url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${userAddress}&tag=latest&apikey=${apiKey}`;
      
        try {
          let response = await fetch(url);
          let data = await response.json();
      
          if (data.status === '1') {
            let balance = Number(data.result) / 10 ** 18;
            balance = balance.toFixed(4);
            document.getElementById('tokenBalance').value = balance;
      
            let tier = calculateTier(balance);
            document.getElementById('yourTier').value = tier;
      
            console.log('Token Balance:', balance);
      
            let priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=blocktools&vs_currencies=usd');
            let priceData = await priceResponse.json();
      
            if (priceResponse.status === 200) {
              let currentPrice = priceData.blocktools.usd;
              let marketCap = currentPrice * 100000;
              document.getElementById('marketCap').value = marketCap;
              document.getElementById('toolsPrice').value = currentPrice;
              console.log('Market Cap:', marketCap);
      
              // Calculate portfolio value
              let portfolioValue = balance * currentPrice;
              document.getElementById('portFolio').value = portfolioValue;
      
            } else {
              document.getElementById('marketCap').value = 'Error fetching market cap';
              document.getElementById('toolsPrice').value = 'Error fetching tools price';
              document.getElementById('portFolio').value = 'Error calculating portfolio value';
            }
      
          } else {
            document.getElementById('tokenBalance').value = 'Error fetching token balance';
          }
        } catch (error) {
          console.error(error);
          document.getElementById('tokenBalance').value = 'Error fetching token balance';
          document.getElementById('toolsPrice').value = 'Error fetching tools price';
          document.getElementById('portFolio').value = 'Error calculating portfolio value';
        }
      }
      
      function calculateTier(balance) {
        if (balance >= 1 && balance <= 50) {
          return 1;
        } else if (balance >= 51 && balance <= 150) {
          return 2;
        } else if (balance >= 151 && balance <= 350) {
          return 3;
        } else if (balance >= 351 && balance <= 700) {
          return 4;
        } else if (balance >= 701 && balance <= 1200) {
          return 5;
        } else if (balance > 1200) {
          return 6;
        }
      
        return 'N/A';
      }
