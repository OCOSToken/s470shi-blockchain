// S470SHI Hybrid Blockchain Language — C++ Example
// -----------------------------------------------
// Minimal, extensible, and secure blockchain core
// © 2025 Ocoshy Nakomoto & OCOSToken Community

#include <iostream>
#include <vector>
#include <ctime>
#include <sstream>
#include <iomanip>
#include <openssl/sha.h> // Requires OpenSSL for SHA256

// Transaction Structure
struct Transaction {
    std::string sender;
    std::string receiver;
    double amount;
    std::string data;

    Transaction(const std::string& from, const std::string& to, double amt, const std::string& d = "")
        : sender(from), receiver(to), amount(amt), data(d) {}

    std::string to_string() const {
        std::ostringstream oss;
        oss << sender << "->" << receiver << ":" << amount << "|" << data;
        return oss.str();
    }
};

// SHA256 Hashing Utility
std::string sha256(const std::string& str) {
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256((const unsigned char*)str.c_str(), str.size(), hash);
    std::ostringstream oss;
    for (int i = 0; i < SHA256_DIGEST_LENGTH; i++)
        oss << std::hex << std::setw(2) << std::setfill('0') << (int)hash[i];
    return oss.str();
}

// Block Structure
class Block {
public:
    int index;
    std::string previous_hash;
    std::time_t timestamp;
    std::vector<Transaction> transactions;
    int nonce;
    std::string hash;

    Block(int idx, const std::string& prev_hash, std::time_t ts, const std::vector<Transaction>& txs)
        : index(idx), previous_hash(prev_hash), timestamp(ts), transactions(txs), nonce(0) {
        hash = calculate_hash();
    }

    std::string calculate_hash() const {
        std::ostringstream oss;
        oss << index << previous_hash << timestamp << nonce;
        for (const auto& tx : transactions)
            oss << tx.to_string();
        return sha256(oss.str());
    }
};

// Blockchain Structure
class S470SHIChain {
public:
    std::vector<Block> chain;
    std::vector<Transaction> pending_transactions;
    int difficulty;

    S470SHIChain() : difficulty(3) {
        chain.push_back(create_genesis_block());
    }

    Block create_genesis_block() {
        Transaction genesis_tx("0", "DAO_TREASURY", 21000000, "Genesis supply");
        return Block(0, "0", std::time(nullptr), std::vector<Transaction>{genesis_tx});
    }

    Block get_latest_block() const {
        return chain.back();
    }

    void add_transaction(const Transaction& tx) {
        pending_transactions.push_back(tx);
    }

    void mine_pending_transactions(const std::string& miner_address) {
        if (pending_transactions.empty()) {
            std::cout << "No transactions to mine.\n";
            return;
        }
        Block new_block(chain.size(), get_latest_block().hash, std::time(nullptr), pending_transactions);
        std::cout << "Mining block #" << new_block.index << " with " << new_block.transactions.size() << " txs...\n";
        proof_of_work(new_block);
        chain.push_back(new_block);
        pending_transactions.clear();
        pending_transactions.push_back(Transaction("SYSTEM", miner_address, 1, "Mining reward"));
    }

    void proof_of_work(Block& block) {
        std::string target(difficulty, '0');
        while (block.hash.substr(0, difficulty) != target) {
            block.nonce++;
            block.hash = block.calculate_hash();
        }
        std::cout << "Block mined: " << block.hash << std::endl;
    }

    bool is_chain_valid() const {
        for (size_t i = 1; i < chain.size(); ++i) {
            const Block& curr = chain[i];
            const Block& prev = chain[i - 1];
            if (curr.hash != curr.calculate_hash()) {
                std::cout << "Invalid hash at block " << i << "\n";
                return false;
            }
            if (curr.previous_hash != prev.hash) {
                std::cout << "Invalid previous hash at block " << i << "\n";
                return false;
            }
        }
        return true;
    }
};

// --- Usage Example ---
int main() {
    S470SHIChain chain;
    chain.add_transaction(Transaction("alice", "bob", 100));
    chain.add_transaction(Transaction("bob", "carol", 50, "Test payment"));

    chain.mine_pending_transactions("miner1");
    chain.add_transaction(Transaction("carol", "alice", 25, "Return payment"));
    chain.mine_pending_transactions("miner2");

    for (const auto& block : chain.chain) {
        std::cout << "Block " << block.index << " [hash: " << block.hash.substr(0, 12) << "...], txs: "
                  << block.transactions.size() << ", nonce: " << block.nonce << std::endl;
    }
    std::cout << "Chain valid: " << (chain.is_chain_valid() ? "Yes" : "No") << std::endl;

    // Philosophical message
    std::cout << "\n\"A chain is not built by code, but by the shared trust of strangers.\" — S470SHI Genesis\n";
    return 0;
}
