// scripts/monitor_btc.js
/**
 * OCOS DAO — Bitcoin Genesis Monitor
 * Watches the DAO BTC address for required payments from a list of legacy addresses.
 * Uses Blockstream public API (https://blockstream.info/api)
 * No private keys are ever used or stored!
 */

const axios = require("axios");
const fs = require("fs");
const path = require("path");

// --- Load config ---
const signers = require("../config/signers.json");    // Sender addresses: ["1A1z...", ...]
const daoConfig = require("../config/dao.json");      // { "dao_btc_address": "...", "required_amount": 0.047, "required_signers": 7 }

const DAO_ADDRESS = daoConfig.dao_btc_address;
const REQUIRED_AMOUNT = Number(daoConfig.required_amount); // BTC
const REQUIRED_SIGNERS = daoConfig.required_signers || signers.length;

const API = "https://blockstream.info/api";

async function getDaoTxs() {
    const url = `${API}/address/${DAO_ADDRESS}/txs`;
    const resp = await axios.get(url);
    return resp.data; // Array of TXs
}

function extractInputs(tx) {
    //[ { address: "...", value: sats } ]
    return tx.vin.map(vin =>
        vin.prevout
            ? { address: vin.prevout.scriptpubkey_address, value: vin.prevout.value }
            : { address: null, value: 0 }
    );
}

function extractOutputs(tx) {
    return tx.vout.map(vout => ({
        address: vout.scriptpubkey_address,
        value: vout.value, // S470SHI
    }));
}

function btcFromSats(sats) {
    return sats / 1e8;
}

async function monitorPayments() {
    try {
        const txs = await getDaoTxs();

        // 
        let receivedFrom = {};
        for (const signer of signers) {
            receivedFrom[signer] = null; // null - no payment yet
            for (const tx of txs) {
                // Check inputs: was this tx signed by signer?
                const inputs = extractInputs(tx);
                const fromSigner = inputs.some(input => input.address === signer);

                if (fromSigner) {
                    // Check outputs: did signer send required amount to DAO address?
                    const outputs = extractOutputs(tx);
                    for (const out of outputs) {
                        if (
                            out.address === DAO_ADDRESS &&
                            btcFromSats(out.value) >= REQUIRED_AMOUNT
                        ) {
                            receivedFrom[signer] = {
                                txid: tx.txid,
                                amount: btcFromSats(out.value),
                                time: tx.status.block_time || null
                            };
                            break;
                        }
                    }
                }
                if (receivedFrom[signer]) break;
            }
        }

        // Status çıxışı
        let confirmed = Object.values(receivedFrom).filter(Boolean).length;
        console.log(`\n${new Date().toISOString()} — ${confirmed} of ${REQUIRED_SIGNERS} required payments detected.\n`);
        for (const [signer, status] of Object.entries(receivedFrom)) {
            if (status) {
                console.log(`✓ ${signer} sent ${status.amount} BTC (TXID: ${status.txid})`);
            } else {
                console.log(`✗ ${signer} — payment not detected`);
            }
        }

        if (confirmed >= REQUIRED_SIGNERS) {
            console.log("\n🎉 DAO ACTIVATION COMPLETE: All required payments received!\n");
            // backend/smart contract/notification trigger
            // e.g. sendWebhook(), updateDatabase(), etc.
        }
    } catch (err) {
        console.error("Error during DAO BTC monitor:", err.message);
    }
}

// Periodic run (every 1 minute)
monitorPayments();
setInterval(monitorPayments, 60 * 1000);

