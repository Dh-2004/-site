// Function to generate a key using LCG
function linearCongruentialGenerator(seed, count) {
    const a = 1103515245;
    const c = 12345;
    const m = 2**31;
    let key = [];
    let current = seed;
    for (let i = 0; i < count; i++) {
        current = (a * current + c) % m;
        key.push(current % 256); // Use a byte for key
    }
    return key;
}

// Function to generate a key using BBS
function blumBlumShubGenerator(seed, p, q, numBits) {
    if (p % 4 !== 3 || q % 4 !== 3) {
        alert("p and q must be Blum primes (congruent to 3 mod 4).");
        return null;
    }
    const M = p * q;
    let x = (seed * seed) % M;
    let bits = [];
    for (let i = 0; i < numBits; i++) {
        x = (x * x) % M;
        bits.push(x % 2); // Get the least significant bit
    }
    return bits;
}

// Function to perform simple XOR encryption/decryption
function xorEncryptDecrypt(message, key) {
    let output = "";
    for (let i = 0; i < message.length; i++) {
        const charCode = message.charCodeAt(i);
        const keyChar = key[i % key.length];
        output += String.fromCharCode(charCode ^ keyChar);
    }
    return output;
}

// Helper function: Convert string to hex
function toHex(str) {
    return str.split("").map(c =>
        c.charCodeAt(0).toString(16).padStart(2, "0")
    ).join(" ");
}

// LCG Simulation Handler
function runLcgSimulation() {
    const message = document.getElementById("lcg-message").value;
    const seed = parseInt(document.getElementById("lcg-key").value);
    
    const key = linearCongruentialGenerator(seed, message.length);
    
    // Encrypt
    const encrypted = xorEncryptDecrypt(message, key);
    document.getElementById("lcg-encrypted").textContent = "" + toHex(encrypted);

    // Decrypt (using the same key)
    const decrypted = xorEncryptDecrypt(encrypted, key);
    document.getElementById("lcg-decrypted").textContent = "" + decrypted;
}

// BBS Simulation Handler
function runBbsSimulation() {
    const message = document.getElementById("bbs-message").value;
    const p = parseInt(document.getElementById("bbs-p").value);
    const q = parseInt(document.getElementById("bbs-q").value);
    const seed = parseInt(document.getElementById("bbs-seed").value);

    // To use BBS with XOR, we need a key of bytes, so we group 8 bits at a time.
    const keyBits = blumBlumShubGenerator(seed, p, q, message.length * 8);

    if (!keyBits) return;

    // Convert bit stream to byte key
    const byteKey = [];
    for (let i = 0; i < keyBits.length; i += 8) {
        let byte = 0;
        for (let j = 0; j < 8; j++) {
            byte = (byte << 1) | keyBits[i + j];
        }
        byteKey.push(byte);
    }
    
    // Encrypt
    const encrypted = xorEncryptDecrypt(message, byteKey);
    document.getElementById("bbs-encrypted").textContent = "" + toHex(encrypted);
    
    // Decrypt
    const decrypted = xorEncryptDecrypt(encrypted, byteKey);
    document.getElementById("bbs-decrypted").textContent = "" + decrypted;
}
