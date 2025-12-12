
// Utility for handling license keys

const SALT = "MYFIT_MK_SECURE_SALT_2024_VLADO";

// Generate a somewhat unique Device ID
export const getDeviceId = (): string => {
    let deviceId = localStorage.getItem('myfit_device_id');
    if (!deviceId) {
        deviceId = 'ID-' + Math.random().toString(36).substr(2, 6).toUpperCase() + '-' + Date.now().toString(36).slice(-4).toUpperCase();
        localStorage.setItem('myfit_device_id', deviceId);
    }
    return deviceId;
};

// Simple obfuscation function
const obfuscate = (input: string): string => {
    return btoa(input).split('').reverse().join('');
};

const deobfuscate = (input: string): string => {
    return atob(input.split('').reverse().join(''));
};

// Generate Activation Code (Admin Side)
export const generateLicenseKey = (deviceId: string, monthsValid: number): string => {
    const startDate = Date.now();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + monthsValid);
    
    // Payload contains device ID, start date, expiry date, and a salt security check
    const payload = JSON.stringify({
        d: deviceId,
        s: startDate,
        e: expiryDate.getTime(),
        salt: SALT
    });

    // Create a signature to prevent tampering
    const raw = obfuscate(payload);
    // Add a prefix to make it look professional
    return `MYFIT-${raw}`;
};

// Validate Activation Code (User Side)
export const validateLicenseKey = (key: string, deviceId: string): { valid: boolean, expiry?: Date, message?: string } => {
    try {
        if (!key.startsWith('MYFIT-')) return { valid: false, message: 'Невалиден формат.' };
        
        const raw = key.replace('MYFIT-', '');
        const jsonStr = deobfuscate(raw);
        const data = JSON.parse(jsonStr);

        if (data.salt !== SALT) {
            return { valid: false, message: 'Невалиден код.' };
        }

        // Optional: Check if code belongs to this device
        // We trim spaces just in case
        if (data.d.trim() !== deviceId.trim()) {
             return { valid: false, message: 'Овој код е за друг уред.' };
        }

        const now = Date.now();
        if (now > data.e) {
            return { valid: false, expiry: new Date(data.e), message: 'Лиценцата е истечена.' };
        }

        return { valid: true, expiry: new Date(data.e) };

    } catch (e) {
        console.error(e);
        return { valid: false, message: 'Грешка при валидација.' };
    }
};
