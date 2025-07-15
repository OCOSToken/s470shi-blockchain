
# Universal Energy Protocol (UEP)

Növbəti nəsil DAO-lar, Web3 və sosial platformalar üçün tam modul, təhlükəsiz və DAO tərəfindən idarə olunan enerji və reputasiya infrastrukturudur.

> **Qeyd:**  
> Bu protokol, arxitektura, bütün modul və smart contract-lar **OCOS və S470SHI DAO-ları üçün tam uyğunlaşdırılıb**.  
> **Hazırda hər DAO öz UniversalEnergyProtocol instansiyası ilə işləyir.**  
> Yekun mərhələdə isə hər iki sistem **vahid enerji-reputasiya-governance qatında birləşdiriləcək**.

---

## 🌐 Birləşik Missiya: OCOS + S470SHI

- **OCOS DAO** və **S470SHI DAO** — eyni arxitektura, modul və idarəetmə modelinə sahib paralel DAO-lardır.
- Buradakı bütün smart contract-lar, modullar, təhlükəsizlik və governance qatları həm OCOS, həm də S470SHI üçün problemsiz işləyir.
- **Roadmap:** Sonda bütün protokol balansları, reputasiya, modullar və governance tarixi birləşdirilərək, vahid DAO infrastrukturunda toplanacaq.

---

## 🚀 Xüsusiyyətlər

- **Modul ENERGY token (ERC-20 uyğun)**  
  Mint və burn yalnız DAO tərəfindən təsdiqlənmiş modullar vasitəsilə mümkündür (staking, oracle, NFT və s.)
- **Reputasiya və Fəaliyyət Qatı**  
  Hər istifadəçi üçün on-chain reputasiya və loyalty izlənməsi.
- **Plug-and-play Modullar**  
  Staking, NFT unlock, oracle bridge, oyunlaşdırılmış istifadə — hamısı DAO tərəfindən aktivləşdirilir.
- **DAO Governance**  
  On-chain səsvermə, parametrlərin dəyişdirilməsi, modul idarəçiliyi — 100% şəffaf və auditə açıq.
- **Multi-DAO Birləşməsi**  
  Hər iki DAO müstəqil işləsə də, protokolun vəziyyəti və idarəçiliyi tam vahid ekosistemə birləşdirilə bilər.

---

## 🛠️ Arxitektura Baxışı

- `UniversalEnergyProtocol.sol`: Əsas ERC-20 + reputasiya + modul mexanizmi
- `StakingModule.sol`: Staking üçün ENERGY qazancı, DAO tərəfindən idarə olunan dinamik reward
- `NftUnlockModule.sol`: ENERGY burn etməklə NFT unlock və mint, tam audit
- `OracleBridgeModule.sol`: Oracle və ya cross-chain hadisələrə əsaslanan ENERGY reward
- `IModule.sol`: Bütün modullar üçün standart interface (audit və governance uyğunluğu)

Bütün modullar **yalnız DAO-nun izni ilə** əlavə edilir.  
İstifadəçi əməliyyatları birbaşa protokoldan yox, yalnız modullar vasitəsilə həyata keçirilir.

---

## 🧭 DAO Həyat Dövrü

1. **OCOS DAO** və **S470SHI DAO** UniversalEnergyProtocol-un paralel instansiyaları ilə fəaliyyət göstərir.
2. Hər DAO öz modullarını, parametrlərini və reputasiya sistemini müstəqil şəkildə idarə edir.
3. "Birləşmə bloku"nda, hər iki DAO **on-chain merge** əməliyyatı aparır:
   - ENERGY, reputasiya və modullar birləşdirilir
   - Governance tam vahid multi-DAO sisteminə keçir
   - Bütün keçmiş və gələcək əməliyyatlar tam audit-trail şəklində qorunur

---

## 🗂️ Layihə Strukturu

```
contracts/       → Solidity smart contract-lar (əsas və modullar)
interfaces/      → IModule və digər interfeyslər
scripts/         → Deploy, verify, faucet və yardımçı skriptlər
test/            → Unit və integration testlər (DAO, staking, NFT, oracle)
docs/            → Arxitektura, governance və diaqramlar
.github/         → CI, PR/issue templatelər, workflows
```

---

## 🔒 Təhlükəsizlik və Standartlar

- Bütün mint/burn əməliyyatları üçün DAO tərəfindən icazə verilmiş modul olmalıdır (ictimai mint yoxdur)
- DAO multi-sig və ya contract vasitəsilə bütün yenilənmələr və kritik əməliyyatlar idarə olunur
- Replay protection, on-chain log və audit açıqlığı
- [SECURITY.md](SECURITY.md) sənədinə baxın: disclosure, bounty və audit qaydaları

---

## 👨‍💻 Developer üçün Qısa Başlanğıc

- [Node.js](https://nodejs.org/)
- [Hardhat](https://hardhat.org/)
- [ethers.js](https://docs.ethers.org/)
- [Solidity](https://docs.soliditylang.org/en/latest/)

Başlamaq üçün:
```bash
git clone https://github.com/s470shi/universal-energy-protocol.git
cd universal-energy-protocol
yarn install
npx hardhat test
```

---

## 🪪 Lisenziya

MIT © 2025 — OCOS DAO, S470SHI DAO  
Bax: [LICENSE](LICENSE)

---

## 🌐 Əlavə Məlumat

- Protokol sənədləri: [docs/architecture.md](docs/architecture.md)
- Təhlükəsizlik: [SECURITY.md](SECURITY.md)
- DAO portalı: [s470shi.org](https://s470shi.org)
- Bug və təhlükəsizlik: [security@s470shi.org](mailto:security@s470shi.org)

---

**OCOS və S470SHI: İki DAO, bir gələcək.  
Enerji, merit və governance üçün vahid on-chain ekosistem.**
