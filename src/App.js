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
    const [voterBlueBalance, setVoterBlueBalance] = useState("0.0");
    const [voterRedBalance, setVoterRedBalance] = useState("0.0");
    const [totalBlue, setTotalBlue] = useState(0);
    const [totalRed, setTotalRed] = useState(0);
    const [totalVotes, setTotalVotes] = useState(0);
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
                setTotalVotes(parseFloat(totalBlue) + parseFloat(totalRed));
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

    const resetError = (event) => {
        setError(null);
    };

    useEffect(() => {
        resetError();
    }, [isWalletConnected]);

    useEffect(() => {
        voterBalanceHandler();
        totalVoteHandler();
    }, [isWalletConnected, error]);

    return (
        <div className="App">
            <main>
                <header className="App-header">
                    <h1>Vote for the better color.</h1>
                </header>
                {error !== null && (
                    <div className="error">
                        <h4>{error}</h4>
                    </div>
                )}
                {!isWalletConnected && (
                    <h3>👇Connect your MetaMask wallet to begin 👇</h3>
                )}
                {isWalletConnected && (
                    <article>
                        <div className="faceOff">
                            <div
                                className="blue"
                                style={{
                                    flexGrow: totalBlue * Math.pow(10, 3),
                                }}
                            >
                                <div className="blueText">
                                    <p>
                                        {(
                                            (100 * totalBlue) /
                                            totalVotes
                                        ).toFixed(2)}
                                        %
                                    </p>
                                </div>
                            </div>
                            <div
                                className="red"
                                style={{ flexGrow: totalRed * Math.pow(10, 3) }}
                            >
                                <div className="redText">
                                    <p>
                                        {(
                                            (100 * totalRed) /
                                            totalVotes
                                        ).toFixed(2)}
                                        %
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p>
                            <code>{totalBlue}</code> ether voted for blue and{" "}
                            <code>{totalRed}</code> ether voted for red
                        </p>
                        {voterBlueBalance !== "0.0" && (
                            <p>
                                You have voted <code>{voterBlueBalance}</code>{" "}
                                ether towards blue.
                            </p>
                        )}
                        {voterRedBalance !== "0.0" && (
                            <p>
                                You have voted <code>{voterRedBalance}</code>{" "}
                                ether towards red.
                            </p>
                        )}
                        {voterBlueBalance === "0.0" &&
                            voterRedBalance === "0.0" && (
                                <p>You have not voted.</p>
                            )}
                    </article>
                )}
                <footer>
                    <button
                        className="btn-connect"
                        onClick={checkIfWalletIsConnected}
                    >
                        {" "}
                        {isWalletConnected
                            ? "Disconnect Wallet"
                            : "Connect Wallet"}{" "}
                    </button>{" "}
                    <h2 className="footerAddress">{voterAddress}</h2>
                </footer>
            </main>
        </div>
    );
}

export default App;
