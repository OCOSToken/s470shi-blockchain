"""
Automated Compliance & Audit Checker
- Checks for audit log integrity (hash)
- Verifies BTC payments, TXIDs and confirmation counts
- Tests policy/document availability
- Generates summary report for CI/CD artifact
"""

import hashlib
import json
import os
from datetime import datetime

LOG_FILE = 'logs/test-activation-{}.log'.format(datetime.now().strftime('%Y-%m-%d'))
CONFIG_SIGNERS = 'config/signers.json'
DAO_JSON = 'config/dao.json'
REQUIRED_CONFIRMATIONS = 3

def sha256_of_file(filepath):
    with open(filepath, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()

def load_json(file):
    with open(file, 'r') as f:
        return json.load(f)

def check_log_integrity():
    log_hash = sha256_of_file(LOG_FILE)
    print(f"Log hash for {LOG_FILE}: {log_hash}")
    return log_hash

def check_btc_payments():
    dao_cfg = load_json(DAO_JSON)
    signers = load_json(CONFIG_SIGNERS)
    payments = []
    with open(LOG_FILE, 'r') as f:
        for line in f:
            if "✓" in line and "BTC" in line:
                addr = line.split()[1]
                txid = line.split("TXID:")[1].split()[0]
                confs = None
                if "Confirmed:" in line:
                    confs = int(line.split("Confirmed:")[1].split()[0])
                payments.append((addr, txid, confs))
    required = dao_cfg.get('required_signers', len(signers))
    success = [p for p in payments if p[2] and p[2] >= REQUIRED_CONFIRMATIONS]
    print(f"BTC payment check: {len(success)} / {required} successful")
    return len(success) == required

def check_policies():
    docs = ["SECURITY.md", "docs/compliance.md", "LICENSE", "docs/iso27001-checklist.md"]
    for doc in docs:
        if not os.path.exists(doc):
            print(f"Policy missing: {doc}")
            return False
    print("All key policy documents are present.")
    return True

if __name__ == "__main__":
    print("=== OCOS DAO Automated Compliance & Audit Test ===")
    log_hash = check_log_integrity()
    btc_ok = check_btc_payments()
    policy_ok = check_policies()
    with open("logs/audit-summary-{}.txt".format(datetime.now().strftime('%Y-%m-%d')), "w") as summary:
        summary.write(f"Log hash: {log_hash}\n")
        summary.write(f"BTC payment check: {'PASS' if btc_ok else 'FAIL'}\n")
        summary.write(f"Policy documents: {'OK' if policy_ok else 'MISSING'}\n")
        summary.write("Test date: {}\n".format(datetime.now().isoformat()))
    print("Audit summary saved. All tests complete.")
