import { useState, useEffect } from "react";
import { ethers, utils } from "ethers";
import abi from "./contracts/ColorVote.json";
import "./App.css";

function App() {
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [inputValue, setInputValue] = useState({
        withdraw: "",
        deposit: "",
    });
    const [voterBlueBalance, setVoterBlueBalance] = useState(null);
    const [voterRedBalance, setVoterRedBalance] = useState(null);
    const [totalBlue, setTotalBlue] = useState(null);
    const [totalRed, setTotalRed] = useState(null);
    const [voterAddress, setVoterAddress] = useState(null);
    const [error, setError] = useState(null);

    const contractAddress = "0x05864A9131c99Ada7DC8b779acB6b97a53106167";
    const contractABI = abi.abi;

    const checkIfWalletIsConnected = async () => {
        try {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                const account = accounts[0];
                console.log("account: ", account);
                console.log("voterAddr: ", voterAddress);
                console.log("connected: ", isWalletConnected);
                if (account === voterAddress && isWalletConnected === true) {
                    setVoterAddress("");
                    setIsWalletConnected(false);
                    console.log("Account Disconnected");
                } else {
                    setVoterAddress(account);
                    setIsWalletConnected(true);
                    console.log("Account Connected: ", account);
                }
            } else {
                setError(
                    "Please install a Metamask Web3 wallet to use our bank."
                );
                console.log("No Metamask detected");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const totalVoteHandler = async () => {
        try {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                );
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                let blue = await contract.blueTotal();
                setTotalBlue(utils.formatEther(blue));
                let red = await contract.redTotal();
                setTotalRed(utils.formatEther(red));
                console.log(
                    `Retrieved totals, ${blue} for blue and ${red} for red`
                );
            } else {
                console.log("Ethereum object not found, install Metamask.");
                setError("Please install a MetaMask wallet to use our bank.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const voterBalanceHandler = async () => {
        try {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                );
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                let res = await contract.getUserVote();
                const blue = res[0];
                setVoterBlueBalance(utils.formatEther(blue));
                const red = res[1];
                setVoterRedBalance(utils.formatEther(red));
                console.log(
                    `Retrieved votes, ${blue} for blue and ${red} for red`
                );
            } else {
                console.log("Ethereum object not found, install Metamask.");
                setError("Please install a MetaMask wallet to use our bank.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const voteHandlerBlue = async (event) => {
        try {
            event.preventDefault();
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                );
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                const txn = await contract.voteBlue({
                    value: ethers.utils.parseEther(inputValue.deposit),
                });
                console.log("Voting blue...");
                await txn.wait();
                console.log("Voted blue!", txn.hash);

                voterBalanceHandler();
            } else {
                console.log("Ethereum object not found, install Metamask.");
                setError("Please install a MetaMask wallet to use our bank.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const unVoteHandlerBlue = async (event) => {
        try {
            event.preventDefault();
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                );
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                let myAddress = await signer.getAddress();
                console.log("provider signer...", myAddress);

                const txn = await contract.withdrawVote(
                    ethers.utils.parseEther(inputValue.withdraw),
                    "blue"
                );
                console.log("Withdrawing blue vote...");
                await txn.wait();
                console.log("UnVoted for Blue!", txn.hash);

                voterBalanceHandler();
            } else {
                console.log("Ethereum object not found, install Metamask.");
                setError("Please install a MetaMask wallet to use our bank.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const voteHandlerRed = async (event) => {
        try {
            event.preventDefault();
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                );
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                const txn = await contract.voteRed({
                    value: ethers.utils.parseEther(inputValue.deposit),
                });
                console.log("Voting red...");
                await txn.wait();
                console.log("Voted red!", txn.hash);

                voterBalanceHandler();
            } else {
                console.log("Ethereum object not found, install Metamask.");
                setError("Please install a MetaMask wallet to use our bank.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const unVoteHandlerRed = async (event) => {
        try {
            event.preventDefault();
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                );
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                let myAddress = await signer.getAddress();
                console.log("provider signer...", myAddress);

                const txn = await contract.withdrawVote(
                    ethers.utils.parseEther(inputValue.withdraw),
                    "red"
                );
                console.log("Withdrawing red vote...");
                await txn.wait();
                console.log("UnVoted for Red!", txn.hash);

                voterBalanceHandler();
            } else {
                console.log("Ethereum object not found, install Metamask.");
                setError("Please install a MetaMask wallet to use our bank.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (event) => {
        setInputValue((prevFormData) => ({
            ...prevFormData,
            [event.target.name]: event.target.value,
        }));
    };

    useEffect(() => {
        voterBalanceHandler();
    }, [isWalletConnected]);

    return (
        <div className="App">
            <header className="App-header">
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
