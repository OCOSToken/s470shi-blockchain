# scripts/multi_sig_dao.py

"""
OCOS DAO — Multi-Signature BTC Workflow
Creates a multi-sig (e.g. 5-of-7) address, generates PSBT for outgoing transaction,
and supports signing & combining PSBTs for final broadcast.
!! Never store or share private keys in this script or repo !!
"""

from bitcoinlib.wallets import Wallet
from bitcoinlib.transactions import Transaction
from decimal import Decimal

# ----- User Configuration -----
PUBKEYS = [
    # Replace with actual xpubs or public keys of signers (NEVER private keys!)
    # e.g. 'xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKp6...', 'xpub6E8yz...', ...
]
M_SIG = 5    # Minimum signatures required (e.g., 5-of-7)
N_TOTAL = 7  # Total signers

DAO_MULTISIG_NAME = "OCOS_DAO_MULTISIG"
NETWORK = 'bitcoin'  # Use 'testnet' for test purposes

TARGET_ADDRESS = "1C4H17Ec1DRxSYJUEPB8xhnoWKiPhnrsXp"
AMOUNT_BTC = Decimal("0.047")

def create_multisig_wallet():
    print(f"Creating multi-sig ({M_SIG}-of-{N_TOTAL}) wallet...")
    wallet = Wallet.create(
        DAO_MULTISIG_NAME,
        keys=PUBKEYS,
        network=NETWORK,
        multisig=(M_SIG, N_TOTAL),
        witness_type='segwit'
    )
    address = wallet.get_key().address
    print(f"DAO Multi-sig BTC Address: {address}")
    print("Share this address with DAO senders.")
    return wallet

def create_psbt(wallet):
    print(f"\nCreating PSBT for outgoing payment {AMOUNT_BTC} BTC to {TARGET_ADDRESS}")
    tx = wallet.transaction_create(
        outputs=[(TARGET_ADDRESS, AMOUNT_BTC)],
        fee=10000,
        offline=True,
        replace_by_fee=True
    )
    psbt_path = f"psbt_to_{TARGET_ADDRESS[-6:]}.psbt"
    with open(psbt_path, "wb") as f:
        f.write(tx.psbt)
    print(f"Unsigned PSBT file created: {psbt_path}")
    return psbt_path

def sign_psbt(wallet, psbt_path, output_path):
    print(f"Signing PSBT: {psbt_path} (must be performed by each signer OFFLINE)")
    tx = Transaction.import_psbt(psbt_path, network=NETWORK)
    tx.sign(wallet)
    with open(output_path, "wb") as f:
        f.write(tx.psbt)
    print(f"Signed PSBT written to: {output_path}")
    return output_path

def combine_and_broadcast(psbt_paths, wallet):
    print("Combining signed PSBTs...")
    txs = [Transaction.import_psbt(p, network=NETWORK) for p in psbt_paths]
    tx_final = txs[0]
    for tx in txs[1:]:
        tx_final.combine(tx)
    print(f"Final combined PSBT ready. You can now broadcast after all signatures are present.")
    # Optional: tx_final.send() to broadcast, if enough signatures
    return tx_final

if __name__ == "__main__":
    print("=== OCOS DAO Multi-Sig BTC Workflow ===")
    print("!! Never include private keys or mnemonics in this script or anywhere in the repo !!")

    # STEP 1: Multi-sig wallet creation (run only once)
    # wallet = create_multisig_wallet()

    # STEP 2: For outgoing payment (from multi-sig)
    # wallet = Wallet(DAO_MULTISIG_NAME)
    # psbt_file = create_psbt(wallet)

    # STEP 3: Each signer loads wallet and signs PSBT OFFLINE (repeat for each signer)
    # sign_psbt(wallet, "psbt_to_....psbt", "signed_by_signerX.psbt")

    # STEP 4: Combine all signed PSBTs and broadcast (when M_SIG signatures are present)
    # tx_final = combine_and_broadcast(["signed_by_signer1.psbt", "signed_by_signer2.psbt", ...], wallet)
    # tx_final.send()  # To broadcast to network

    print("\nFull workflow: Create multi-sig wallet → create PSBT → each signer signs offline → combine → broadcast.")
    print("Track all TXIDs and address in DAO monitoring tools for full audit & transparency.")

