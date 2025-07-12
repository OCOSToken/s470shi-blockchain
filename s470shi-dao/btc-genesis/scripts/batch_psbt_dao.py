# scripts/batch_psbt_dao.py

"""
OCOS DAO Bitcoin Genesis — Batch PSBT Generator
Creates unsigned PSBT transactions for each legacy address to DAO address.
Sign all PSBTs offline and broadcast from a trusted node.
NEVER include or share private keys in code or repo!
"""

from bitcoinlib.wallets import Wallet
from decimal import Decimal

# ----- User configuration -----
DAO_ADDRESS = "1C4H17Ec1DRxSYJUEPB8xhnoWKiPhnrsXp"
AMOUNT_BTC = Decimal("0.047")

SENDERS = [
    # ("wallet_name", "from_address")
    ("wallet1", "1GkQmKAmHtNfnD3LHhTkewJxKHVSta4m2a"),
    ("wallet2", "12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S"),
    ("wallet3", "12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX"),
    ("wallet4", "1HLoD9E4SDFFPDiYfNYnkBLQ85Y51J3Zb1"),
    ("wallet5", "1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR"),
    ("wallet6", "15ubicBBWFnvoZLT7GiU2qxjRaKJPdkDMG"),
    ("wallet7", "1JfbZRwdDHKZmuiZgYArJZhcuuzuw2HuMu")
    ("wallet8", "16LoW7y83wtawMg5XmT4M3Q7EdjjUmenjM")
    ("wallet9", "1J6PYEzr4CUoGbnXrELyHszoTSz3wCsCaj")
    ("wallet10", "1PSSGeFHDnKNxiEyFrD1wcEaHr9hrQDDWc")
    ("wallet11", "1A1...Na")
]

NETWORK = 'bitcoin'  # mainnet

def create_psbt(wallet_name, from_address):
    print(f"\nPreparing PSBT for {from_address} → {DAO_ADDRESS} (amount: {AMOUNT_BTC} BTC)")

    # Wallet must be created/imported offline with the correct private key (not in code!)
    try:
        w = Wallet(wallet_name, network=NETWORK)
    except Exception as e:
        print(f"ERROR: Wallet '{wallet_name}' not found in bitcoinlib. Please create/import it offline! ({e})")
        return

    # Select UTXOs (bitcoinlib does this automatically)
    try:
        tx = w.transaction_create(
            outputs=[(DAO_ADDRESS, AMOUNT_BTC)],
            fee=10000,     # you can adjust the fee
            offline=True,
            replace_by_fee=True
        )
        psbt_path = f"psbt_{from_address[-6:]}.psbt"
        with open(psbt_path, "wb") as f:
            f.write(tx.psbt)
        print(f"PSBT file created: {psbt_path} (unsigned, sign this offline!)")
    except Exception as ex:
        print(f"ERROR during PSBT creation for {from_address}: {ex}")

if __name__ == "__main__":
    print("=== OCOS DAO Genesis — Batch PSBT Creator ===")
    print("!! WARNING: Never store or export your private key in this script or repo. !!")
    print("Run this script only on your offline/secure machine.")
    for wallet_name, from_address in SENDERS:
        create_psbt(wallet_name, from_address)
    print("\nAll unsigned PSBTs created. Now sign them offline with your hardware wallet or air-gapped machine.\nThen broadcast via full node or trusted explorer.")
