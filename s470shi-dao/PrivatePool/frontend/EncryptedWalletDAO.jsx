// frontend/EncryptedWalletDAO.jsx
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CONTRACT_ABI from "./EncryptedWalletDAO.abi.json";

const CONTRACT_ADDRESS = "0xDAOContractAddress";
const provider = new ethers.providers.JsonRpcProvider("https://rpc.ocosdao.net");
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

export default function EncryptedWalletDAO() {
  const [proposals, setProposals] = useState([]);
  const [desc, setDesc] = useState("");
  const [walletIdx, setWalletIdx] = useState("");
  const [duration, setDuration] = useState(3600);

  useEffect(() => {
    // Fetch proposals from backend or smart contract as needed
  }, []);

  const createProposal = async () => {
    // Add wallet connection and signing here (Metamask or other provider)
    // await contract.createProposal(desc, walletIdx, duration);
    alert("Proposal creation depends on backend/wallet integration.");
  };

  return (
    <div>
      <h2>Encrypted Legacy Wallet Governance</h2>
      <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Proposal description" />
      <input value={walletIdx} onChange={e => setWalletIdx(e.target.value)} placeholder="Wallet Index" />
      <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="Voting Duration (sec)" />
      <button onClick={createProposal}>Create Proposal</button>
      <h3>Proposals List (demo)</h3>
      <ul>
        {/* Render proposals here */}
      </ul>
    </div>
  );
}
