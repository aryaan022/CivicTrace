const validator = require("aadhaar-validator");
const crypto = require("crypto");

/**
 * Validates format using the installed aadhaar-validator package
 */
function validateAadhaar(aadhaar) {
    return validator.isValidNumber(aadhaar);
}

/**
 * Creates a unique SHA-256 hash using an environmental secret salt
 */
function hashAadhaar(aadhaar) {
    const salt = process.env.AADHAAR_SECRET || "default_civictrace_secure_pepper";
    return crypto.createHmac("sha256", salt).update(aadhaar).digest("hex");
}

module.exports = {
    validateAadhaar,
    hashAadhaar
};
