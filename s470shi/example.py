"""
S470SHI Hybrid Blockchain Language — Python Example
---------------------------------------------------
A minimal, readable, and extensible blockchain implementation.
© 2025 Ocoshy Nakomoto & OCOSToken Community
"""

import hashlib
import time
from typing import List, Any

class Transaction:
    def __init__(self, sender: str, receiver: str, amount: float, data: str = ""):
        self.sender = sender
        self.receiver = receiver
        self.amount = amount
        self.data = data

    def __repr__(self):
        return f"Transaction(from={self.sender}, to={self.receiver}, amount={self.amount}, data='{self.data}')"

class Block:
    def __init__(self, index: int, previous_hash: str, timestamp: float, transactions: List[Transaction], nonce: int = 0):
        self.index = index
        self.previous_hash = previous_hash
        self.timestamp = timestamp
        self.transactions = transactions
        self.nonce = nonce
        self.hash = self.calculate_hash()

    def calculate_hash(self) -> str:
        block_string = (
            str(self.index) + self.previous_hash + str(self.timestamp) +
            str([str(tx) for tx in self.transactions]) + str(self.nonce)
        )
        return hashlib.sha256(block_string.encode()).hexdigest()

    def __repr__(self):
        return (f"Block(index={self.index}, hash={self.hash[:12]}..., "
                f"transactions={len(self.transactions)}, nonce={self.nonce})")

class S470SHIChain:
    def __init__(self):
        self.chain: List[Block] = [self.create_genesis_block()]
        self.pending_transactions: List[Transaction] = []
        self.difficulty = 3  # Adjustable mining difficulty

    def create_genesis_block(self) -> Block:
        genesis_tx = Transaction("0", "DAO_TREASURY", 21_000_000, "Genesis supply")
        return Block(0, "0", time.time(), [genesis_tx])

    def get_latest_block(self) -> Block:
        return self.chain[-1]

    def add_transaction(self, transaction: Transaction):
        self.pending_transactions.append(transaction)

    def mine_pending_transactions(self, miner_address: str):
        if not self.pending_transactions:
            print("No transactions to mine.")
            return

        new_block = Block(
            index=len(self.chain),
            previous_hash=self.get_latest_block().hash,
            timestamp=time.time(),
            transactions=self.pending_transactions.copy()
        )
        print(f"Mining block #{new_block.index} with {len(new_block.transactions)} txs...")
        self.proof_of_work(new_block)
        self.chain.append(new_block)
        self.pending_transactions = [Transaction("SYSTEM", miner_address, 1, "Mining reward")]

    def proof_of_work(self, block: Block):
        target = "0" * self.difficulty
        while not block.hash.startswith(target):
            block.nonce += 1
            block.hash = block.calculate_hash()
        print(f"Block mined: {block.hash}")

    def is_chain_valid(self) -> bool:
        for i in range(1, len(self.chain)):
            curr = self.chain[i]
            prev = self.chain[i - 1]
            if curr.hash != curr.calculate_hash():
                print(f"Invalid hash at block {i}")
                return False
            if curr.previous_hash != prev.hash:
                print(f"Invalid previous hash at block {i}")
                return False
        return True

# --- Usage Example ---
if __name__ == "__main__":
    chain = S470SHIChain()
    chain.add_transaction(Transaction("alice", "bob", 100))
    chain.add_transaction(Transaction("bob", "carol", 50, "Test payment"))

    chain.mine_pending_transactions("miner1")
    chain.add_transaction(Transaction("carol", "alice", 25, "Return payment"))
    chain.mine_pending_transactions("miner2")

    for block in chain.chain:
        print(block)

    print("Chain valid:", chain.is_chain_valid())

    # Philosophical message
    print("\n\"A chain is not built by code, but by the shared trust of strangers.\" — S470SHI Genesis")
