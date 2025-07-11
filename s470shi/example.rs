// S470SHI Hybrid Blockchain Language — Rust Example
// -------------------------------------------------
// Minimal, secure, and idiomatic blockchain core
// © 2025 Ocoshy Nakomoto & OCOSToken Community

use sha2::{Sha256, Digest};
use std::time::{SystemTime, UNIX_EPOCH};
use std::fmt;

#[derive(Clone)]
struct Transaction {
    sender: String,
    receiver: String,
    amount: f64,
    data: String,
}

impl fmt::Display for Transaction {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{} -> {}: {} | {}", self.sender, self.receiver, self.amount, self.data)
    }
}

#[derive(Clone)]
struct Block {
    index: usize,
    previous_hash: String,
    timestamp: u64,
    transactions: Vec<Transaction>,
    nonce: u64,
    hash: String,
}

impl Block {
    fn new(index: usize, previous_hash: String, transactions: Vec<Transaction>) -> Self {
        let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
        let mut block = Block {
            index,
            previous_hash,
            timestamp,
            transactions,
            nonce: 0,
            hash: String::new(),
        };
        block.hash = block.calculate_hash();
        block
    }

    fn calculate_hash(&self) -> String {
        let tx_str: String = self.transactions.iter().map(|t| t.to_string()).collect();
        let input = format!("{}{}{}{}{}", self.index, self.previous_hash, self.timestamp, tx_str, self.nonce);
        let mut hasher = Sha256::new();
        hasher.update(input.as_bytes());
        let result = hasher.finalize();
        format!("{:x}", result)
    }
}

struct S470SHIChain {
    chain: Vec<Block>,
    pending_transactions: Vec<Transaction>,
    difficulty: usize,
}

impl S470SHIChain {
    fn new() -> Self {
        let mut blockchain = S470SHIChain {
            chain: vec![],
            pending_transactions: vec![],
            difficulty: 3,
        };
        blockchain.chain.push(blockchain.create_genesis_block());
        blockchain
    }

    fn create_genesis_block(&self) -> Block {
        let genesis_tx = Transaction {
            sender: "0".into(),
            receiver: "DAO_TREASURY".into(),
            amount: 21_000_000.0,
            data: "Genesis supply".into(),
        };
        Block::new(0, "0".into(), vec![genesis_tx])
    }

    fn get_latest_block(&self) -> &Block {
        self.chain.last().unwrap()
    }

    fn add_transaction(&mut self, tx: Transaction) {
        self.pending_transactions.push(tx);
    }

    fn mine_pending_transactions(&mut self, miner_address: &str) {
        if self.pending_transactions.is_empty() {
            println!("No transactions to mine.");
            return;
        }
        let mut new_block = Block::new(
            self.chain.len(),
            self.get_latest_block().hash.clone(),
            self.pending_transactions.clone(),
        );
        println!(
            "Mining block #{} with {} txs...",
            new_block.index,
            new_block.transactions.len()
        );
        self.proof_of_work(&mut new_block);
        self.chain.push(new_block);
        self.pending_transactions = vec![Transaction {
            sender: "SYSTEM".into(),
            receiver: miner_address.into(),
            amount: 1.0,
            data: "Mining reward".into(),
        }];
    }

    fn proof_of_work(&self, block: &mut Block) {
        let target = "0".repeat(self.difficulty);
        while &block.hash[0..self.difficulty] != target {
            block.nonce += 1;
            block.hash = block.calculate_hash();
        }
        println!("Block mined: {}", block.hash);
    }

    fn is_chain_valid(&self) -> bool {
        for i in 1..self.chain.len() {
            let curr = &self.chain[i];
            let prev = &self.chain[i - 1];
            if curr.hash != curr.calculate_hash() {
                println!("Invalid hash at block {}", i);
                return false;
            }
            if curr.previous_hash != prev.hash {
                println!("Invalid previous hash at block {}", i);
                return false;
            }
        }
        true
    }
}

fn main() {
    let mut chain = S470SHIChain::new();
    chain.add_transaction(Transaction {
        sender: "alice".into(),
        receiver: "bob".into(),
        amount: 100.0,
        data: "".into(),
    });
    chain.add_transaction(Transaction {
        sender: "bob".into(),
        receiver: "carol".into(),
        amount: 50.0,
        data: "Test payment".into(),
    });

    chain.mine_pending_transactions("miner1");
    chain.add_transaction(Transaction {
        sender: "carol".into(),
        receiver: "alice".into(),
        amount: 25.0,
        data: "Return payment".into(),
    });
    chain.mine_pending_transactions("miner2");

    for block in &chain.chain {
        println!(
            "Block {} [hash: {}...], txs: {}, nonce: {}",
            block.index,
            &block.hash[..12],
            block.transactions.len(),
            block.nonce
        );
    }

    println!("Chain valid: {}", chain.is_chain_valid());

    // Philosophical message
    println!(
        "\n\"A chain is not built by code, but by the shared trust of strangers.\" — S470SHI Genesis"
    );
}
